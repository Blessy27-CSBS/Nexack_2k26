import express from 'express';
import { getContacts, createContact, updateContact, deleteContact } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getContacts);
router.post('/', protect, upload.single('logo'), createContact);
router.put('/:id', protect, upload.single('logo'), updateContact);
router.delete('/:id', protect, deleteContact);

export default router;
