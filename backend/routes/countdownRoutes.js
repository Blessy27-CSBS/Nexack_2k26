import express from 'express';
import { getCountdown, createCountdown, updateCountdown, deleteCountdown } from '../controllers/countdownController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCountdown)
    .post(protect, createCountdown);

router.route('/:id')
    .put(protect, updateCountdown)
    .delete(protect, deleteCountdown);

export default router;
