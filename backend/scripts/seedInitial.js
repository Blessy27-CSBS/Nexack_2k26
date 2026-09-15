import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Admin from '../models/Admin.js';
import SiteSettings from '../models/SiteSettings.js';
import Track from '../models/Track.js';
import Team from '../models/Team.js';
import Submission from '../models/Submission.js';
import Participant from '../models/Participant.js';

const seedInitial = async () => {
  try {
    await connectDB();
    console.log('⚡ Connected to MongoDB for Initial Setup...');

    // 1. Ensure SiteSettings exists with official defaults
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        eventName: 'NEXACK 2K26',
        edition: '2026',
        tagline: 'BUILD. BREAK. INNOVATE.',
        supportingPhrase: 'WHERE IDEAS BECOME IMPACT.',
        description: 'A next-generation hackathon where students transform real-world problems into technology-driven solutions.',
        organizerName: 'Nexora Association',
        department: 'Department of Computer Science & Business Systems',
        college: 'KGiSL Institute of Technology',
        venue: 'KGiSL Campus, Coimbatore, Tamil Nadu',
        venueAddress: 'KGiSL Campus, Saravanampatti, Coimbatore - 641035',
        eventDate: new Date('2026-03-27T09:00:00.000Z'),
        startTime: '08:30 AM',
        endTime: '05:30 PM',
        durationHours: 24,
        registrationStatus: 'Open',
        registrationFee: 400,
        currency: '₹',
        upiId: process.env.UPI_ID || '',
        upiQrCode: '',
        minTeamSize: 2,
        maxTeamSize: 4,
        submissionDeadline: new Date('2026-03-27T23:59:59.000Z'),
        allowLateSubmissions: false,
        judgingCriteriaWeights: {
          innovation: 20,
          technicalImplementation: 25,
          problemRelevance: 15,
          userExperience: 15,
          scalability: 10,
          impact: 10,
          presentation: 5
        },
        contactEmail: process.env.CONTACT_EMAIL || 'nexack@kgkite.ac.in',
        contactPhone: process.env.CONTACT_PHONE || '+91 98765 43210',
        isPublicLeaderboardEnabled: false,
        isResultsPublished: false
      });
      console.log('✅ Default SiteSettings initialized.');
    } else {
      console.log('ℹ️ SiteSettings already exists.');
    }

    // 2. Ensure initial Super Admin account exists
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nexack.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'NexackAdmin@2026';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    let superAdmin = await Admin.findOne({ email: adminEmail });
    if (!superAdmin) {
      superAdmin = await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin',
        designation: 'Chief Administrator',
        organization: 'Nexora Association',
        isActive: true
      });
      console.log(`✅ SuperAdmin account created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ SuperAdmin already exists: ${adminEmail}`);
    }

    // 3. Ensure database indexes
    await Track.init();
    await Team.init();
    await Submission.init();
    await Participant.init();
    console.log('✅ Database indexes synchronized.');

    console.log('\n🚀 Initial system configuration completed successfully!');
    console.log('Strict Dynamic Content Note: Zero mock public records were seeded.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedInitial();
