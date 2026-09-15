import express from 'express';
import { registerForEvent, getRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/registrations', upload.single('screenshot'), registerForEvent);
router.get('/registrations', protect, getRegistrations);
router.patch('/registrations/:id/status', protect, updateRegistrationStatus);
router.put('/registrations/:id/status', protect, updateRegistrationStatus); // Maintain PUT for compatibility

export default router;
