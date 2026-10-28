import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Hammer, GitPullRequest, Presentation, Trophy, ChevronRight, ArrowRight } from 'lucide-react';
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
    details: ['Evaluate problem constraints', 'Define target architecture', 'Register chosen challenge']
  },
  {
    number: '02',
    phase: 'BUILD',
    title: 'Develop Real Solutions',
    summary: '24 hours of pure execution. Code the frontend, train neural models, design resilient microservices, and deploy functional containerized systems.',
    tag: 'RAPID_PROTOTYPING',
    icon: Hammer,
    accent: 'cyan',
    details: ['Live mentor desk syncs', 'Version control checkpoints', 'Continuous testing & stress test']
  },
  {
    number: '03',
    phase: 'SUBMIT',
    title: 'Push Project & Repository',
    summary: 'Commit final repository commits, verify live demo deployments, submit system documentation, and generate automated submission hashes.',
    tag: 'REPOSITORY_LOCKDOWN',
    icon: GitPullRequest,
    accent: 'amber',
    details: ['GitHub repository lock', 'Architecture documentation', 'Demo video / deployed URL']
  },
  {
    number: '04',
    phase: 'PRESENT',
    title: 'Defend Before Expert Jury',
    summary: 'Pitch your live working software to a distinguished panel of industry architects, technology leaders, and academic researchers in real-time.',
    tag: 'JURY_EVALUATION',
    icon: Presentation,
    accent: 'purple',
    details: ['Live feature walk-through', 'Technical Q&A defense', 'Business viability evaluation']
  },
  {
    number: '05',
    phase: 'WIN',
    title: 'Claim Glory & Recognition',
    summary: 'Top innovative solutions are awarded substantial cash prizes, exclusive trophies, pre-placement interview opportunities, and incubation support.',
    tag: 'PODIUM_HONORS',
    icon: Trophy,
    accent: 'emerald',
    details: ['Cash prize distribution', 'Accredited certificates', 'Industry incubation fast-track']
  }
];

const HackathonExperience = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            // 02 METHODOLOGY
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            THE HACKATHON EXPERIENCE
          </span>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          5_STAGE_EXECUTION_FLOW
        </div>
      </div>

      {/* Editorial Heading */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          HOW IT <span className="text-gradient">WORKS</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          A structured 5-phase lifecycle taking teams from initial discovery to high-stakes defense and podium recognition.
        </p>
      </div>

      {/* Interactive Experience Horizontal / Grid Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeIdx === idx;

          return (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-zinc-900/90 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-zinc-950/60 border-white/[0.08] hover:border-white/20 hover:bg-zinc-900/40'
              }`}
            >
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className={`font-mono text-3xl sm:text-4xl font-black tracking-tighter transition-colors ${
                  isSelected ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'
                }`}>
                  {stage.number}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-neon-emerald'
                    : 'bg-white/5 text-zinc-400 border border-white/10 group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Phase */}
              <div>
                <span className="font-mono text-[10px] tracking-widest text-emerald-400/80 uppercase block mb-1">
                  [ {stage.phase} ]
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {stage.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  {stage.summary}
                </p>

                {/* Sub Checklist Details */}
                <div className="space-y-2 border-t border-white/[0.06] pt-4">
                  {stage.details.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center space-x-2 text-[11px] text-zinc-300 font-sans">
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  {stage.tag}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isSelected ? 'text-emerald-400 translate-x-1' : 'text-zinc-600'
                }`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Line */}
      <div className="mt-12 text-center">
        <Link
          to="/register"
          className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 hover:text-emerald-300 group"
        >
          <span>BEGIN YOUR HACKATHON EXPEDITION</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default HackathonExperience;
