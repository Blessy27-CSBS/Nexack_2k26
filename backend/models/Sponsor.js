import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, required: true },
  website: { type: String, default: '', trim: true },
  category: { 
    type: String, 
    enum: [
      'Title Sponsor', 
      'Gold Sponsor', 
      'Silver Sponsor', 
      'Technology Partner', 
      'Community Partner', 
      'Media Partner'
    ], 
    default: 'Community Partner' 
  },
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

sponsorSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Sponsor', sponsorSchema);
