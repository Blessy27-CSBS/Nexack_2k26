import express from 'express';
import {
  mentorController,
  facultyController,
  associationController,
  sponsorController,
  timelineController,
  prizeController,
  ruleController,
  faqController,
  announcementController,
  galleryController,
  contactController,
  settingsController
} from '../controllers/contentControllers.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Helper to register CRUD routes
const registerCRUDRoutes = (prefix, controller) => {
  router.get(`/${prefix}`, controller.getPublic);
  router.get(`/admin/${prefix}`, protectAdmin, controller.getAdmin);
  router.post(`/admin/${prefix}`, protectAdmin, upload.single('image'), controller.create);
  router.put(`/admin/${prefix}/:id`, protectAdmin, upload.single('image'), controller.update);
  router.delete(`/admin/${prefix}/:id`, protectAdmin, controller.delete);
};

// Register all dynamic content endpoints
registerCRUDRoutes('mentors', mentorController);
registerCRUDRoutes('faculty', facultyController);
registerCRUDRoutes('association', associationController);
registerCRUDRoutes('sponsors', sponsorController);
registerCRUDRoutes('timeline', timelineController);
registerCRUDRoutes('prizes', prizeController);
registerCRUDRoutes('rules', ruleController);
registerCRUDRoutes('faqs', faqController);
registerCRUDRoutes('announcements', announcementController);
registerCRUDRoutes('gallery', galleryController);

// Contact messages
router.post('/contact', contactController.submitMessage);
router.get('/admin/messages', protectAdmin, contactController.getAllAdmin);
router.patch('/admin/messages/:id/read', protectAdmin, contactController.markRead);
router.patch('/admin/messages/:id/status', protectAdmin, contactController.updateStatus);
router.delete('/admin/messages/:id', protectAdmin, contactController.deleteMessage);

// Site Settings
router.get('/settings', settingsController.getPublicSettings);
router.put('/admin/settings', protectAdmin, upload.single('qrCode'), settingsController.updateSettings);

export default router;
