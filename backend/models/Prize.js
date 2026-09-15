import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    default: 'General'
  },
  description: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  benefits: [{ type: String, trim: true }],
  icon: { type: String, default: 'Trophy' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

prizeSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Prize', prizeSchema);
