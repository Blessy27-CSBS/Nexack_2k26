import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  trackNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true },
  shortDescription: { type: String, required: true },
  detailedDescription: { type: String, default: '' },
  problemAreas: [{ type: String, trim: true }],
  suggestedTechnologies: [{ type: String, trim: true }],
  icon: { type: String, default: 'Cpu' },
  bannerImage: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

trackSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Track', trackSchema);
