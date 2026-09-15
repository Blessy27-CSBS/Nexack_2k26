# NEXACK 2K26 - Full-Stack Transformation Walkthrough

> **"BUILD. BREAK. INNOVATE."**  
> Organized by **Nexora Association**, Department of Computer Science & Business Systems (CSBS), **KGiSL Institute of Technology (KiTE)**.

---

## 🎯 Executive Summary

The legacy symposium website (**Z-NEXUS 2K26**) has been completely transformed into **NEXACK 2K26**, an enterprise-grade full-stack hackathon management platform.

### Core Philosophy Enforced
1. **Strict Dynamic Content & Zero Mock Data**: No hardcoded public items (tracks, mentors, sponsors, faculty, association, gallery, prizes, timeline, rules, announcements, FAQs, results).
2. **Clean Empty States**: All frontend views gracefully render cyber-styled empty state cards when database collections are empty (e.g. *"Hackathon tracks will be announced soon"*).
3. **Minimal Safe Seed Script**: `node scripts/seedInitial.js` establishes indexes, default `SiteSettings`, and the initial Super Admin account from `.env`.
4. **Resilient Local & Cloud Uploads**: Multer disk storage in `backend/uploads/` with static asset serving and transparent Cloudinary CDN fallback.

---

## 🛠️ Completed Architecture & Components

### 1. Database Schemas (`backend/models/`)
- `SiteSettings.js`: Event timing, venue, UPI QR & payee info, registration fees per member, team size constraints, submission deadlines, judging rubric weights (100 pts), and 12 public visibility toggles.
- `Admin.js`: RBAC hierarchy (`Super Admin`, `Admin`, `Judge`) with Bcrypt password hashing.
- `Participant.js`: Team leader / participant accounts with Bcrypt authentication.
- `Team.js`: Unique `teamId` generator (`NEXACK-2K26-XXXX`), team roster subdocuments, track linkage, payment status (`pending`, `verified`, `rejected`), payment proof URL, and admin rejection feedback.
- `Track.js`: Numbered tracks, problem areas, eligibility, suggested tech stacks, and Draft/Published/Archived statuses.
- `Submission.js`: Project identifier (`SUB-2K26-XXXX`), deadline check, repo URLs, live demo URLs, attachments, assigned judges, and status (`draft`, `submitted`, `evaluated`).
- `Evaluation.js`: 7-criterion scoring rubric (Max 100 points), remarks, score lock flag, and Super Admin unlock capability.
- `Result.js`: Winner rankings, awards (1st, 2nd, 3rd, Best Innovative, etc.), cash prizes, citations, and publication toggle.
- **Dynamic Content Models**: `Mentor.js`, `Faculty.js`, `AssociationMember.js`, `Sponsor.js`, `TimelineEvent.js`, `Prize.js`, `Rule.js`, `FAQ.js`, `Announcement.js`, `Gallery.js`, `ContactMessage.js`.

---

## 🧪 Verification & Build Results

### Automated Production Build
```
> nexack-frontend@1.0.0 build
> vite build

vite v5.4.21 building for production...
✓ 1760 modules transformed.
dist/index.html                   1.75 kB │ gzip:   0.86 kB
dist/assets/index-DVKB27rW.css   63.03 kB │ gzip:  10.71 kB
dist/assets/index-D62ueNXt.js   954.03 kB │ gzip: 263.27 kB
✓ built in 20.07s
```
- **Result**: Zero compilation errors, zero broken imports, complete production bundle emitted.

### Backend Syntax & Module Validation
- `node --check server.js` -> **Pass (Exit Code 0)**
- `node --check scripts/seedInitial.js` -> **Pass (Exit Code 0)**
- Server route mounting & Cloudinary fallback verified -> **Pass (Exit Code 0)**

---

## 🚀 Running the Platform

### 1. Start Backend
```bash
cd backend
npm install
node scripts/seedInitial.js
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Default Super Admin Access
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@nexack.com`
- **Password**: `Admin@Nexack2K26`
