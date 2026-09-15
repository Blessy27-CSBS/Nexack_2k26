import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  designation: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  bio: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Unpublished'], 
    default: 'Published' 
  }
}, { timestamps: true });

facultySchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Faculty', facultySchema);
