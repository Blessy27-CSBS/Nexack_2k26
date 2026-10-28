import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Users, Cpu, Clock, Layers, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntroductionSection = ({ stats, trackCount = 0, settings }) => {
  const participantsCount = stats?.totalParticipants ? `${stats.totalParticipants}+` : '500+';
  const teamsCount = stats?.totalTeams ? `${stats.totalTeams}` : '120+';
  const challengesCount = trackCount > 0 ? `${trackCount}` : '8';
  const hoursCount = `${settings?.durationHours || 24}`;

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Editorial Section Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            // 01 ARCHITECTURE
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            CSBS × NEXORA × CODEX
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-500 flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>STATUS: LIVE_PRODUCTION</span>
        </div>
      </div>

      {/* Asymmetric Editorial Header & Paragraph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase block mb-3">
            THE HACKATHON
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[0.95] uppercase">
            One platform.<br />
            Multiple problems.<br />
            <span className="text-gradient">Unlimited ways</span> to build.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:pt-4"
        >
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-sans border-l-2 border-emerald-500/40 pl-5">
            The <strong className="text-white font-semibold">CSBS NEXACK 2K26 Hackathon</strong> is an intensive 24-hour developer crucible organized by the <strong className="text-white">Department of Computer Science and Business Systems</strong> in joint partnership with <strong className="text-emerald-400">Nexora Association</strong> and <strong className="text-cyan-400">CODEX Coding Club</strong>.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed font-sans pl-5">
            Engineered to bridge computer science architectures with business-critical execution, squads compete across real-world problem statements, build production-ready systems, and pitch directly to industry tech architects.
          </p>
          <div className="pl-5 pt-2">
            <Link
              to="/about"
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-400 hover:text-emerald-300 group"
            >
              <span>READ THE FULL CHARTER</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Editorial Large Animated Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-t border-b border-white/[0.08] py-10 my-10 bg-white/[0.01]">
        {/* Stat 1: Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 sm:p-6 border-r border-white/[0.06] last:border-r-0 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">[ 01 // SCALE ]</span>
            <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tighter mb-1 group-hover:text-emerald-400 transition-colors">
              {participantsCount}
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Participants
            </div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Top engineers & designers
            </p>
          </div>
        </motion.div>

        {/* Stat 2: Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 sm:p-6 border-r border-white/[0.06] last:border-r-0 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">[ 02 // SQUADS ]</span>
            <Terminal className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tighter mb-1 group-hover:text-cyan-400 transition-colors">
              {teamsCount}
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Active Teams
            </div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Collaborative squad units
            </p>
          </div>
        </motion.div>

        {/* Stat 3: Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 sm:p-6 border-r border-white/[0.06] last:border-r-0 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">[ 03 // TRACKS ]</span>
            <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tighter mb-1 group-hover:text-amber-400 transition-colors">
              {challengesCount}
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Challenges
            </div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Industry problem statements
            </p>
          </div>
        </motion.div>

        {/* Stat 4: Sprint Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 sm:p-6 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">[ 04 // SPRINT ]</span>
            <Clock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tighter mb-1 group-hover:text-purple-400 transition-colors">
              {hoursCount}H
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Continuous Sprint
            </div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Non-stop building & shipping
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroductionSection;
