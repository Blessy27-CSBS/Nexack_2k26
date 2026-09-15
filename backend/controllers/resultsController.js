import Result from '../models/Result.js';
import SiteSettings from '../models/SiteSettings.js';
import Team from '../models/Team.js';
import Submission from '../models/Submission.js';

// Public: Get published results
export const getPublicResults = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings || !settings.isResultsPublished) {
      return res.json({
        success: true,
        isPublished: false,
        message: 'Results will be announced soon.',
        results: []
      });
    }

    const results = await Result.find({ status: 'Published' })
      .populate({
        path: 'team',
        select: 'teamId name members',
        populate: { path: 'track', select: 'title trackNumber' }
      })
      .populate('submission', 'projectTitle githubUrl liveDemoUrl')
      .sort({ rank: 1, displayOrder: 1 });

    res.json({
      success: true,
      isPublished: true,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all results (draft + published)
export const getAllResultsAdmin = async (req, res) => {
  try {
    const results = await Result.find()
      .populate({
        path: 'team',
        select: 'teamId name leader',
        populate: { path: 'track', select: 'title' }
      })
      .populate('submission', 'projectTitle')
      .sort({ rank: 1, displayOrder: 1 });

    const settings = await SiteSettings.findOne();

    res.json({
      success: true,
      isResultsPublished: Boolean(settings?.isResultsPublished),
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create or assign a result award
export const createResult = async (req, res) => {
  try {
    const { awardTitle, category, teamId, submissionId, rank, prizeAmount, citation, status } = req.body;

    if (!awardTitle || !teamId) {
      return res.status(400).json({ success: false, message: 'Award title and Team ID are required' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const result = await Result.create({
      awardTitle: awardTitle.trim(),
      category: category || 'Special Award',
      team: team._id,
      submission: submissionId || team.submission,
      rank: Number(rank) || 1,
      prizeAmount: Number(prizeAmount) || 0,
      citation: citation || '',
      status: status || 'Draft'
    });

    res.status(201).json({ success: true, message: 'Award created successfully', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update result award
export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Result.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }
    res.json({ success: true, message: 'Result award updated', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete result award
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    await Result.findByIdAndDelete(id);
    res.json({ success: true, message: 'Result award deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Toggle Results Published
export const togglePublishResults = async (req, res) => {
  try {
    const { isResultsPublished } = req.body;
    const settings = await SiteSettings.findOne();
    if (settings) {
      settings.isResultsPublished = isResultsPublished;
      await settings.save();
    }

    if (isResultsPublished) {
      await Result.updateMany({}, { status: 'Published' });
    }

    res.json({
      success: true,
      message: `Results are now ${isResultsPublished ? 'Published to Public' : 'Unpublished (Draft)'}`,
      isResultsPublished
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
