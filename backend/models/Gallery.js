import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, default: '' },
  caption: { type: String, default: '', trim: true },
  category: { 
    type: String, 
    enum: [
      'Pre-event', 
      'Hackathon', 
      'Mentorship', 
      'Development', 
      'Judging', 
      'Finale', 
      'Winners',
      'Highlights'
    ], 
    default: 'Hackathon' 
  },
  date: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

gallerySchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Gallery', gallerySchema);
