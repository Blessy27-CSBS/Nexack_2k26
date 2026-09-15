import Mentor from '../models/Mentor.js';
import Faculty from '../models/Faculty.js';
import AssociationMember from '../models/AssociationMember.js';
import Sponsor from '../models/Sponsor.js';
import TimelineEvent from '../models/TimelineEvent.js';
import Prize from '../models/Prize.js';
import Rule from '../models/Rule.js';
import FAQ from '../models/FAQ.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import ContactMessage from '../models/ContactMessage.js';
import SiteSettings from '../models/SiteSettings.js';
import { processFileUpload } from '../middleware/uploadMiddleware.js';

// Generic CRUD Factory helper for simple dynamic items
const createCRUDFunctions = (Model, name, sortField = { displayOrder: 1, createdAt: 1 }) => ({
  getPublic: async (req, res) => {
    try {
      const items = await Model.find({ status: 'Published' }).sort(sortField);
      res.json({ success: true, count: items.length, items });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  getAdmin: async (req, res) => {
    try {
      const items = await Model.find().sort(sortField);
      res.json({ success: true, count: items.length, items });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  create: async (req, res) => {
    try {
      let bodyData = { ...req.body };
      if (req.file) {
        const uploadRes = await processFileUpload(req.file, name.toLowerCase());
        bodyData.photo = uploadRes.url;
        bodyData.logo = uploadRes.url;
        bodyData.imageUrl = uploadRes.url;
        bodyData.bannerImage = uploadRes.url;
      }
      const item = await Model.create(bodyData);
      res.status(201).json({ success: true, message: `${name} created successfully`, item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  update: async (req, res) => {
    try {
      let bodyData = { ...req.body };
      if (req.file) {
        const uploadRes = await processFileUpload(req.file, name.toLowerCase());
        bodyData.photo = uploadRes.url;
        bodyData.logo = uploadRes.url;
        bodyData.imageUrl = uploadRes.url;
      }
      const item = await Model.findByIdAndUpdate(req.params.id, bodyData, { new: true });
      if (!item) return res.status(404).json({ success: false, message: `${name} not found` });
      res.json({ success: true, message: `${name} updated successfully`, item });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: `${name} deleted successfully` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
});

// Export CRUD handlers
export const mentorController = createCRUDFunctions(Mentor, 'Mentor');
export const facultyController = createCRUDFunctions(Faculty, 'Faculty');
export const associationController = createCRUDFunctions(AssociationMember, 'Association Member');
export const sponsorController = createCRUDFunctions(Sponsor, 'Sponsor');
export const timelineController = createCRUDFunctions(TimelineEvent, 'Timeline Event');
export const prizeController = createCRUDFunctions(Prize, 'Prize');
export const ruleController = createCRUDFunctions(Rule, 'Rule', { category: 1, displayOrder: 1 });
export const faqController = createCRUDFunctions(FAQ, 'FAQ', { displayOrder: 1 });
export const announcementController = createCRUDFunctions(Announcement, 'Announcement', { publishDate: -1 });
export const galleryController = createCRUDFunctions(Gallery, 'Gallery Image', { displayOrder: 1, createdAt: -1 });

// --- Contact Messages ---
export const contactController = {
  submitMessage: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const contactMsg = await ContactMessage.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'Unread',
        isRead: false
      });
      res.status(201).json({ success: true, message: 'Your message has been sent successfully!', contactMsg });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  getAllAdmin: async (req, res) => {
    try {
      const { status, search } = req.query;
      let filter = {};
      if (status && status !== 'All') {
        filter.status = status;
      }
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { name: regex },
          { email: regex },
          { subject: regex },
          { message: regex }
        ];
      }
      const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
      res.json({ success: true, count: messages.length, messages, items: messages });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['Unread', 'Read', 'Replied', 'Archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
      }
      const update = {
        status,
        isRead: status !== 'Unread',
        replied: status === 'Replied'
      };
      const msg = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      res.json({ success: true, message: `Message status updated to ${status}`, msg, item: msg });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  markRead: async (req, res) => {
    try {
      const msg = await ContactMessage.findByIdAndUpdate(
        req.params.id, 
        { isRead: true, status: 'Read' }, 
        { new: true }
      );
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      res.json({ success: true, msg, item: msg });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const msg = await ContactMessage.findByIdAndDelete(req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      res.json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

// --- Site Settings ---
export const settingsController = {
  getPublicSettings: async (req, res) => {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create({});
      }
      res.json({ success: true, settings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
  updateSettings: async (req, res) => {
    try {
      let updateData = {};
      if (req.body.settings) {
        try {
          updateData = typeof req.body.settings === 'string' ? JSON.parse(req.body.settings) : req.body.settings;
        } catch (e) {
          updateData = { ...req.body };
        }
      } else {
        updateData = { ...req.body };
      }

      if (req.file) {
        const uploadRes = await processFileUpload(req.file, 'settings');
        updateData.upiQrCode = uploadRes.url;
      }

      // If paymentQrDriveLink is provided, also set upiQrCode for backwards compatibility
      if (updateData.paymentQrDriveLink && !req.file) {
        updateData.upiQrCode = updateData.paymentQrDriveLink;
      } else if (updateData.upiQrCode && !updateData.paymentQrDriveLink) {
        updateData.paymentQrDriveLink = updateData.upiQrCode;
      }

      // Use findOneAndUpdate with upsert to guarantee a single document
      const settings = await SiteSettings.findOneAndUpdate(
        {},
        { $set: updateData },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      res.json({ success: true, message: 'Website settings updated successfully', settings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
