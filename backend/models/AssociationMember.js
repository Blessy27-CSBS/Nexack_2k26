import mongoose from 'mongoose';

const associationMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  department: { type: String, default: 'Computer Science & Business Systems' },
  year: { type: String, default: '' },
  bio: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

associationMemberSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('AssociationMember', associationMemberSchema);
