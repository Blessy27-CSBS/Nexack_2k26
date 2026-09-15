import Team from '../models/Team.js';
import Participant from '../models/Participant.js';
import Track from '../models/Track.js';
import SiteSettings from '../models/SiteSettings.js';
import { processFileUpload } from '../middleware/uploadMiddleware.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role = 'participant') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026', { expiresIn: '30d' });
};

// Generate next unique Team ID (e.g. NEXACK-2K26-0001)
const getNextTeamId = async () => {
  const count = await Team.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `NEXACK-2K26-${nextNum}`;
};

// Register a New Team & Team Leader Account
export const registerTeam = async (req, res) => {
  try {
    let registrationData;
    if (req.body.data) {
      try {
        registrationData = JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid registration payload JSON' });
      }
    } else {
      registrationData = req.body;
    }

    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderPassword,
      leaderPhone,
      leaderCollege,
      leaderDepartment,
      leaderYear,
      leaderGithub,
      leaderLinkedin,
      trackId,
      members = [],
      transactionId
    } = registrationData;

    // Check SiteSettings for registration status and team limits
    const settings = await SiteSettings.findOne();
    if (settings && settings.registrationStatus === 'Closed') {
      return res.status(400).json({ success: false, message: 'Registration is currently closed.' });
    }

    if (!teamName || !leaderName || !leaderEmail || !leaderPassword || !leaderPhone || !leaderCollege || !leaderDepartment || !leaderYear || !trackId) {
      return res.status(400).json({ success: false, message: 'All required team leader fields and track are mandatory.' });
    }

    // Check for existing leader email or duplicate team name
    const existingLeader = await Participant.findOne({ email: leaderEmail.toLowerCase().trim() });
    if (existingLeader) {
      return res.status(400).json({ success: false, message: 'An account with this leader email already exists.' });
    }

    const existingTeam = await Team.findOne({ name: { $regex: new RegExp(`^${teamName.trim()}$`, 'i') } });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'A team with this name is already registered.' });
    }

    // Validate track
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(400).json({ success: false, message: 'Selected track is invalid.' });
    }

    // Handle payment proof upload
    let paymentProofUrl = '';
    let paymentProofPublicId = '';
    if (req.file) {
      const uploadResult = await processFileUpload(req.file, 'payments');
      paymentProofUrl = uploadResult.url;
      paymentProofPublicId = uploadResult.publicId;
    }

    // Generate unique Team ID
    let teamId = await getNextTeamId();
    let exists = await Team.findOne({ teamId });
    while (exists) {
      teamId = `NEXACK-2K26-${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await Team.findOne({ teamId });
    }

    // Create Team Leader Participant document
    const leader = await Participant.create({
      name: leaderName.trim(),
      email: leaderEmail.toLowerCase().trim(),
      password: leaderPassword,
      phone: leaderPhone.trim(),
      college: leaderCollege.trim(),
      department: leaderDepartment.trim(),
      year: leaderYear,
      github: leaderGithub || '',
      linkedin: leaderLinkedin || '',
      isLeader: true
    });

    // Format member array
    const formattedMembers = members.map(m => ({
      name: m.name?.trim(),
      email: m.email?.toLowerCase()?.trim(),
      phone: m.phone?.trim(),
      college: m.college?.trim() || leaderCollege.trim(),
      department: m.department?.trim() || leaderDepartment.trim(),
      year: m.year || leaderYear,
      github: m.github || '',
      linkedin: m.linkedin || '',
      codingProfile: m.codingProfile || ''
    })).filter(m => m.name && m.email);

    // Create Team
    const team = await Team.create({
      teamId,
      name: teamName.trim(),
      leader: leader._id,
      members: formattedMembers,
      track: track._id,
      registrationStatus: 'Pending',
      paymentStatus: paymentProofUrl ? 'Proof Uploaded' : 'Pending',
      paymentTransactionId: transactionId ? transactionId.trim() : '',
      paymentProofUrl,
      paymentProofPublicId,
      paymentAmount: settings?.registrationFee || 400
    });

    // Associate teamId to leader
    leader.teamId = team._id;
    await leader.save();

    // Create member participant records so they can also view their team
    for (const mem of formattedMembers) {
      const existingMem = await Participant.findOne({ email: mem.email });
      if (!existingMem) {
        await Participant.create({
          name: mem.name,
          email: mem.email,
          password: 'Password@123', // default initial password if they want to login
          phone: mem.phone || '',
          college: mem.college,
          department: mem.department,
          year: mem.year,
          github: mem.github || '',
          linkedin: mem.linkedin || '',
          codingProfile: mem.codingProfile || '',
          teamId: team._id,
          isLeader: false
        });
      }
    }

    const token = generateToken(leader._id, 'participant');

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', '-password')
      .populate('track');

    res.status(201).json({
      success: true,
      message: 'Team registration successful! Welcome to NEXACK 2K26.',
      token,
      team: populatedTeam,
      participant: leader
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// Get current team details for logged in participant
export const getMyTeam = async (req, res) => {
  try {
    const participant = req.participant;
    if (!participant.teamId) {
      return res.status(404).json({ success: false, message: 'No team linked to this account.' });
    }

    const team = await Team.findById(participant.teamId)
      .populate('leader', '-password')
      .populate('track')
      .populate('submission');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team record not found.' });
    }

    res.json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Team Profile & Members (Leader only)
export const updateMyTeam = async (req, res) => {
  try {
    const participant = req.participant;
    const team = await Team.findById(participant.teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    if (String(team.leader) !== String(participant._id)) {
      return res.status(403).json({ success: false, message: 'Only team leader can modify team details' });
    }

    const { name, trackId, members } = req.body;

    if (name) team.name = name.trim();
    if (trackId) {
      const track = await Track.findById(trackId);
      if (track) team.track = track._id;
    }

    if (Array.isArray(members)) {
      team.members = members.map(m => ({
        name: m.name?.trim(),
        email: m.email?.toLowerCase()?.trim(),
        phone: m.phone?.trim(),
        college: m.college?.trim(),
        department: m.department?.trim(),
        year: m.year,
        github: m.github || '',
        linkedin: m.linkedin || '',
        codingProfile: m.codingProfile || ''
      })).filter(m => m.name && m.email);
    }

    await team.save();

    const updated = await Team.findById(team._id)
      .populate('leader', '-password')
      .populate('track');

    res.json({ success: true, message: 'Team details updated successfully', team: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload Payment Proof (Participant)
export const uploadPaymentProof = async (req, res) => {
  try {
    const participant = req.participant;
    const team = await Team.findById(participant.teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const { transactionId } = req.body;

    if (!req.file && !transactionId) {
      return res.status(400).json({ success: false, message: 'Please provide payment screenshot or transaction ID' });
    }

    if (req.file) {
      const uploadResult = await processFileUpload(req.file, 'payments');
      team.paymentProofUrl = uploadResult.url;
      team.paymentProofPublicId = uploadResult.publicId;
    }

    if (transactionId) {
      team.paymentTransactionId = transactionId.trim();
    }

    team.paymentStatus = 'Proof Uploaded';
    team.rejectionReason = '';
    await team.save();

    res.json({
      success: true,
      message: 'Payment proof submitted successfully for verification.',
      team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all teams with pagination & filters
export const getAllTeams = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      track = '', 
      paymentStatus = '', 
      registrationStatus = '' 
    } = req.query;

    const query = {};

    if (track) query.track = track;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (registrationStatus) query.registrationStatus = registrationStatus;

    if (search) {
      query.$or = [
        { teamId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { paymentTransactionId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Team.countDocuments(query);

    const teams = await Team.find(query)
      .populate('leader', 'name email phone college department year')
      .populate('track', 'trackNumber title')
      .populate('submission', 'submissionId projectTitle status averageScore')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      teams,
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

// Admin: Verify or Reject Payment
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.paymentStatus = status;
    if (status === 'Verified') {
      team.paymentVerifiedAt = new Date();
      team.registrationStatus = 'Verified';
      team.rejectionReason = '';
    } else if (status === 'Rejected') {
      team.rejectionReason = rejectionReason || 'Payment proof invalid or transaction not matched';
      team.registrationStatus = 'Rejected';
    }

    await team.save();

    res.json({
      success: true,
      message: `Payment status updated to ${status}`,
      team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Registration Status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const team = await Team.findByIdAndUpdate(
      id,
      { registrationStatus: status, registrationNotes: notes || '' },
      { new: true }
    ).populate('leader', 'name email').populate('track', 'title');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({ success: true, message: `Team status updated to ${status}`, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Also remove leader participant or unlink
    await Participant.deleteMany({ teamId: team._id });
    await Team.findByIdAndDelete(id);

    res.json({ success: true, message: 'Team and associated participant accounts deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
