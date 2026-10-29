import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import Hero from '../components/Home/Hero';
import TextTicker from '../components/Home/TextTicker';
import IntroductionSection from '../components/Home/IntroductionSection';
import HackathonExperience from '../components/Home/HackathonExperience';
import ChallengesSection from '../components/Home/ChallengesSection';
import PrizeSection from '../components/Home/PrizeSection';
import TimelineSection from '../components/Home/TimelineSection';

import FAQSection from '../components/Home/FAQSection';
import OrganizersSection from '../components/Home/OrganizersSection';
import RegistrationCTA from '../components/Home/RegistrationCTA';

import {
  settingsService,
  trackService,
  timelineService,
  announcementService,
  prizeService,
  faqService,
  statsService
} from '../services/api';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, tracksRes, timelineRes, announceRes, prizeRes, faqRes] = await Promise.all([
          settingsService.getPublicSettings().catch(() => ({ data: { settings: null } })),
          trackService.getPublished().catch(() => ({ data: { tracks: [] } })),
          timelineService.getPublic().catch(() => ({ data: { items: [] } })),
          announcementService.getPublic().catch(() => ({ data: { items: [] } })),
          prizeService.getPublic().catch(() => ({ data: { items: [] } })),
          faqService.getPublic().catch(() => ({ data: { items: [] } }))
        ]);

        if (settingsRes.data?.settings) setSettings(settingsRes.data.settings);
        if (tracksRes.data?.tracks) setTracks(tracksRes.data.tracks);
        if (timelineRes.data?.items) setTimeline(timelineRes.data.items);
        if (announceRes.data?.items) setAnnouncements(announceRes.data.items);
        if (prizeRes.data?.items) setPrizes(prizeRes.data.items);
        if (faqRes.data?.items) setFaqs(faqRes.data.items);

        // Fetch stats if available
        try {
          const statsRes = await statsService.getPublicStats();
          if (statsRes.data?.metrics) setStats(statsRes.data.metrics);
        } catch {
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
    <div className="min-h-screen text-white bg-[#07080a] selection:bg-emerald-400 selection:text-black">
      {/* Urgent Announcement Alert */}
      {urgentAnnouncement && (
        <div className="bg-gradient-to-r from-amber-950/90 via-zinc-900 to-emerald-950/90 border-b border-amber-500/40 px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="text-amber-300 font-mono font-bold uppercase tracking-wider">ANNOUNCEMENT:</span>
          <span className="text-zinc-200">{urgentAnnouncement.title} — {urgentAnnouncement.message}</span>
        </div>
      )}

      {/* 1. Hero Section */}
      <Hero settings={settings} />

      {/* 2. Kinetic Text Ticker */}
      <TextTicker />

      {/* 3. Introduction Section (The Hackathon & Live Aggregate Stats) */}
      <IntroductionSection
        stats={stats}
        trackCount={tracks.length}
        settings={settings}
      />

      {/* 4. Hackathon Experience (5-Step Visual Narrative) */}
      <HackathonExperience />

      {/* 5. The Challenges (Interactive Problem Statement Cards & Specification Modal) */}
      <ChallengesSection tracks={tracks} />

      {/* 6. Prize Pool Section */}
      <PrizeSection prizes={prizes} />

      {/* 7. Event Timeline & Milestones */}
      <TimelineSection timeline={timeline} />

      
      

      {/* 9. Knowledge Base FAQ Accordion */}
      <FAQSection faqs={faqs} />

      {/* 10. Coalition & Organizers */}
      <OrganizersSection />

      {/* 11. Major Registration CTA Section */}
      <RegistrationCTA settings={settings} />
    </div>
  );
};

export default Home;
