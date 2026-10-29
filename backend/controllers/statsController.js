import Team from '../models/Team.js';
import Track from '../models/Track.js';

// Public Stats (no auth required)
export const getPublicStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const teams = await Team.find().select('members');
    const totalMembersInTeams = teams.reduce((acc, t) => acc + (t.members ? t.members.length : 0), 0);
    const totalParticipants = totalTeams + totalMembersInTeams;
    const totalTracks = await Track.countDocuments({ status: { $ne: 'Draft' } });

    res.json({
      success: true,
      metrics: {
        totalTeams,
        totalParticipants,
        totalTracks
      }
    });
  } catch (error) {
    console.error('Public Stats Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
