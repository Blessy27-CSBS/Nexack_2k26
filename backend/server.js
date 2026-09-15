import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import trackRoutes from './routes/trackRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import judgeRoutes from './routes/judgeRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import resultsRoutes from './routes/resultsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// Error Handler
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins
    if (!origin || allowedOrigins.some(o => origin.startsWith(o)) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api', apiLimiter);

// Serve local static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api', teamRoutes);
app.use('/api', trackRoutes);
app.use('/api', submissionRoutes);
app.use('/api', judgeRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', resultsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contentRoutes);

// Health Check / Root endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'NEXACK 2K26 Hackathon Management Platform',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('🚀 NEXACK 2K26 Hackathon API is online and operational.');
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 NEXACK 2K26 Backend Server running on port ${PORT}`);
    console.log(`🎯 API Base: http://localhost:${PORT}/api`);
    console.log(`======================================================\n`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB database:', err.message);
  // Still listen so health endpoint and diagnostics are available
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} in degraded state (no DB connection).`);
  });
});

export default app;
