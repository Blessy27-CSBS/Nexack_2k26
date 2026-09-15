import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import { AdminProtectedRoute, ParticipantProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Tracks from './pages/Tracks';
import TrackDetails from './pages/TrackDetails';
import Timeline from './pages/Timeline';
import Rules from './pages/Rules';
import Prizes from './pages/Prizes';
import Mentors from './pages/Mentors';
import Faculty from './pages/Faculty';
import Association from './pages/Association';
import Sponsors from './pages/Sponsors';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Announcements from './pages/Announcements';
import Contact from './pages/Contact';
import Results from './pages/Results';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Participant Protected Pages
import ParticipantDashboard from './pages/ParticipantDashboard';
import TeamDashboard from './pages/TeamDashboard';
import ProjectSubmission from './pages/ProjectSubmission';

// Admin Pages & Layout
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminPayments from './pages/admin/AdminPayments';
import AdminTracks from './pages/admin/AdminTracks';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminJudges from './pages/admin/AdminJudges';
import AdminEvaluations from './pages/admin/AdminEvaluations';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import AdminResults from './pages/admin/AdminResults';
import AdminTeams from './pages/admin/AdminTeams';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminPrizes from './pages/admin/AdminPrizes';
import AdminRules from './pages/admin/AdminRules';
import AdminMentors from './pages/admin/AdminMentors';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminAssociation from './pages/admin/AdminAssociation';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  if (initialLoading) {
    return <Loader fullScreen text="Initializing NEXACK 2K26..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      <ScrollToTop />

      {/* Render Public Navbar unless inside Admin Dashboard Layout */}
      {!isAdminRoute && <Navbar />}

      <main className={`flex-grow ${!isAdminRoute ? 'pt-20 sm:pt-24' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/tracks/:id" element={<TrackDetails />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/association" element={<Association />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/results" element={<Results />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Participant Portal (Protected) */}
          <Route element={<ParticipantProtectedRoute />}>
            <Route path="/dashboard" element={<ParticipantDashboard />} />
            <Route path="/my-team" element={<TeamDashboard />} />
            <Route path="/submit" element={<ProjectSubmission />} />
          </Route>

          {/* Admin & Judge Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/system-access" element={<Navigate to="/admin/login" replace />} />

          {/* Admin & Judge Portal (Protected Layout) */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/registrations" element={<AdminRegistrations />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/tracks" element={<AdminTracks />} />
              <Route path="/admin/submissions" element={<AdminSubmissions />} />
              <Route path="/admin/judges" element={<AdminJudges />} />
              <Route path="/admin/evaluations" element={<AdminEvaluations />} />
              <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
              <Route path="/admin/results" element={<AdminResults />} />
              <Route path="/admin/teams" element={<AdminTeams />} />
              <Route path="/admin/participants" element={<AdminParticipants />} />
              <Route path="/admin/timeline" element={<AdminTimeline />} />
              <Route path="/admin/prizes" element={<AdminPrizes />} />
              <Route path="/admin/rules" element={<AdminRules />} />
              <Route path="/admin/mentors" element={<AdminMentors />} />
              <Route path="/admin/faculty" element={<AdminFaculty />} />
              <Route path="/admin/association" element={<AdminAssociation />} />
              <Route path="/admin/sponsors" element={<AdminSponsors />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/faqs" element={<AdminFAQs />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Render Public Footer unless inside Admin Dashboard */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
