import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Replied', 'Archived'],
    default: 'Unread'
  },
  isRead: { type: Boolean, default: false },
  replied: { type: Boolean, default: false }
}, { timestamps: true });

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
