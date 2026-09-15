import express from 'express';
import {
  getPublicResults,
  getAllResultsAdmin,
  createResult,
  updateResult,
  deleteResult,
  togglePublishResults
} from '../controllers/resultsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/results', getPublicResults);
router.get('/admin/results', protectAdmin, getAllResultsAdmin);
router.post('/admin/results', protectAdmin, createResult);
router.put('/admin/results/:id', protectAdmin, updateResult);
router.delete('/admin/results/:id', protectAdmin, deleteResult);
router.post('/admin/results/publish', protectAdmin, togglePublishResults);

export default router;
