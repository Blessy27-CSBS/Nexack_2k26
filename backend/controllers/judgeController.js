import Admin from '../models/Admin.js';
import Submission from '../models/Submission.js';
import Evaluation from '../models/Evaluation.js';
import SiteSettings from '../models/SiteSettings.js';

// Admin: Get all judges
export const getAllJudges = async (req, res) => {
  try {
    const judges = await Admin.find({ role: 'judge' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: judges.length, judges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create a new Judge
export const createJudge = async (req, res) => {
  try {
    const { name, email, password, designation, organization, assignedTracks } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const judge = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'judge',
      designation: designation || '',
      organization: organization || '',
      assignedTracks: assignedTracks || []
    });

    res.status(201).json({
      success: true,
      message: 'Judge account created successfully',
      judge: {
        id: judge._id,
        name: judge.name,
        email: judge.email,
        role: judge.role,
        designation: judge.designation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Judge: Get assigned projects & evaluation status
export const getJudgeAssignedProjects = async (req, res) => {
  try {
    const judgeId = req.admin._id;

    // Submissions where this judge is explicitly assigned
    const submissions = await Submission.find({
      assignedJudges: judgeId,
      status: { $in: ['Submitted', 'Under Review', 'Shortlisted', 'Finalist'] }
    })
      .populate('team', 'teamId name')
      .populate('track', 'title trackNumber')
      .sort({ createdAt: -1 });

    // Fetch evaluations already completed by this judge
    const evaluations = await Evaluation.find({ judge: judgeId });
    const evaluatedSubmissionIds = new Set(evaluations.map(e => String(e.submission)));

    const projectsWithStatus = submissions.map(sub => ({
      ...sub.toObject(),
      isEvaluated: evaluatedSubmissionIds.has(String(sub._id)),
      evaluation: evaluations.find(e => String(e.submission) === String(sub._id)) || null
    }));

    res.json({
      success: true,
      projects: projectsWithStatus,
      totalAssigned: submissions.length,
      completed: evaluations.length,
      pending: submissions.length - evaluations.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Judge: Submit or update score
export const submitEvaluation = async (req, res) => {
  try {
    const judgeId = req.admin._id;
    const { submissionId, scores, comments } = req.body;

    if (!submissionId || !scores) {
      return res.status(400).json({ success: false, message: 'Submission ID and scores are required' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Verify judge assignment (or superadmin bypass)
    const isAssigned = submission.assignedJudges.some(j => String(j) === String(judgeId));
    if (!isAssigned && req.admin.role === 'judge') {
      return res.status(403).json({ success: false, message: 'You are not assigned to evaluate this submission' });
    }

    // Check if evaluation already exists and is locked
    let evaluation = await Evaluation.findOne({ judge: judgeId, submission: submissionId });
    if (evaluation && evaluation.isLocked && req.admin.role === 'judge') {
      return res.status(400).json({
        success: false,
        message: 'This evaluation is submitted and locked. Contact the Admin to reopen.'
      });
    }

    // Calculate total weighted score
    const settings = await SiteSettings.findOne();
    const weights = settings?.judgingCriteriaWeights || {
      innovation: 20,
      technicalImplementation: 25,
      problemRelevance: 15,
      userExperience: 15,
      scalability: 10,
      impact: 10,
      presentation: 5
    };

    const innovation = Math.min(Math.max(Number(scores.innovation) || 0, 0), weights.innovation.default || 20);
    const technical = Math.min(Math.max(Number(scores.technicalImplementation) || 0, 0), weights.technicalImplementation.default || 25);
    const relevance = Math.min(Math.max(Number(scores.problemRelevance) || 0, 0), weights.problemRelevance.default || 15);
    const ux = Math.min(Math.max(Number(scores.userExperience) || 0, 0), weights.userExperience.default || 15);
    const scalability = Math.min(Math.max(Number(scores.scalability) || 0, 0), weights.scalability.default || 10);
    const impact = Math.min(Math.max(Number(scores.impact) || 0, 0), weights.impact.default || 10);
    const presentation = Math.min(Math.max(Number(scores.presentation) || 0, 0), weights.presentation.default || 5);

    const totalScore = innovation + technical + relevance + ux + scalability + impact + presentation;

    if (!evaluation) {
      evaluation = await Evaluation.create({
        judge: judgeId,
        submission: submissionId,
        scores: {
          innovation,
          technicalImplementation: technical,
          problemRelevance: relevance,
          userExperience: ux,
          scalability,
          impact,
          presentation
        },
        totalScore,
        comments: comments || '',
        isLocked: true
      });
    } else {
      evaluation.scores = {
        innovation,
        technicalImplementation: technical,
        problemRelevance: relevance,
        userExperience: ux,
        scalability,
        impact,
        presentation
      };
      evaluation.totalScore = totalScore;
      evaluation.comments = comments || '';
      evaluation.isLocked = true;
      await evaluation.save();
    }

    // Update submission's average score across all judges
    const allEvals = await Evaluation.find({ submission: submissionId });
    const avgScore = allEvals.reduce((acc, curr) => acc + curr.totalScore, 0) / allEvals.length;

    submission.averageScore = Math.round(avgScore * 100) / 100;
    submission.evaluationCount = allEvals.length;
    await submission.save();

    res.json({
      success: true,
      message: 'Evaluation submitted and locked successfully',
      evaluation
    });
  } catch (error) {
    console.error('Evaluation submit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Reopen evaluation for a judge
export const unlockEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluation = await Evaluation.findByIdAndUpdate(id, { isLocked: false }, { new: true });
    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }
    res.json({ success: true, message: 'Evaluation unlocked for judge editing', evaluation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
