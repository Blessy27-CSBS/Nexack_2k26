import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  designation: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  expertise: [{ type: String, trim: true }],
  bio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

mentorSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Mentor', mentorSchema);
