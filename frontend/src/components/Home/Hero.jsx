import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';

const Hero = ({ settings }) => {
  const eventDateStr = settings?.eventDate
    ? new Date(settings.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'March 27, 2026';

  const regStatus = settings?.registrationStatus || 'Open';

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none -z-10" />

      {/* Atmospheric Radial Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Tagline Pill */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-md mb-6 shadow-neon-cyan"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase font-semibold">
          {settings?.tagline || "BUILD. BREAK. INNOVATE."}
        </span>
        <span className="text-slate-500">•</span>
        <span className="text-xs text-slate-300 font-medium">
          {settings?.supportingPhrase || "WHERE IDEAS BECOME IMPACT."}
        </span>
      </motion.div>

      {/* Main Title Heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] mb-4">
          NEXACK <span className="text-gradient">2K26</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-6">
          {settings?.description ||
            "A next-generation hackathon where students transform real-world problems into technology-driven solutions."}
        </p>

        {/* Dynamic Countdown from SiteSettings */}
        <Countdown
          targetDate={settings?.eventDate}
          durationHours={settings?.durationHours || 24}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-neon-cyan btn-glow flex items-center justify-center space-x-2 transition-transform hover:scale-105"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/tracks"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-heading font-semibold text-sm sm:text-base tracking-wider border border-white/15 hover:border-cyan-500/40 backdrop-blur-md flex items-center justify-center transition-all"
          >
            <span>EXPLORE TRACKS</span>
          </Link>
        </div>

        {/* Event Quick Info Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 pt-8 border-t border-white/10 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{eventDateStr}</span>
          </div>

          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span>{settings?.venue || "KGiSL Campus, Coimbatore"}</span>
          </div>

          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>
              {settings?.minTeamSize || 2} - {settings?.maxTeamSize || 4} Members / Team
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="uppercase font-mono font-semibold text-xs text-amber-300">
              Registrations: {regStatus}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
