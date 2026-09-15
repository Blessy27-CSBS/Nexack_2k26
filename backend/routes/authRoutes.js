import express from 'express';
import { adminLogin, participantLogin, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/participant/login', participantLogin);
router.get('/me', getMe);

export default router;
