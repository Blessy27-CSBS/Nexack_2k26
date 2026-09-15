import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  Play,
  Pause
} from 'lucide-react';
import ParallaxTrackCard from './ParallaxTrackCard';
import EmptyState from '../EmptyState';

// Distinct rich gradient accents inspired by Artmaster course card aesthetics
const TRACK_THEMES = [
  {
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-500/30 group-hover:border-amber-400',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glow: 'shadow-amber-500/25',
    accentColor: '#f59e0b'
  },
  {
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    border: 'border-cyan-500/30 group-hover:border-cyan-400',
    tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    glow: 'shadow-cyan-500/25',
    accentColor: '#06b6d4'
  },
  {
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    border: 'border-purple-500/30 group-hover:border-purple-400',
    tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    glow: 'shadow-purple-500/25',
    accentColor: '#a855f7'
  },
  {
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/30 group-hover:border-emerald-400',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glow: 'shadow-emerald-500/25',
    accentColor: '#10b981'
  },
  {
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    border: 'border-rose-500/30 group-hover:border-rose-400',
    tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    glow: 'shadow-rose-500/25',
    accentColor: '#f43f5e'
  },
  {
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    border: 'border-blue-500/30 group-hover:border-blue-400',
    tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    glow: 'shadow-blue-500/25',
    accentColor: '#3b82f6'
  }
];

const ArtmasterTrackCards = ({ tracks = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollRef = useRef(null);

  const hasTracks = Boolean(tracks && tracks.length > 0);

  // Smooth continuous horizontal drift animation - called unconditionally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isAutoScrolling || !hasTracks) return;

    let animId;
    const speed = 0.8; // px per frame

    const step = () => {
      if (el) {
        // If reached end, loop seamlessly back to start
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isAutoScrolling, hasTracks, tracks?.length]);

  if (!hasTracks) {
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


  const handlePrev = () => {
    const newIdx = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentIndex(newIdx);
    scrollToCard(newIdx);
  };

  const handleNext = () => {
    const newIdx = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIdx);
    scrollToCard(newIdx);
  };

  const scrollToCard = (idx) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth > 640 ? 390 : 320;
      scrollRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Duplicate items if tracks <= 4 to allow infinite smooth horizontal motion
  const displayTracks = tracks.length > 0 && tracks.length < 5 ? [...tracks, ...tracks] : tracks;

  return (
    <div
      className="relative py-6 space-y-8"
      onMouseEnter={() => setIsAutoScrolling(false)}
      onMouseLeave={() => setIsAutoScrolling(true)}
    >
      {/* Carousel Navigation Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>Interactive 3D Parallax Course-Style Cards</span>
          </span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            ({tracks.length} Domains • Smooth horizontal flow • Hover to pause & 3D tilt)
          </span>
        </div>

        {/* Carousel Arrow Controls & Auto-scroll indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className="px-2.5 py-1.5 rounded-full bg-slate-900/90 text-[11px] font-mono font-semibold text-slate-400 hover:text-cyan-300 border border-slate-800 flex items-center gap-1.5 transition shadow-md"
            title={isAutoScrolling ? 'Pause horizontal motion' : 'Resume horizontal motion'}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="hidden md:inline">Flowing</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 transition-all shadow-lg active:scale-95"
            aria-label="Previous track"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-full bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 transition-all shadow-lg active:scale-95"
            aria-label="Next track"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Motion Track Container */}
      <div className="relative group">
        {/* Soft edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#070913] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#070913] to-transparent z-20 pointer-events-none" />

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none pb-8 pt-2 px-6 flex gap-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: isAutoScrolling ? 'auto' : 'smooth' }}
        >
          {displayTracks.map((track, idx) => {
            const theme = TRACK_THEMES[idx % TRACK_THEMES.length];
            const isFocused = hoveredTrack === track._id || currentIndex === idx % tracks.length;

            return (
              <ParallaxTrackCard
                key={`${track._id || idx}-${idx}`}
                track={track}
                index={idx}
                theme={theme}
                isFocused={isFocused}
                onFocus={() => {
                  setHoveredTrack(track._id);
                  setCurrentIndex(idx % tracks.length);
                }}
                onBlur={() => setHoveredTrack(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Progress Dots Indicator */}
      {tracks.length > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          {tracks.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                setCurrentIndex(dotIdx);
                scrollToCard(dotIdx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === dotIdx
                  ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtmasterTrackCards;
