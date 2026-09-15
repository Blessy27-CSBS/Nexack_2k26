import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  awardTitle: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Winner', '1st Runner Up', '2nd Runner Up', 'Track Winner', 'Special Award'], 
    default: 'Special Award' 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true 
  },
  submission: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Submission' 
  },
  rank: { type: Number, default: 1 },
  prizeAmount: { type: Number, default: 0 },
  citation: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Draft', 'Published'], 
    default: 'Draft' 
  },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Result', resultSchema);
