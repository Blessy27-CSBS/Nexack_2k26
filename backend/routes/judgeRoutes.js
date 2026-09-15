import express from 'express';
import {
  getAllJudges,
  createJudge,
  getJudgeAssignedProjects,
  submitEvaluation,
  unlockEvaluation
} from '../controllers/judgeController.js';
import { protectAdmin, protectJudge } from '../middleware/authMiddleware.js';

const router = express.Router();

// Judge self-service routes
router.get('/judge/projects', protectJudge, getJudgeAssignedProjects);
router.post('/judge/evaluate', protectJudge, submitEvaluation);

// Admin judge management
router.get('/admin/judges', protectAdmin, getAllJudges);
router.post('/admin/judges', protectAdmin, createJudge);
router.patch('/admin/evaluations/:id/unlock', protectAdmin, unlockEvaluation);

export default router;
