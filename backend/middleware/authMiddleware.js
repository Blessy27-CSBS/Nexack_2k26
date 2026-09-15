import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Participant from '../models/Participant.js';

// Verify Admin or SuperAdmin
export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026');
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Account disabled or not found' });
      }

      if (admin.role !== 'admin' && admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      console.error('Admin Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

// Verify SuperAdmin only
export const protectSuperAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026');
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Account disabled or not found' });
      }

      if (admin.role !== 'superadmin') {
        return res.status(403).json({ success: false, message: 'SuperAdmin privilege required' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      console.error('SuperAdmin Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

// Verify Judge (or Admin/SuperAdmin)
export const protectJudge = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026');
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: 'Account disabled or not found' });
      }

      if (!['judge', 'admin', 'superadmin'].includes(admin.role)) {
        return res.status(403).json({ success: false, message: 'Judge access required' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      console.error('Judge Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

// Verify Participant (Team Leader / Member)
export const protectParticipant = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexack_jwt_secret_key_2026');
      const participant = await Participant.findById(decoded.id).select('-password');

      if (!participant) {
        return res.status(401).json({ success: false, message: 'Participant not found' });
      }

      req.participant = participant;
      return next();
    } catch (error) {
      console.error('Participant Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token expired or invalid' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no participant token' });
};
