import express from 'express';
import { getAdminStats, getParticipantsAdmin } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protectAdmin, getAdminStats);
router.get('/participants', protectAdmin, getParticipantsAdmin);

export default router;
