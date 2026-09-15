# ⚡ NEXACK 2K26 - Hackathon Management Platform


## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Modules & Features](#-key-modules--features)
  - [1. Public Hackathon Experience](#1-public-hackathon-experience)
  - [2. Participant & Team Desk](#2-participant--team-desk)
  - [3. Super Admin Management Center](#4-super-admin-management-center)
- [🛡️ Zero Mock Data Architecture](#️-zero-mock-data-architecture)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📦 Project Directory Structure](#-project-directory-structure)
- [⚡ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [🔑 Default Credentials](#-default-credentials)
- [🔐 Environment Variables](#-environment-variables)
- [🌐 REST API Reference](#-rest-api-reference)
- [🚢 Deployment Guide](#-deployment-guide)
- [👥 Organization & Credits](#-organization--credits)
- [📄 License](#-license)

---

## 🌟 Overview

**NEXACK 2K26** is an enterprise-grade, full-stack hackathon management and operations platform engineered to power competitive hackathons end-to-end. Designed with a futuristic dark cyber aesthetic, the platform unifies:

- Multi-step team onboarding with dynamic UPI QR code payments and verification.
- A live participant desk with project submissions, deadline countdowns, and real-time team roster management.
- A secure judge portal featuring a rigorous 7-criteria 100-point evaluation rubric and score locking.
- A real-time super admin command center with analytics, instant payment approval/rejection workflows, Excel reporting, and 100% dynamic CMS content management.

---

## ✨ Key Modules & Features

### 1. Public Hackathon Experience
- **Futuristic Cyber Interface**: Neon cyberpunk design tokens, dynamic glow effects, smooth Framer Motion animations, and responsive mobile layout.
- **Dynamic Countdown Timer**: Live target countdown synced with backend system settings.
- **Dynamic Track Directory**: Problem areas, eligibility, tech stack tags, and track-specific CTAs.
- **Interactive Milestone Timeline**: Chronological event roadmap from registration opening to code freeze and valedictory.
- **Prize Pool & Special Awards**: Cash rewards, certificates, sponsor bounties, and perks breakdown.
- **Official Rules & Conduct**: Categorized guidelines on team eligibility, submission criteria, and intellectual property.
- **Community & Partner Portals**: Dedicated showcases for Mentors, Faculty Coordinators, Nexora Office Bearers, and Tiered Sponsors.
- **Interactive Photo Gallery**: Category-filtered event memories with full-screen modal previews.
- **Live Notice Board**: Real-time broadcast alerts with priority badges (`Urgent`, `General`, `Notice`).
- **FAQ & Support Desk**: Expandable categorized FAQs and direct inquiry submission form.

### 2. Participant & Team Desk
- **3-Step Registration Wizard**:
  1. Team lead & organization details
  2. Track selection & dynamic team member roster (2-4 members)
  3. Dynamic UPI payment gateway with dynamic QR generation and proof screenshot upload
- **Unique System Identifiers**:
  - Auto-generated Team ID: `NEXACK-2K26-XXXX`
  - Auto-generated Project Submission ID: `SUB-2K26-XXXX`
- **Real-Time Participant Dashboard**:
  - Registration status tracking (`Pending`, `Approved`, `Rejected`)
  - Team roster editor (add/update member details prior to lock)
  - Direct re-upload flow if payment receipt was rejected by admin with specific reason
- **Project Submission Engine**:
  - Strict submission window enforcement (blocks early/late submissions)
  - GitHub/GitLab repository links, live deployment URLs, presentation slides, tech stack tags, and architecture diagrams.


### 3. Super Admin Management Center
- **Live Analytics Hub**: Total registrations, revenue, payment status distribution, track popularity charts, and conversion funnel.
- **Registrations & Payments Desk**:
  - Zoomable payment proof preview modal
  - 1-click Approval / Rejection with feedback reason sent to team dashboard
  - Full `.xlsx` data export for offline coordination
- **Project Submissions Desk**: Review project details, launch GitHub/demo links, assign judges, and review composite scores.
- **100% Dynamic CMS Desks**:
  - Tracks, Milestones, Prizes, Rules, Mentors, Faculty, Office Bearers, Sponsors, Gallery, FAQs, Announcements, Inquiries.
- **Global Platform Settings (`SiteSettings`)**:
  - Event dates, countdown target, venue, UPI payee ID, QR code, fees, max team size, rubric weightages, and public visibility flags.

---

## 🛡️ Zero Mock Data Architecture

- **No Hardcoded Public Data**: All public cards, carousels, lists, and statistics query MongoDB.
- **Cyber-Themed Empty States**: When collections are empty, components render sleek empty state notices (e.g., *"Tracks will be announced soon"*).
- **Minimal Safe Seed**: `node scripts/seedInitial.js` initializes required indexes, default `SiteSettings`, and the root Super Admin account safely without injecting fake mock teams.

---

## 🛠️ Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER                         │
│   React 18  •  Vite  •  TailwindCSS  •  Framer Motion   │
│   Lucide Icons  •  Axios  •  Canvas-Confetti  •  XLSX   │
└───────────────────────────┬─────────────────────────────┘
                            │ REST / JSON (JWT Auth)
┌───────────────────────────▼─────────────────────────────┐
│                     SERVER TIER                         │
│     Node.js  •  Express.js  •  Helmet  •  Rate Limit    │
│      Multer (Disk Storage + Cloudinary CDN Support)     │
└───────────────────────────┬─────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼─────────────────────────────┐
│                    DATABASE TIER                        │
│             MongoDB (Local / Atlas Cloud)               │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Lucide React, Axios, Canvas Confetti, SheetJS (XLSX) |
| **Backend** | Node.js (ES Modules), Express.js, Helmet, Express Rate Limit, CORS, Dotenv |
| **Database** | MongoDB with Mongoose ODM (indexed schemas for high-speed queries) |
| **Security & Auth** | Dual JWT strategy (Admin/Judge vs Participant), Bcrypt password hashing |
| **Media Handling** | Multer file uploads with local storage fallback (`backend/uploads/`) and Cloudinary integration |

---

## 📦 Project Directory Structure

```
Nexack_2K26/
├── backend/
│   ├── config/             # MongoDB connection & Cloudinary setup
│   ├── controllers/        # Modular Express controllers (Auth, Teams, Admin, etc.)
│   ├── middleware/         # JWT Auth, Multer upload, and central error handlers
│   ├── models/             # Mongoose schemas (SiteSettings, Team, Submission, etc.)
│   ├── routes/             # RESTful route definitions (/api/v1/*)
│   ├── scripts/            # Seed script (node scripts/seedInitial.js)
│   ├── uploads/            # Local media storage directory
│   ├── .env.example        # Backend environment template
│   ├── package.json
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── public/             # Static SVGs, logos, and favicons
│   ├── src/
│   │   ├── components/     # Navbar, Footer, EmptyState, Modal, Loaders, Guards
│   │   │   └── Home/       # Hero, Tracks, Countdown, About, Highlights
│   │   ├── context/        # AuthContext (dual sessions), ThemeContext
│   │   ├── pages/          # Public and participant portal views
│   │   │   └── admin/      # 20+ Admin management desks & forms
│   │   ├── services/       # Centralized Axios API client
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # Client-side routing with role-based guards
│   │   ├── index.css       # Tailwind directives & futuristic design tokens
│   │   └── main.jsx        # React root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .env.example            # Root environment reference
├── .gitignore              # Git ignore rules (builds, node_modules, .env)
├── README.md               # Project documentation
└── WALKTHROUGH.md          # Architecture transformation record
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

---

### 1. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file:
   ```bash
   cp .env.example .env
   # Or copy manually on Windows:
   copy .env.example .env
   ```

4. Configure `backend/.env` (update values if needed):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/nexack_2k26
   JWT_SECRET=nexack_super_secret_jwt_key_2k26_production
   JWT_EXPIRE=7d

   # Initial Super Admin Provisioning
   ADMIN_NAME=Nexora Super Admin
   ADMIN_EMAIL=admin@nexack.com
   ADMIN_PASSWORD=Admin@Nexack2K26

   # Optional: Cloudinary CDN (falls back to local uploads if omitted)
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

4. Seed initial indexes, settings, and Super Admin:
   ```bash
   npm run seed
   # Or: node scripts/seedInitial.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > 🚀 The backend will start on: **`http://localhost:5000`**

---

### 2. Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > 🌐 The application will be live at: **`http://localhost:5173`**

4. To generate a production build:
   ```bash
   npm run build
   ```

---

## 🔑 Default Credentials

After executing `npm run seed`:

| Portal | URL | Email | Password | Role |
|---|---|---|---|---|
| **Admin Command Center** | `http://localhost:5173/admin/login` | `admin@nexack.com` | `Admin@Nexack2K26` | `Super Admin` |
| **Participant Portal** | `http://localhost:5173/login` | *Registered Team Lead Email* | *Chosen Password* | `Participant` |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB connection connection string | `mongodb://127.0.0.1:27017/nexack_2k26` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `nexack_super_secret_jwt_key_2k26_production` |
| `JWT_EXPIRE` | Token expiry duration | `7d` |
| `ADMIN_NAME` | Initial Super Admin display name | `Nexora Super Admin` |
| `ADMIN_EMAIL` | Initial Super Admin login email | `admin@nexack.com` |
| `ADMIN_PASSWORD` | Initial Super Admin password | `Admin@Nexack2K26` |


### Frontend (`frontend/.env.development` & `frontend/.env.production`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base endpoint for backend API | `http://localhost:5000/api/v1` |

---

## 🌐 REST API Reference

All routes are versioned under `/api/v1`:

### Authentication & Users
- `POST /api/v1/auth/admin/login` — Super Admin & Judge login
- `POST /api/v1/auth/participant/login` — Team Leader / Participant login
- `GET /api/v1/auth/me` — Retrieve active profile & verified session

### Teams & Registrations
- `POST /api/v1/teams/register` — Multi-step team registration with payment slip upload
- `GET /api/v1/teams/my-team` — Retrieve logged-in team profile & members
- `PUT /api/v1/teams/my-team` — Update team details & roster before lock
- `POST /api/v1/teams/reupload-payment` — Re-upload payment receipt after rejection

### Admin Management
- `GET /api/v1/admin/analytics` — Real-time registration, track, and revenue metrics
- `GET /api/v1/teams` — Query all registered teams with status filters
- `PUT /api/v1/teams/:id/status` — Approve or reject team registration
- `GET /api/v1/settings` — Read platform configuration
- `PUT /api/v1/settings` — Update timing, venue, UPI credentials, and visibility flags

### Project Submissions & Judging
- `POST /api/v1/submissions` — Create or update team project submission
- `GET /api/v1/submissions/my-submission` — View team's submitted project
- `POST /api/v1/submissions/:id/assign` — Admin assigns judge to project
- `GET /api/v1/judging/assigned` — Projects assigned to authenticated judge
- `POST /api/v1/judging/evaluate` — Submit 7-criterion 100-pt evaluation
- `GET /api/v1/leaderboard` — Computed score rankings and leaderboard
- `GET /api/v1/results` — Public podium winners

### Dynamic Content Desks (CRUD)
- `/api/v1/tracks` — Tracks & problem statements
- `/api/v1/events` — Milestone timeline events
- `/api/v1/prizes` — Prize pool & recognition categories
- `/api/v1/rules` — Official competition rules
- `/api/v1/mentors` — Hackathon mentors & domain guides
- `/api/v1/faculty` — Faculty coordinators
- `/api/v1/association` — Nexora association student committee
- `/api/v1/partners` — Corporate sponsors & community partners
- `/api/v1/gallery` — Event photo gallery
- `/api/v1/content/announcements` — Broadcast announcement alerts
- `/api/v1/content/faqs` — Frequently asked questions
- `/api/v1/contact` — Participant inquiries & messages

---

## 🚢 Deployment Guide

### Deploying Frontend (Vercel / Netlify)
1. Push this repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set **Root Directory** to `frontend`.
4. Build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Configure Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api-domain.com/api/v1`

### Deploying Backend (Render / Railway / VPS)
1. Set **Root Directory** to `backend`.
2. Build & Start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nexack_2k26`
   - `JWT_SECRET=your_strong_secret`
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
4. Run `npm run seed` once to initialize the production database settings and Super Admin.

---

## 👥 Organization & Credits

- **Host Organization**: **Nexora Association**
- **Department**: Department of Computer Science & Business Systems (CSBS)
- **Institution**: [KGiSL Institute of Technology (KiTE)](https://www.kgkite.ac.in/), Coimbatore, Tamil Nadu, India
- **Event**: NEXACK 2K26 Hackathon

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
