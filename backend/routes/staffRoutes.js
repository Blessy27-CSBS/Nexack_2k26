import express from 'express';
import { getStaff, addStaff, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getStaff);
router.post('/', protect, upload.single('photo'), addStaff);
router.put('/:id', protect, upload.single('photo'), updateStaff);
router.delete('/:id', protect, deleteStaff);

export default router;
