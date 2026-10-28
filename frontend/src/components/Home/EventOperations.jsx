import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, UserCheck, UploadCloud, QrCode, Wifi, 
  MonitorPlay, Wrench, GitFork, Tv, ShieldAlert, 
  ArrowRight, CheckCircle2 
} from 'lucide-react';

const operations = [
  {
    num: '01',
    title: 'EVENT WEBSITE',
    short: 'Public portal, documentation & live telemetry',
    desc: 'High-availability public site hosting track briefs, real-time announcements, sponsor portfolios, and public schedule.',
    icon: Globe,
    lead: 'Frontend & Infra Team',
    status: 'OPERATIONAL'
  },
  {
    num: '02',
    title: 'REGISTRATION SYSTEM',
    short: 'Team authentication & token verification',
    desc: 'Multi-member squad registration, payment gateway confirmation, track assignment, and unique participant ID issuance.',
    icon: UserCheck,
    lead: 'Auth & Data Ops',
    status: 'ACTIVE_INTAKE'
  },
  {
    num: '03',
    title: 'SUBMISSION PORTAL',
    short: 'Multi-stage code, demo & doc ingestion',
    desc: 'Automated artifact ingestion, GitHub branch tracking, deployment URL health checks, and draft staging.',
    icon: UploadCloud,
    lead: 'Evaluation Ops',
    status: 'READY'
  },
  {
    num: '04',
    title: 'QR CODES',
    short: 'Pass verification & food checkpoint tokens',
    desc: 'Cryptographically signed QR access tokens for contactless venue check-in, meal counters, and hall security.',
    icon: QrCode,
    lead: 'Security & Logistics',
    status: 'DISPATCHED'
  },
  {
    num: '05',
    title: 'INTERNET COORDINATION',
    short: 'High-bandwidth gigabit mesh network',
    desc: 'Dedicated dual-ISP fiber lines, dedicated Wi-Fi 6 SSID access points, and hardwired LAN tables for critical sprint work.',
    icon: Wifi,
    lead: 'Network Engineering',
    status: 'MONITORED'
  },
  {
    num: '06',
    title: 'PROJECTOR & DISPLAY',
    short: 'Auditorium staging & real-time telecasts',
    desc: 'Multi-screen presentation mirrors, high-lumen laser projectors, and live timer displays across all hack halls.',
    icon: MonitorPlay,
    lead: 'AV Engineering',
    status: 'CALIBRATED'
  },
  {
    num: '07',
    title: 'TECHNICAL TROUBLESHOOTING',
    short: '24/7 on-call hardware & cloud mentor desk',
    desc: 'Instant debugging desk resolving local server issues, container configuration, database connectivity, and cloud credits.',
    icon: Wrench,
    lead: 'Technical Support Squad',
    status: 'ON_STANDBY'
  },
  {
    num: '08',
    title: 'REPOSITORY / SUBMISSION MANAGEMENT',
    short: 'Git commit timestamps & commit hashing',
    desc: 'Automated commit hashing and git timestamp verification to guarantee authentic code authorship within hackathon sprint hours.',
    icon: GitFork,
    lead: 'Integrity Committee',
    status: 'ARMED'
  },
  {
    num: '09',
    title: 'PRESENTATION SETUP',
    short: 'Pitch halls & jury evaluation hardware',
    desc: 'Isolated evaluation chambers equipped with audio matrices, scoring terminals, and direct presentation feeds for jurors.',
    icon: Tv,
    lead: 'Jury Coordination',
    status: 'PREPARED'
  },
  {
    num: '10',
    title: 'BACKUP SYSTEMS',
    short: 'Redundant power UPS & failover database sync',
    desc: 'Uninterrupted power supplies, secondary database read-replicas, and offline registration ledger sync contingencies.',
    icon: ShieldAlert,
    lead: 'Disaster Recovery Ops',
    status: 'SYNCHRONIZED'
  }
];

const EventOperations = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />

      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            // 05 INFRASTRUCTURE
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            EVENT OPERATIONS & RESPONSIBILITIES
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          10_CORE_SUBSYSTEMS
        </div>
      </div>

      {/* Editorial Heading */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          EVENT <span className="text-gradient">OPERATIONS</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          The underlying operational backbone engineered by Nexora Association and CODEX to guarantee zero-friction participant execution.
        </p>
      </div>

      {/* Interactive Editorial Row List */}
      <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
        {operations.map((op, idx) => {
          const Icon = op.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <motion.div
              key={op.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`py-5 sm:py-6 px-4 sm:px-6 transition-all duration-300 cursor-pointer rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 group ${
                isHovered
                  ? 'bg-zinc-900/90 border border-emerald-500/30 shadow-xl shadow-emerald-500/5 translate-x-1 sm:translate-x-2'
                  : 'bg-transparent hover:bg-white/[0.02]'
              }`}
            >
              {/* Left: Number + Title + Icon */}
              <div className="flex items-center space-x-4 sm:space-x-8 min-w-[320px] sm:min-w-[380px]">
                <span className={`font-mono text-2xl sm:text-3xl font-black transition-colors ${
                  isHovered ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'
                }`}>
                  {op.num}
                </span>

                <div className={`p-2.5 rounded-xl border transition-all ${
                  isHovered
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-neon-emerald scale-105'
                    : 'bg-white/5 text-zinc-400 border-white/10 group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide uppercase group-hover:text-emerald-300 transition-colors">
                    {op.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    {op.short}
                  </p>
                </div>
              </div>

              {/* Middle: Expanded Description on desktop */}
              <div className="lg:max-w-md text-xs text-zinc-400 font-sans leading-relaxed pl-12 lg:pl-0">
                {op.desc}
              </div>

              {/* Right: Lead & Status Badges */}
              <div className="flex items-center justify-between lg:justify-end space-x-4 pl-12 lg:pl-0">
                <div className="text-right hidden sm:block">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">OWNER</div>
                  <div className="font-mono text-xs text-zinc-300 font-semibold">{op.lead}</div>
                </div>

                <div className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-md border flex items-center space-x-1.5 ${
                  isHovered
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-zinc-400 border-white/10'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                  <span>{op.status}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default EventOperations;
