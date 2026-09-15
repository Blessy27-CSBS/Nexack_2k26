import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  college: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  codingProfile: { type: String, default: '' }
}, { _id: true });

const teamSchema = new mongoose.Schema({
  teamId: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true,
    index: true 
  },
  name: { type: String, required: true, trim: true },
  leader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Participant', 
    required: true 
  },
  members: [memberSchema],
  track: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Track', 
    required: true 
  },
  
  // Registration & Verification
  registrationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  registrationNotes: { type: String, default: '' },

  // Payment Workflow
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Proof Uploaded', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  paymentTransactionId: { type: String, default: '' },
  paymentProofUrl: { type: String, default: '' },
  paymentProofPublicId: { type: String, default: '' },
  paymentAmount: { type: Number, default: 0 },
  paymentVerifiedAt: { type: Date },
  rejectionReason: { type: String, default: '' },

  // Submission Link
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
