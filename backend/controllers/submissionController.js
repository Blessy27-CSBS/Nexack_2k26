import Submission from '../models/Submission.js';
import Team from '../models/Team.js';
import SiteSettings from '../models/SiteSettings.js';
import { processFileUpload } from '../middleware/uploadMiddleware.js';

// Get next submission ID (e.g. SUB-2K26-0001)
const getNextSubmissionId = async () => {
  const count = await Submission.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `SUB-2K26-${nextNum}`;
};

// Check if submission deadline has passed
const isDeadlinePassed = async () => {
  const settings = await SiteSettings.findOne();
  if (!settings || !settings.submissionDeadline) return false;
  const now = new Date();
  const deadline = new Date(settings.submissionDeadline);
  return now > deadline && !settings.allowLateSubmissions;
};

// Participant: Get team submission
export const getMySubmission = async (req, res) => {
  try {
    const participant = req.participant;
    const team = await Team.findById(participant.teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const submission = await Submission.findOne({ team: team._id })
      .populate('track', 'title trackNumber')
      .populate('assignedJudges', 'name email');

    res.json({
      success: true,
      submission: submission || null,
      deadlinePassed: await isDeadlinePassed()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Participant: Save Draft or Submit Project
export const saveOrSubmitProject = async (req, res) => {
  try {
    const participant = req.participant;
    const team = await Team.findById(participant.teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check verification status
    if (team.paymentStatus !== 'Verified' && team.registrationStatus !== 'Verified') {
      return res.status(403).json({
        success: false,
        message: 'Your team registration & payment must be verified by the admin before project submission.'
      });
    }

    const {
      projectTitle,
      problemStatement,
      projectDescription,
      proposedSolution,
      keyFeatures,
      technologyStack,
      innovation,
      impact,
      futureScope,
      githubUrl,
      liveDemoUrl,
      figmaUrl,
      videoDemoUrl,
      isFinalSubmit
    } = req.body;

    const deadlinePassed = await isDeadlinePassed();
    if (deadlinePassed && isFinalSubmit) {
      return res.status(400).json({
        success: false,
        message: 'Submission deadline has passed. Late submissions are not accepted.'
      });
    }

    let submission = await Submission.findOne({ team: team._id });

    // Parse array fields
    const parsedTech = typeof technologyStack === 'string'
      ? technologyStack.split(',').map(s => s.trim()).filter(Boolean)
      : (technologyStack || []);

    const parsedFeatures = typeof keyFeatures === 'string'
      ? keyFeatures.split('\n').map(s => s.trim()).filter(Boolean)
      : (keyFeatures || []);

    // File attachments handling
    let documentationUrl = submission?.documentationUrl || '';
    let pptUrl = submission?.pptUrl || '';
    let screenshots = submission?.screenshots || [];

    if (req.files) {
      if (req.files.documentation && req.files.documentation[0]) {
        const docResult = await processFileUpload(req.files.documentation[0], 'submissions/docs');
        documentationUrl = docResult.url;
      }
      if (req.files.ppt && req.files.ppt[0]) {
        const pptResult = await processFileUpload(req.files.ppt[0], 'submissions/ppts');
        pptUrl = pptResult.url;
      }
      if (req.files.screenshots && req.files.screenshots.length > 0) {
        for (const file of req.files.screenshots) {
          const shotResult = await processFileUpload(file, 'submissions/screens');
          screenshots.push(shotResult.url);
        }
      }
    }

    const status = isFinalSubmit ? 'Submitted' : 'Draft';
    const submittedAt = isFinalSubmit ? new Date() : submission?.submittedAt;

    if (!submission) {
      if (isFinalSubmit && (!projectTitle || !projectDescription || !githubUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Project Title, Description, and GitHub URL are mandatory for final submission.'
        });
      }

      const submissionId = await getNextSubmissionId();

      submission = await Submission.create({
        submissionId,
        team: team._id,
        track: team.track,
        projectTitle: projectTitle?.trim() || 'Untitled Project',
        problemStatement: problemStatement || '',
        projectDescription: projectDescription || '',
        proposedSolution: proposedSolution || '',
        keyFeatures: parsedFeatures,
        technologyStack: parsedTech,
        innovation: innovation || '',
        impact: impact || '',
        futureScope: futureScope || '',
        githubUrl: githubUrl?.trim() || '',
        liveDemoUrl: liveDemoUrl?.trim() || '',
        figmaUrl: figmaUrl?.trim() || '',
        videoDemoUrl: videoDemoUrl?.trim() || '',
        documentationUrl,
        pptUrl,
        screenshots,
        status,
        submittedAt,
        isLateSubmission: deadlinePassed
      });

      team.submission = submission._id;
      await team.save();
    } else {
      // If already submitted and locked after deadline
      if (submission.status !== 'Draft' && deadlinePassed) {
        return res.status(400).json({
          success: false,
          message: 'Deadline has passed. Edits to submitted projects are locked.'
        });
      }

      if (projectTitle) submission.projectTitle = projectTitle.trim();
      if (problemStatement !== undefined) submission.problemStatement = problemStatement;
      if (projectDescription) submission.projectDescription = projectDescription;
      if (proposedSolution !== undefined) submission.proposedSolution = proposedSolution;
      if (parsedFeatures.length) submission.keyFeatures = parsedFeatures;
      if (parsedTech.length) submission.technologyStack = parsedTech;
      if (innovation !== undefined) submission.innovation = innovation;
      if (impact !== undefined) submission.impact = impact;
      if (futureScope !== undefined) submission.futureScope = futureScope;
      if (githubUrl) submission.githubUrl = githubUrl.trim();
      if (liveDemoUrl !== undefined) submission.liveDemoUrl = liveDemoUrl.trim();
      if (figmaUrl !== undefined) submission.figmaUrl = figmaUrl.trim();
      if (videoDemoUrl !== undefined) submission.videoDemoUrl = videoDemoUrl.trim();

      if (documentationUrl) submission.documentationUrl = documentationUrl;
      if (pptUrl) submission.pptUrl = pptUrl;
      if (screenshots.length) submission.screenshots = screenshots;

      submission.status = status;
      if (isFinalSubmit) submission.submittedAt = submittedAt;

      await submission.save();
    }

    res.json({
      success: true,
      message: isFinalSubmit ? 'Project submitted successfully!' : 'Project draft saved.',
      submission
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all submissions
export const getAllSubmissionsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, track = '', status = '', search = '' } = req.query;

    const query = {};
    if (track) query.track = track;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { projectTitle: { $regex: search, $options: 'i' } },
        { submissionId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Submission.countDocuments(query);

    const submissions = await Submission.find(query)
      .populate('team', 'teamId name leader members')
      .populate('track', 'trackNumber title')
      .populate('assignedJudges', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      submissions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update submission status
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('team', 'teamId name').populate('track', 'title');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, message: `Submission status updated to ${status}`, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Assign Judges to Submission
export const assignJudgesToSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { judgeIds = [] } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { assignedJudges: judgeIds },
      { new: true }
    ).populate('assignedJudges', 'name email');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.json({ success: true, message: 'Judges assigned successfully', submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
