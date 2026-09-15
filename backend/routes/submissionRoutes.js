import express from 'express';
import {
  getMySubmission,
  saveOrSubmitProject,
  getAllSubmissionsAdmin,
  updateSubmissionStatus,
  assignJudgesToSubmission
} from '../controllers/submissionController.js';
import { protectAdmin, protectParticipant } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Participant submission routes
router.get('/my-submission', protectParticipant, getMySubmission);
router.post(
  '/my-submission',
  protectParticipant,
  upload.fields([
    { name: 'documentation', maxCount: 1 },
    { name: 'ppt', maxCount: 1 },
    { name: 'screenshots', maxCount: 5 }
  ]),
  saveOrSubmitProject
);

// Admin submission routes
router.get('/admin/submissions', protectAdmin, getAllSubmissionsAdmin);
router.patch('/admin/submissions/:id/status', protectAdmin, updateSubmissionStatus);
router.put('/admin/submissions/:id/assign-judges', protectAdmin, assignJudgesToSubmission);

export default router;
