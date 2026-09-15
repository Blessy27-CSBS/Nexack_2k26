import express from 'express';
import { getMembers, addMember, updateMember, deleteMember } from '../controllers/associationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getMembers);
router.post('/', protect, upload.single('photo'), addMember);
router.put('/:id', protect, upload.single('photo'), updateMember);
router.delete('/:id', protect, deleteMember);

export default router;
