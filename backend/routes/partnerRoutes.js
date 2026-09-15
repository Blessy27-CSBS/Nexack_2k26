import express from 'express';
import { getPartners, createPartner, updatePartner, deletePartner } from '../controllers/partnerController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getPartners)
    .post(protect, upload.single('logo'), createPartner);

router.route('/:id')
    .put(protect, upload.single('logo'), updatePartner)
    .delete(protect, deletePartner);

export default router;
