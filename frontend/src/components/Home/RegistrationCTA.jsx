import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const RegistrationCTA = ({ settings }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7']
    });
  };

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Editorial Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-10 sm:p-20 border border-emerald-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#07080a] shadow-2xl overflow-hidden text-center"
      >
        {/* Background flares */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Small Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN THE CRUCIBLE // SQUAD REGISTRATION OPEN</span>
        </div>

        {/* Oversized Headline */}
        <h2 className="font-heading font-black text-4xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] uppercase mb-6">
          READY TO <span className="text-gradient">BUILD?</span>
        </h2>

        {/* Supporting text */}
        <p className="text-zinc-300 text-lg sm:text-2xl font-light font-heading max-w-2xl mx-auto mb-4">
          "Your idea is only the beginning."
        </p>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed mb-10">
          Assemble your squad of 2–4 developers, choose your vector, and compete in the premier national hackathon for the Department of CSBS.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            onClick={triggerConfetti}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-sm sm:text-base tracking-wider uppercase shadow-neon-emerald btn-glow flex items-center justify-center space-x-3 transition-transform hover:scale-105 active:scale-95"
          >
            <Flame className="w-5 h-5 text-black" />
            <span>REGISTER NOW →</span>
          </Link>

          <Link
            to="/tracks"
            className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-heading font-bold text-sm sm:text-base tracking-wider border border-white/15 hover:border-emerald-500/50 flex items-center justify-center transition-colors"
          >
            <span>EXPLORE CHALLENGES</span>
          </Link>
        </div>

        {/* Micro Metadata */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>INSTANT REGISTRATION PASS</span>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>GITHUB SUBMISSION INTEGRATION</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RegistrationCTA;
