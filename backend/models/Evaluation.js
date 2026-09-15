import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  judge: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  },
  submission: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Submission', 
    required: true 
  },
  scores: {
    innovation: { type: Number, min: 0, max: 20, default: 0 },
    technicalImplementation: { type: Number, min: 0, max: 25, default: 0 },
    problemRelevance: { type: Number, min: 0, max: 15, default: 0 },
    userExperience: { type: Number, min: 0, max: 15, default: 0 },
    scalability: { type: Number, min: 0, max: 10, default: 0 },
    impact: { type: Number, min: 0, max: 10, default: 0 },
    presentation: { type: Number, min: 0, max: 5, default: 0 }
  },
  totalScore: { type: Number, required: true, default: 0 },
  comments: { type: String, default: '' },
  isLocked: { type: Boolean, default: true }
}, { timestamps: true });

// Prevent duplicate evaluation from the same judge on the same submission
evaluationSchema.index({ judge: 1, submission: 1 }, { unique: true });

export default mongoose.model('Evaluation', evaluationSchema);
