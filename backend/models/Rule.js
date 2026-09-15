import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    trim: true,
    default: 'General'
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

ruleSchema.index({ status: 1, category: 1, displayOrder: 1 });

export default mongoose.model('Rule', ruleSchema);
