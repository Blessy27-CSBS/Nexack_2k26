import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code, Cpu, ShieldCheck, Zap, Users, Award, Trophy, ArrowRight } from 'lucide-react';
import HackathonExperience from '../components/Home/HackathonExperience';

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // THE CHARTER
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          ABOUT <span className="text-gradient">CSBS NEXACK 2K26</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          The flagship national-level technical hackathon uniting software craftsmanship, enterprise business systems, and breakthrough innovation.
        </p>
      </div>

      {/* Organizer Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Nexora */}
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
              <Terminal className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
              STUDENT ASSOCIATION
            </span>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">
              Nexora Association
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              Nexora is the premier student association of the Department of Computer Science & Business Systems. Driven to cultivate leadership, deep technical problem solving, and entrepreneurial mindsets through intense hackathons and developer forums.
            </p>
          </div>
        </div>

        {/* CODEX */}
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6">
              <Code className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              TECHNICAL GUILD
            </span>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">
              CODEX Coding Club
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              CODEX is the elite competitive coding and systems engineering club at KiTE. Focused on pushing algorithmic boundaries, full-stack architectures, AI models, and real-world software delivery.
            </p>
          </div>
        </div>

        {/* Department of CSBS */}
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-1">
              ACADEMIC PILLAR
            </span>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">
              Department of CSBS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
              The Department of Computer Science and Business Systems at KGiSL Institute of Technology uniquely combines foundational computer science with modern enterprise management, analytics, and business acumen.
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Hackathon Experience Narrative */}
      <HackathonExperience />

      {/* Who Can Participate Section */}
      <div className="my-20 rounded-3xl p-8 sm:p-14 border border-white/[0.08] bg-zinc-950/60 text-center max-w-4xl mx-auto">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
          // ELIGIBILITY & SQUADS
        </span>
        <h3 className="font-heading font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mb-4">
          WHO CAN PARTICIPATE?
        </h3>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-sans">
          CSBS NEXACK 2K26 Hackathon is open to undergraduate and postgraduate students from engineering, technology, and computer science streams nationwide. Squads consist of 2 to 4 members. Inter-year and inter-departmental collaborations are welcome!
        </p>

        <Link
          to="/register"
          className="inline-flex items-center space-x-2 px-9 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform"
        >
          <span>REGISTER YOUR TEAM NOW</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </Link>
      </div>
    </div>
  );
};

export default About;
