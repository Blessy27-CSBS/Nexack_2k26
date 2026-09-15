import express from 'express';
import {
  registerTeam,
  getMyTeam,
  updateMyTeam,
  uploadPaymentProof,
  getAllTeams,
  updatePaymentStatus,
  updateRegistrationStatus,
  deleteTeam
} from '../controllers/teamController.js';
import { protectAdmin, protectParticipant } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public registration endpoint (handles multipart for payment screenshot)
router.post('/register', upload.single('screenshot'), registerTeam);

// Participant routes
router.get('/my-team', protectParticipant, getMyTeam);
router.put('/my-team', protectParticipant, updateMyTeam);
router.post('/my-team/payment', protectParticipant, upload.single('screenshot'), uploadPaymentProof);

// Admin routes
router.get('/admin/teams', protectAdmin, getAllTeams);
router.patch('/admin/teams/:id/payment', protectAdmin, updatePaymentStatus);
router.patch('/admin/teams/:id/status', protectAdmin, updateRegistrationStatus);
router.delete('/admin/teams/:id', protectAdmin, deleteTeam);

export default router;
