import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Compass,
  Hammer,
  GitPullRequest,
  Presentation,
  Trophy,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stages = [
  {
    number: '01',
    phase: 'DISCOVER',
    title: 'Select Problem Statement',
    summary: 'Analyze cross-industry bottlenecks across AI, Fintech, Web3, Distributed Cloud, and Enterprise Systems. Form your squad and pick your vector.',
    tag: 'CHALLENGE_SELECTION',
    icon: Compass,
    accent: 'emerald',
    badgeColor: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30',
    details: ['Evaluate problem constraints', 'Define target architecture', 'Register chosen challenge'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-emerald-950/80 via-zinc-950/90 to-black'
  },
  {
    number: '02',
    phase: 'BUILD',
    title: 'Develop Real Solutions',
    summary: '24 hours of pure execution. Code the frontend, train neural models, design resilient microservices, and deploy functional containerized systems.',
    tag: 'RAPID_PROTOTYPING',
    icon: Hammer,
    accent: 'cyan',
    badgeColor: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/30',
    details: ['Live mentor desk syncs', 'Version control checkpoints', 'Continuous testing & stress test'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-cyan-950/80 via-zinc-950/90 to-black'
  },
  {
    number: '03',
    phase: 'SUBMIT',
    title: 'Push Project & Repository',
    summary: 'Commit final repository commits, verify live demo deployments, submit system documentation, and generate automated submission hashes.',
    tag: 'REPOSITORY_LOCKDOWN',
    icon: GitPullRequest,
    accent: 'amber',
    badgeColor: 'from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30',
    details: ['GitHub repository lock', 'Architecture documentation', 'Demo video / deployed URL'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-amber-950/80 via-zinc-950/90 to-black'
  },
  {
    number: '04',
    phase: 'PRESENT',
    title: 'Defend Before Expert Jury',
    summary: 'Pitch your live working software to a distinguished panel of industry architects, technology leaders, and academic researchers in real-time.',
    tag: 'JURY_EVALUATION',
    icon: Presentation,
    accent: 'purple',
    badgeColor: 'from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30',
    details: ['Live feature walk-through', 'Technical Q&A defense', 'Business viability evaluation'],
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-purple-950/80 via-zinc-950/90 to-black'
  },
  {
    number: '05',
    phase: 'WIN',
    title: 'Claim Glory & Recognition',
    summary: 'Top innovative solutions are awarded substantial cash prizes, exclusive trophies, pre-placement interview opportunities, and incubation support.',
    tag: 'PODIUM_HONORS',
    icon: Trophy,
    accent: 'emerald',
    badgeColor: 'from-emerald-500/30 to-amber-500/10 text-emerald-300 border-emerald-500/40',
    details: ['Cash prize distribution', 'Accredited certificates', 'Industry incubation fast-track'],
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-emerald-950/90 via-zinc-950 to-black'
  }
];

// Single Parallax Step Card with multi-layer depth response
const ParallaxStepCard = ({ stage, index }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  // Smooth springs for fluid transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.8
  });

  // Layer 1: Background image moves at speed 1
  const imageY = useTransform(smoothProgress, [0, 1], ['-18%', '18%']);
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  // Layer 2: Giant watermark number moves faster in reverse direction
  const numberY = useTransform(smoothProgress, [0, 1], ['25%', '-25%']);

  // Layer 3: Foreground content cards offset
  const contentY = useTransform(smoothProgress, [0, 1], ['10%', '-10%']);

  const Icon = stage.icon;

  return (
    <div
      ref={cardRef}
      className="relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl bg-zinc-950 group flex flex-col justify-between"
    >
      {/* 1. Parallax Background Image Layer */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute -inset-y-12 inset-x-0 pointer-events-none will-change-transform"
      >
        <img
          src={stage.image}
          alt={stage.title}
          className="w-full h-full object-cover object-center filter brightness-[0.25] group-hover:brightness-[0.35] transition-all duration-700"
          loading="lazy"
        />
        {/* Layered Gradient Veil */}
        <div className={`absolute inset-0 bg-gradient-to-t ${stage.bgGradient} opacity-90`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-black" />
      </motion.div>

      {/* 2. Parallax Giant Watermark Number (Floating behind text) */}
      <motion.div
        style={{ y: numberY }}
        className="absolute top-4 right-6 sm:right-10 pointer-events-none select-none font-mono font-black text-8xl sm:text-9xl text-white/[0.06] group-hover:text-white/[0.12] transition-colors leading-none will-change-transform"
      >
        {stage.number}
      </motion.div>

      {/* 3. Top Floating Metadata Bar */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-emerald-400/50 transition-all shadow-lg">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-mono text-[10px] sm:text-xs text-zinc-400 tracking-widest uppercase block">
              PHASE // {stage.number}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
              {stage.phase}
            </span>
          </div>
        </div>

        <span className={`font-mono text-[11px] font-semibold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider bg-gradient-to-r ${stage.badgeColor}`}>
          {stage.tag}
        </span>
      </div>

      {/* 4. Parallax Content Body (Translates gracefully on scroll) */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 p-6 sm:p-8 space-y-4 will-change-transform"
      >
        <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
          {stage.title}
        </h3>

        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
          {stage.summary}
        </p>

        {/* Phase Action Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
          {stage.details.map((detail, dIdx) => (
            <div
              key={dIdx}
              className="p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center space-x-2 text-xs text-zinc-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="truncate">{detail}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Bottom Status Strip */}
      <div className="relative z-10 px-6 sm:px-8 py-4 bg-black/50 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>STAGE EXECUTION READY</span>
        </span>
        <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const HackathonExperience = () => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>// 02 METHODOLOGY</span>
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            PARALLAX LIFECYCLE ARCHITECTURE
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-500 flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>5_STAGE_EXECUTION_FLOW</span>
        </div>
      </div>

      {/* Editorial Title */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase block mb-3">
          HOW IT WORKS
        </span>
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          The <span className="text-gradient">Hackathon</span> Journey.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          A structured 5-phase lifecycle taking teams from initial discovery to high-stakes defense and podium recognition with continuous depth tracking.
        </p>
      </div>

      {/* Parallax Vertical Stack with Multi-Layer Depth */}
      <div className="space-y-8 sm:space-y-12">
        {stages.map((stage, idx) => (
          <ParallaxStepCard key={stage.number} stage={stage} index={idx} />
        ))}
      </div>

      {/* CTA Footer */}
      <div className="mt-16 text-center">
        <Link
          to="/register"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 hover:text-emerald-300 group px-6 py-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all shadow-neon-emerald"
        >
          <span>BEGIN YOUR HACKATHON EXPEDITION</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default HackathonExperience;