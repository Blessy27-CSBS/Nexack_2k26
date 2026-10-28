import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, ShieldCheck, Flame, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Countdown from './Countdown';
import CyberMatrixBackground from './CyberMatrixBackground';
import Nexack3DCanvas from '../three/Nexack3DCanvas';
import { useWebGL } from '../../hooks/useWebGL';

const TAGLINES = [
  "BUILD. BREAK. INNOVATE.",
  "CODE THE IMPOSSIBLE.",
  "ENGINEER FOR IMPACT.",
  "24 HOURS OF PURE CREATION."
];

const Hero = ({ settings }) => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const { isSupported, qualityLevel } = useWebGL();

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerRegisterConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7']
    });
  };

  const eventDateStr = settings?.eventDate
    ? new Date(settings.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'March 27, 2026';

  const regStatus = settings?.registrationStatus || 'INTAKE_OPEN';

  // Words for main line-by-line reveal
  const titleLine1 = "CSBS";
  const titleLine2 = "NEXACK";
  const titleLine3 = "2K26";

  const letterVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.08 + i * 0.035,
        type: 'spring',
        stiffness: 320,
        damping: 22
      }
    })
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#06070a]">
      {/* 3D WebGL World Layer */}
      {isSupported && qualityLevel !== 'none' ? (
        <Nexack3DCanvas />
      ) : (
        <CyberMatrixBackground />
      )}

      {/* Atmospheric Halo */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[320px] bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Organizer Label Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 backdrop-blur-md mb-6 shadow-neon-emerald relative z-10"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono tracking-widest text-emerald-300 uppercase font-bold">
          NEXORA ASSOCIATION × CODEX CODING CLUB
        </span>
      </motion.div>

      {/* Main Title Heading */}
      <div className="text-center max-w-5xl mx-auto z-10">
        <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-9xl tracking-tight uppercase leading-[0.9] mb-4 flex flex-col items-center justify-center">
          {/* CSBS Line */}
          <span className="inline-flex text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]">
            {titleLine1.split('').map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                className="inline-block cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* NEXACK Line */}
          <span className="inline-flex text-gradient">
            {titleLine2.split('').map((char, index) => (
              <motion.span
                key={index}
                custom={index + titleLine1.length}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                className="inline-block cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* 2K26 Line */}
          <span className="inline-flex text-white/90 text-5xl sm:text-7xl lg:text-8xl tracking-tight mt-1">
            {titleLine3.split('').map((char, index) => (
              <motion.span
                key={index}
                custom={index + titleLine1.length + titleLine2.length}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                className="inline-block cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Dynamic Tagline Carousel */}
        <div className="h-6 overflow-hidden flex items-center justify-center mb-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-xs sm:text-sm tracking-widest text-emerald-400 uppercase font-bold"
            >
              "{TAGLINES[taglineIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Department subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 font-sans"
        >
          Department of Computer Science and Business Systems
        </motion.p>

        {/* Countdown */}
        <div className="mb-8">
          <Countdown
            targetDate={settings?.eventDate}
            durationHours={settings?.durationHours || 24}
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              to="/register"
              onClick={triggerRegisterConfetti}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-sm sm:text-base tracking-wider uppercase shadow-neon-emerald btn-glow flex items-center justify-center space-x-2.5 transition-all"
            >
              <Flame className="w-5 h-5 text-black" />
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Link
              to="/tracks"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-heading font-bold text-sm sm:text-base tracking-wider border border-white/15 hover:border-emerald-500/50 backdrop-blur-md flex items-center justify-center transition-colors"
            >
              <span>EXPLORE HACKATHON</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Symmetrical Event Quick Info Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-4xl mx-auto mt-10 pt-8 border-t border-white/10 text-xs text-zinc-300 font-sans w-full"
        >
          <div className="flex items-center justify-center space-x-2 bg-zinc-900/80 px-3 py-2.5 rounded-lg border border-white/10 hover:border-emerald-500/40 transition-colors shadow-sm truncate">
            <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-mono truncate">{eventDateStr}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-zinc-900/80 px-3 py-2.5 rounded-lg border border-white/10 hover:border-amber-500/40 transition-colors shadow-sm truncate">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="truncate">{settings?.venue || "KGiSL Campus"}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-zinc-900/80 px-3 py-2.5 rounded-lg border border-white/10 hover:border-purple-500/40 transition-colors shadow-sm truncate">
            <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="truncate">
              {settings?.minTeamSize || 2}-{settings?.maxTeamSize || 4} Members / Team
            </span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-zinc-900/80 px-3 py-2.5 rounded-lg border border-white/10 hover:border-emerald-500/40 transition-colors shadow-sm truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="uppercase font-mono font-bold text-xs text-emerald-300 truncate">
              {regStatus}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
