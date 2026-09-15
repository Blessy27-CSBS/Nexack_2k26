import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  eventName: { type: String, default: 'NEXACK 2K26' },
  edition: { type: String, default: '2026' },
  tagline: { type: String, default: 'BUILD. BREAK. INNOVATE.' },
  supportingPhrase: { type: String, default: 'WHERE IDEAS BECOME IMPACT.' },
  description: { 
    type: String, 
    default: 'A next-generation hackathon where students transform real-world problems into technology-driven solutions.' 
  },
  organizerName: { type: String, default: 'Nexora Association' },
  department: { type: String, default: 'Department of Computer Science & Business Systems' },
  college: { type: String, default: 'KGiSL Institute of Technology' },
  venue: { type: String, default: 'KGiSL Campus, Coimbatore, Tamil Nadu' },
  venueAddress: { type: String, default: 'KGiSL Campus, Saravanampatti, Coimbatore - 641035' },
  
  // Event Timing
  eventDate: { type: Date, default: () => new Date('2026-03-27T09:00:00.000Z') },
  startTime: { type: String, default: '08:30 AM' },
  endTime: { type: String, default: '05:30 PM' },
  durationHours: { type: Number, default: 24 },

  // Registration Settings
  registrationStatus: { 
    type: String, 
    enum: ['Open', 'Closed', 'Coming Soon'], 
    default: 'Open' 
  },
  registrationFee: { type: Number, default: 400 },
  currency: { type: String, default: '₹' },
  upiId: { type: String, default: '' },
  upiQrCode: { type: String, default: '' },
  paymentQrDriveLink: { type: String, default: '' },
  paymentInstructions: { 
    type: String, 
    default: 'Scan the UPI QR code or pay to the UPI ID provided. Take a screenshot of the completed payment showing the Transaction ID/UTR and upload it below.' 
  },
  minTeamSize: { type: Number, default: 2 },
  maxTeamSize: { type: Number, default: 4 },

  // Project Submission Settings
  submissionDeadline: { type: Date, default: () => new Date('2026-03-27T23:59:59.000Z') },
  allowLateSubmissions: { type: Boolean, default: false },

  // Judging Weights (Default to 100 total)
  judgingCriteriaWeights: {
    innovation: { type: Number, default: 20 },
    technicalImplementation: { type: Number, default: 25 },
    problemRelevance: { type: Number, default: 15 },
    userExperience: { type: Number, default: 15 },
    scalability: { type: Number, default: 10 },
    impact: { type: Number, default: 10 },
    presentation: { type: Number, default: 5 }
  },

  // Contact Info & Socials
  contactEmail: { type: String, default: 'nexack@kgkite.ac.in' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  websiteUrl: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
    github: { type: String, default: 'https://github.com' },
    twitter: { type: String, default: 'https://twitter.com' },
    youtube: { type: String, default: 'https://youtube.com' },
    website: { type: String, default: '' }
  },

  // Homepage Settings
  heroTitle: { type: String, default: 'NEXACK 2K26' },
  heroDescription: { type: String, default: 'A next-generation hackathon where students transform real-world problems into technology-driven solutions.' },

  // Public Visibility Toggles
  isPublicLeaderboardEnabled: { type: Boolean, default: false },
  isResultsPublished: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  logo: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
