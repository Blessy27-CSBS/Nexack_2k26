import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const IntroWelcome = ({ onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      // Check if intro has already been seen this session
      const seen = sessionStorage.getItem('nexack_intro_seen');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!seen && !prefersReducedMotion) {
        setShow(true);
        // Auto complete after 2.0s
        const timer = setTimeout(() => {
          handleDismiss();
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        if (onComplete) onComplete();
      }
    } catch {
      setShow(false);
      if (onComplete) onComplete();
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('nexack_intro_seen', 'true');
    } catch {}
    setShow(false);
    if (onComplete) onComplete();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        onClick={handleDismiss}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#070913] text-white overflow-hidden select-none cursor-pointer"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        {/* Skip Intro Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="absolute top-6 right-6 z-50 px-4 py-1.5 rounded-full bg-slate-800/90 hover:bg-cyan-500 hover:text-black border border-slate-700 text-xs font-mono font-semibold text-slate-300 transition shadow-lg cursor-pointer"
        >
          SKIP INTRO →
        </button>


        <div className="relative flex flex-col items-center text-center px-4">
          {/* Central Animated Geometric Box (Jitter square-logo-scale motion reference) */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center mb-6">
            {/* Outer Glow Ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1.2], opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 1.8, times: [0, 0.6, 1], ease: 'easeOut' }}
              className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl"
            />

            {/* Square 1: Scaling and rotating geometric shape */}
            <motion.div
              initial={{ scale: 0, rotate: -45, borderRadius: '40px' }}
              animate={{
                scale: [0, 1.15, 1],
                rotate: [-45, 0, 0],
                borderRadius: ['40px', '24px', '20px']
              }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full border-2 border-cyan-400/80 bg-gradient-to-tr from-cyan-950/60 via-blue-900/40 to-purple-950/60 shadow-2xl shadow-cyan-500/30 flex items-center justify-center"
            >
              {/* Inner Square Reveal */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.1, 1], opacity: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
              </motion.div>
            </motion.div>
          </div>

          {/* Logo Text Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
            className="space-y-1"
          >
            <h1 className="font-heading font-black text-4xl sm:text-6xl tracking-wider uppercase text-white">
              NEXACK <span className="text-cyan-400">2K26</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ delay: 1.6, duration: 0.9, ease: 'easeOut' }}
              className="text-xs sm:text-sm font-mono text-cyan-300/90 uppercase font-bold"
            >
              BUILD. BREAK. INNOVATE.
            </motion.p>
          </motion.div>

          {/* Organizer Subtitle Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.7 }}
            className="mt-6 text-[11px] font-mono text-slate-400"
          >
            Nexora Association • Department of CSBS • KGiSL Institute of Technology
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroWelcome;
