import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultTimelineItems = [
  {
    step: '01',
    phase: 'REGISTRATION PORTAL LAUNCH',
    title: 'Participant Intake & Team Registration',
    time: 'Day 01 — 09:00 AM',
    date: 'March 27, 2026',
    desc: 'Registration officially opens for collegiate teams nationwide. Submit team profiles, select preferred challenge domains, and complete verification.',
    status: 'COMPLETED'
  },
  {
    step: '02',
    phase: 'TEAM FORMATION & CHECK-IN',
    title: 'Venue Arrival, Kit Issuance & QR Verification',
    time: 'Day 01 — 10:30 AM',
    date: 'March 27, 2026',
    desc: 'Campus arrival, physical desk verification, developer lanyard kit distribution, Wi-Fi credentials issuance, and desk allocation.',
    status: 'ACTIVE'
  },
  {
    step: '03',
    phase: 'HACKATHON COMMENCEMENT',
    title: 'Opening Keynote & Problem Statement Release',
    time: 'Day 01 — 11:30 AM',
    date: 'March 27, 2026',
    desc: 'Inaugural address by department leadership and industry guests. Detailed challenge parameters and evaluation rubrics unlocked.',
    status: 'UPCOMING'
  },
  {
    step: '04',
    phase: 'SPRINT DEVELOPMENT',
    title: '24-Hour Code Marathon & Architecture Sprint',
    time: 'Day 01 — 12:00 PM',
    date: 'March 27, 2026',
    desc: 'Non-stop hacking begins across all halls. High-speed network connectivity, continuous refreshments, and late-night development sprint.',
    status: 'UPCOMING'
  },
  {
    step: '05',
    phase: 'MENTORSHIP CHECKPOINTS',
    title: 'Round 1 & Round 2 Technical Review Desks',
    time: 'Day 01 — 06:00 PM & 11:00 PM',
    date: 'March 27, 2026',
    desc: 'Technical architects and industry experts conduct direct desk reviews, stress-test logic, and advise on optimization paths.',
    status: 'UPCOMING'
  },
  {
    step: '06',
    phase: 'SUBMISSION LOCKDOWN',
    title: 'GitHub Commit Freeze & Submission Portals Lock',
    time: 'Day 02 — 12:00 PM',
    date: 'March 28, 2026',
    desc: 'All code commits finalized on GitHub repositories. System architecture documents, demo video links, and deployment endpoints locked.',
    status: 'UPCOMING'
  },
  {
    step: '07',
    phase: 'GRAND JURY EVALUATION',
    title: 'Auditorium Pitch Defense & Working Demos',
    time: 'Day 02 — 01:30 PM',
    date: 'March 28, 2026',
    desc: 'Shortlisted finalist teams present live product demonstrations and defend technical architectures in front of distinguished jury panels.',
    status: 'UPCOMING'
  },
  {
    step: '08',
    phase: 'RESULTS & VALEDICTORY',
    title: 'Podium Honors, Cash Prize Awards & Closure',
    time: 'Day 02 — 04:30 PM',
    date: 'March 28, 2026',
    desc: 'Grand announcement of winners, trophy distribution, cash awards, certificates of merit, and closing ceremonies.',
    status: 'UPCOMING'
  }
];

const TimelineSection = ({ timeline = [] }) => {
  const displayItems = timeline && timeline.length >= 4 ? timeline.map((item, idx) => ({
    step: String(idx + 1).padStart(2, '0'),
    phase: `MILESTONE_${String(idx + 1).padStart(2, '0')}`,
    title: item.title,
    time: item.time || `Phase ${idx + 1}`,
    date: item.date || 'Event Day',
    desc: item.description,
    status: idx === 0 ? 'COMPLETED' : idx === 1 ? 'ACTIVE' : 'UPCOMING'
  })) : defaultTimelineItems;

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            // 06 CHRONOLOGY
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            EVENT TIMELINE & MILESTONES
          </span>
        </div>
        <Link
          to="/timeline"
          className="text-xs font-mono uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 group"
        >
          <span>VIEW FULL SCHEDULE</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Heading */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          EVENT <span className="text-gradient">TIMELINE</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Synchronized milestones structured for continuous velocity from intake to podium presentation.
        </p>
      </div>

      {/* Editorial Vertical Staggered Timeline */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-12 space-y-10">
        {displayItems.map((item, idx) => {
          const isActive = item.status === 'ACTIVE';
          const isDone = item.status === 'COMPLETED';

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Marker Node on Timeline */}
              <div className={`absolute -left-[31px] sm:-left-[55px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125 bg-[#07080a] ${
                isActive
                  ? 'border-emerald-400 shadow-neon-emerald'
                  : isDone
                  ? 'border-cyan-400'
                  : 'border-zinc-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-emerald-400 animate-ping' : isDone ? 'bg-cyan-400' : 'bg-zinc-600'
                }`} />
              </div>

              {/* Event Card */}
              <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'bg-zinc-900/90 border-emerald-500/50 shadow-2xl shadow-emerald-500/10'
                  : 'bg-zinc-950/60 border-white/[0.08] hover:border-white/20'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                      {item.step}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                      // {item.phase}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center space-x-1.5 text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.date}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TimelineSection;
