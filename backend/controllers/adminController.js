import Team from '../models/Team.js';
import Participant from '../models/Participant.js';
import Submission from '../models/Submission.js';
import Track from '../models/Track.js';
import Result from '../models/Result.js';

// Get Real Admin Dashboard Metrics and Chart Data
export const getAdminStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const verifiedTeams = await Team.countDocuments({ registrationStatus: 'Verified' });
    const pendingRegistrations = await Team.countDocuments({ registrationStatus: 'Pending' });

    // Total participants (including leaders and member sub-documents)
    const teams = await Team.find().select('members');
    const totalMembersInTeams = teams.reduce((acc, t) => acc + (t.members ? t.members.length : 0), 0);
    const totalParticipants = totalTeams + totalMembersInTeams;

    // Payments
    const pendingPayments = await Team.countDocuments({ paymentStatus: { $in: ['Pending', 'Proof Uploaded'] } });
    const verifiedPayments = await Team.countDocuments({ paymentStatus: 'Verified' });
    const rejectedPayments = await Team.countDocuments({ paymentStatus: 'Rejected' });

    // Submissions
    const submittedProjects = await Submission.countDocuments({ status: { $ne: 'Draft' } });
    const draftSubmissions = await Submission.countDocuments({ status: 'Draft' });
    const shortlistedTeams = await Submission.countDocuments({ status: 'Shortlisted' });
    const finalists = await Submission.countDocuments({ status: 'Finalist' });
    const winners = await Result.countDocuments({ status: 'Published' });

    // --- Chart Data Aggregations ---

    // 1. Teams per Track
    const trackDistribution = await Team.aggregate([
      {
        $group: {
          _id: '$track',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'tracks',
          localField: '_id',
          foreignField: '_id',
          as: 'trackInfo'
        }
      },
      {
        $unwind: {
          path: '$trackInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ['$trackInfo.title', 'Unassigned'] },
          trackNumber: '$trackInfo.trackNumber',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 2. Payment Status Breakdown
    const paymentBreakdown = [
      { name: 'Verified', count: verifiedPayments, color: '#10b981' },
      { name: 'Proof Uploaded', count: await Team.countDocuments({ paymentStatus: 'Proof Uploaded' }), color: '#3b82f6' },
      { name: 'Pending', count: await Team.countDocuments({ paymentStatus: 'Pending' }), color: '#f59e0b' },
      { name: 'Rejected', count: rejectedPayments, color: '#ef4444' }
    ];

    // 3. Submission Status Breakdown
    const submissionBreakdown = await Submission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    // 4. College Distribution (Top 8 colleges)
    const collegeDistribution = await Participant.aggregate([
      { $group: { _id: { $toLower: '$college' }, originalName: { $first: '$college' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { name: '$originalName', count: 1, _id: 0 } }
    ]);

    // 5. Registration Timeline (Last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const registrationGrowth = await Team.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      metrics: {
        totalTeams,
        totalParticipants,
        verifiedTeams,
        pendingRegistrations,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        submittedProjects,
        pendingSubmissions: Math.max(0, verifiedTeams - submittedProjects),
        draftSubmissions,
        shortlistedTeams,
        finalists,
        winners
      },
      charts: {
        trackDistribution,
        paymentBreakdown,
        submissionBreakdown,
        collegeDistribution,
        registrationGrowth
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Participant Directory
export const getParticipantsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 25, search = '', college = '' } = req.query;

    const query = {};
    if (college) query.college = { $regex: college, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Participant.countDocuments(query);

    const participants = await Participant.find(query)
      .select('-password')
      .populate({
        path: 'teamId',
        select: 'teamId name track registrationStatus paymentStatus',
        populate: { path: 'track', select: 'title' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      participants,
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
