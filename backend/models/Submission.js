import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  submissionId: { 
    type: String, 
    unique: true, 
    sparse: true,
    uppercase: true, 
    trim: true 
  },
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true,
    unique: true 
  },
  track: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Track', 
    required: true 
  },
  projectTitle: { type: String, required: true, trim: true },
  problemStatement: { type: String, default: '' },
  projectDescription: { type: String, required: true },
  proposedSolution: { type: String, default: '' },
  keyFeatures: [{ type: String }],
  technologyStack: [{ type: String }],
  innovation: { type: String, default: '' },
  impact: { type: String, default: '' },
  futureScope: { type: String, default: '' },

  // External Links
  githubUrl: { type: String, required: true, trim: true },
  liveDemoUrl: { type: String, default: '', trim: true },
  figmaUrl: { type: String, default: '', trim: true },
  videoDemoUrl: { type: String, default: '', trim: true },

  // Files
  documentationUrl: { type: String, default: '' },
  pptUrl: { type: String, default: '' },
  screenshots: [{ type: String }],

  // Status & Workflow
  status: { 
    type: String, 
    enum: [
      'Draft', 
      'Submitted', 
      'Under Review', 
      'Shortlisted', 
      'Finalist', 
      'Winner', 
      'Rejected'
    ], 
    default: 'Draft' 
  },
  submittedAt: { type: Date },
  isLateSubmission: { type: Boolean, default: false },

  // Assigned Judges
  assignedJudges: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  }],

  // Aggregated Score
  averageScore: { type: Number, default: 0 },
  evaluationCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
