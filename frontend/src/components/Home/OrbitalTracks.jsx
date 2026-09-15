import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Sparkles, Compass } from 'lucide-react';
import EmptyState from '../EmptyState';

const OrbitalTracks = ({ tracks = [] }) => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!tracks || tracks.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Hackathon Tracks Announcement"
        message="Hackathon tracks will be announced soon. Stay tuned for problem domain disclosures!"
        actionText="Check Timeline"
        onAction={() => (window.location.href = '/timeline')}
      />
    );
  }

  // Use all tracks from DB
  const trackCount = tracks.length;
  // Dynamic radius calculated based on count (min 150, max 260)
  const radius = Math.min(260, Math.max(160, 130 + trackCount * 14));

  return (
    <div className="relative py-12 flex flex-col items-center justify-center overflow-hidden">
      {/* Mobile view / Fallback: Grid layout */}
      <div className="block lg:hidden w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <motion.div
              key={track._id}
              whileHover={{ y: -4 }}
              className="cyber-card p-5 border border-cyan-500/20 bg-slate-900/60 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  TRACK #{track.trackNumber}
                </span>
                <h3 className="font-heading font-bold text-lg text-white mt-2 mb-1">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {track.shortDescription}
                </p>
              </div>
              <Link
                to={`/tracks/${track._id}`}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 mt-4 pt-3 border-t border-white/5"
              >
                <span>View Track Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop View: Orbital Interactive Visual System */}
      <div
        className="hidden lg:flex relative items-center justify-center select-none"
        style={{ width: `${radius * 2 + 280}px`, height: `${radius * 2 + 280}px` }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Orbital Track Orbit Rings */}
        <div
          className="absolute rounded-full border border-dashed border-cyan-500/25 pointer-events-none"
          style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
        />
        <div
          className="absolute rounded-full border border-slate-800/80 pointer-events-none"
          style={{ width: `${radius * 2 + 70}px`, height: `${radius * 2 + 70}px` }}
        />

        {/* Center Hub - Kept Stationary (Not Rotated) */}
        <div
          className="absolute z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-950/80 via-[#0a1020] to-purple-950/80 border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center text-center p-4 cursor-default backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-1 text-cyan-300">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-heading font-black text-white text-base tracking-wider uppercase select-none">
            NEXACK
          </span>
          <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase select-none">
            TRACKS ({trackCount})
          </span>
        </div>

        {/* Dynamic Orbiting Track Nodes */}
        <motion.div
          animate={{ rotate: isPaused ? 0 : 360 }}
          transition={{ duration: isPaused ? 0 : 45, ease: 'linear', repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {tracks.map((track, index) => {
            const angle = (index / trackCount) * (2 * Math.PI);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isSelected = selectedTrack?._id === track._id;

            return (
              <div
                key={track._id}
                className="absolute flex items-center justify-center"
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                {/* Counter-rotation to keep card orientation upright */}
                <motion.div
                  animate={{ rotate: isPaused ? 0 : -360 }}
                  transition={{ duration: isPaused ? 0 : 45, ease: 'linear', repeat: Infinity }}
                >
                  <motion.div
                    whileHover={{ scale: 1.12, zIndex: 30 }}
                    onClick={() => setSelectedTrack(track)}
                    className={`w-48 p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xl backdrop-blur-md ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-500/30 scale-105'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-cyan-400/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        #{track.trackNumber}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Track</span>
                    </div>

                    <h4 className="font-heading font-bold text-xs text-white line-clamp-1">
                      {track.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {track.shortDescription}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Selected Track Inspection Modal / Popover on Click */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-xl w-full p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 backdrop-blur-lg flex flex-col sm:flex-row items-start justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Track #{selectedTrack.trackNumber}
              </span>
              <h3 className="font-heading font-bold text-base text-white">
                {selectedTrack.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedTrack.description || selectedTrack.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <Link
              to={`/tracks/${selectedTrack._id}`}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase transition shadow-md"
            >
              Open Track Details
            </Link>
            <button
              onClick={() => setSelectedTrack(null)}
              className="px-2.5 py-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrbitalTracks;
