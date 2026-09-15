import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Participant from '../models/Participant.js';
import Team from '../models/Team.js';

const generateToken = (id, role = 'admin') => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026', 
    { expiresIn: '30d' }
  );
};

// Admin & Judge Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        designation: admin.designation,
        assignedTracks: admin.assignedTracks
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Participant Login
export const participantLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const participant = await Participant.findOne({ email: email.toLowerCase().trim() });
    if (!participant || !(await participant.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(participant._id, 'participant');

    // Fetch team info
    const team = await Team.findById(participant.teamId).populate('track');

    res.json({
      success: true,
      token,
      participant: {
        id: participant._id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        college: participant.college,
        department: participant.department,
        year: participant.year,
        isLeader: participant.isLeader,
        teamId: participant.teamId
      },
      team: team || null
    });
  } catch (error) {
    console.error('Participant Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile (Admin or Participant)
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026');

    if (decoded.role === 'participant') {
      const participant = await Participant.findById(decoded.id).select('-password');
      if (!participant) return res.status(404).json({ success: false, message: 'User not found' });
      const team = await Team.findById(participant.teamId).populate('track');
      return res.json({ success: true, role: 'participant', user: participant, team });
    } else {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
      return res.json({ success: true, role: admin.role, user: admin });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
