import Submission from '../models/Submission.js';
import SiteSettings from '../models/SiteSettings.js';

// Get Leaderboard (Admin: always available; Public: only if isPublicLeaderboardEnabled)
export const getLeaderboard = async (req, res) => {
  try {
    const isAdmin = Boolean(req.admin);

    if (!isAdmin) {
      const settings = await SiteSettings.findOne();
      if (!settings || !settings.isPublicLeaderboardEnabled) {
        return res.status(403).json({
          success: false,
          isPublic: false,
          message: 'Leaderboard is not published yet.'
        });
      }
    }

    // Fetch submissions that have been evaluated, ordered by averageScore desc
    const submissions = await Submission.find({
      status: { $in: ['Submitted', 'Under Review', 'Shortlisted', 'Finalist', 'Winner'] },
      evaluationCount: { $gt: 0 }
    })
      .populate('team', 'teamId name college')
      .populate('track', 'title trackNumber')
      .sort({ averageScore: -1, updatedAt: 1 });

    // Compute ranks with tie handling
    let currentRank = 1;
    const rankedList = submissions.map((sub, idx) => {
      if (idx > 0 && sub.averageScore < submissions[idx - 1].averageScore) {
        currentRank = idx + 1;
      }
      return {
        rank: currentRank,
        id: sub._id,
        submissionId: sub.submissionId,
        projectTitle: sub.projectTitle,
        teamId: sub.team?.teamId,
        teamName: sub.team?.name,
        trackName: sub.track?.title,
        trackNumber: sub.track?.trackNumber,
        averageScore: sub.averageScore,
        evaluationCount: sub.evaluationCount,
        status: sub.status
      };
    });

    res.json({
      success: true,
      count: rankedList.length,
      leaderboard: rankedList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
