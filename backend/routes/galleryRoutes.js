import express from 'express';
import { getGallery, addGalleryImage, deleteGalleryImage } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, upload.single('image'), addGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;
