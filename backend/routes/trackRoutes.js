import express from 'express';
import {
  getPublishedTracks,
  getTrackById,
  getAllTracksAdmin,
  createTrack,
  updateTrack,
  deleteTrack
} from '../controllers/trackController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/tracks', getPublishedTracks);
router.get('/tracks/:id', getTrackById);

// Admin routes
router.get('/admin/tracks', protectAdmin, getAllTracksAdmin);
router.post('/admin/tracks', protectAdmin, upload.single('banner'), createTrack);
router.put('/admin/tracks/:id', protectAdmin, upload.single('banner'), updateTrack);
router.delete('/admin/tracks/:id', protectAdmin, deleteTrack);

export default router;
