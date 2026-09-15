import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import Hero from '../components/Home/Hero';
import Highlights from '../components/Home/Highlights';
import AboutSection from '../components/Home/AboutSection';
import IntroWelcome from '../components/Home/IntroWelcome';
import OrbitalTracks from '../components/Home/OrbitalTracks';
import ArtmasterTrackCards from '../components/Home/ArtmasterTrackCards';
import EmptyState from '../components/EmptyState';
import {
  settingsService,
  trackService,
  timelineService,
  announcementService,
  adminService
} from '../services/api';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, tracksRes, timelineRes, announceRes] = await Promise.all([
          settingsService.getPublicSettings().catch(() => ({ data: { settings: null } })),
          trackService.getPublished().catch(() => ({ data: { tracks: [] } })),
          timelineService.getPublic().catch(() => ({ data: { items: [] } })),
          announcementService.getPublic().catch(() => ({ data: { items: [] } }))
        ]);

        if (settingsRes.data?.settings) setSettings(settingsRes.data.settings);
        if (tracksRes.data?.tracks) setTracks(tracksRes.data.tracks);
        if (timelineRes.data?.items) setTimeline(timelineRes.data.items);
        if (announceRes.data?.items) setAnnouncements(announceRes.data.items);

        // Fetch non-sensitive aggregate stats for real counts
        try {
          const statsRes = await adminService.getStats();
          if (statsRes.data?.metrics) setStats(statsRes.data.metrics);
        } catch {
          // Public visitor - stats endpoint may be admin protected, fallback gracefully
          setStats({ totalTeams: 0, totalParticipants: 0 });
        }
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Urgent announcement banner
  const urgentAnnouncement = announcements.find(a => a.priority === 'urgent' || a.priority === 'high');

  return (
    <div className="min-h-screen text-white">
      {/* Urgent Announcement Notice */}
      {urgentAnnouncement && (
        <div className="bg-gradient-to-r from-cyan-950 via-blue-900 to-purple-950 border-b border-cyan-500/30 px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">Announcement:</span>
          <span className="text-slate-200">{urgentAnnouncement.title} — {urgentAnnouncement.message}</span>
        </div>
      )}

      {/* Intro Welcome Animation */}
      <IntroWelcome />

      {/* Hero Section */}
      <Hero settings={settings} />

      {/* Event Highlights & Real Stats */}
      <Highlights
        stats={stats}
        trackCount={tracks.length}
        settings={settings}
      />

      {/* About Section */}
      <AboutSection />

      {/* Tracks Orbital & Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
              Problem Domains
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-3">
              HACKATHON <span className="text-gradient">TRACKS</span>
            </h2>
          </div>

          <Link
            to="/tracks"
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 group"
          >
            <span>VIEW ALL TRACKS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Artmaster Course-Style Track Cards Animation */}
        <ArtmasterTrackCards tracks={tracks} />

        {/* Dynamic 3D Orbital Tracks Interactive Overview */}
        <div className="pt-10">
          <div className="text-center mb-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
              Orbital Domain Matrix
            </span>
          </div>
          <OrbitalTracks tracks={tracks} />
        </div>
      </section>

      {/* Timeline Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
            Road to Glory
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-3 mb-4">
            EVENT <span className="text-gradient">SCHEDULE</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Milestones and critical checkpoints throughout the NEXACK 2K26 marathon.
          </p>
        </div>

        {timeline.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {timeline.slice(0, 5).map((item, idx) => (
              <div
                key={item._id || idx}
                className="cyber-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="text-xs font-mono text-cyan-400 font-bold block">{item.date}</span>
                  <span className="text-[11px] text-slate-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="Schedule Coming Soon"
            message="Schedule will be announced soon. Administrators are finalizing the event phases."
          />
        )}
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="cyber-card p-10 sm:p-16 border border-cyan-500/30 relative overflow-hidden bg-gradient-to-b from-[#0e1222] to-[#07080d]">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-neon-cyan">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mb-4">
            READY TO <span className="text-gradient">INNOVATE?</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Form your squad, pick your challenge, and transform concepts into impactful working software at NEXACK 2K26.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-neon-cyan btn-glow hover:scale-105 transition-transform"
          >
            <span>REGISTER YOUR TEAM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Glow lights */}
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

export default Home;
