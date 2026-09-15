import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Sparkles } from 'lucide-react';
import { getImageUrl } from '../../services/api';

/**
 * 3D Parallax Tilt Card Component
 * Inspired by Marcus Engstrup Dresler's Parallax Effect on Dribbble (shot/14544247-Parallax-Effect)
 * Features dynamic mouse tracking, multi-layer depth translation (Z-axis), smooth spring physics,
 * and holographic light reflection glares.
 */
const ParallaxTrackCard = ({ track, index, theme, isFocused, onFocus, onBlur }) => {
  const cardRef = useRef(null);

  // Mouse coordinate motion values (-0.5 to 0.5 normalized)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for ultra-smooth momentum and dampening
  const mouseX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.8 });
  const mouseY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.8 });

  // 3D Rotations (tilt range: -14deg to +14deg)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);

  // Multi-layer parallax depth translation (foreground items pop out toward the viewer)
  const layerZDepth = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const badgeTranslateZ = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);

  // Dynamic light reflection/glare effect tracking mouse position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center [-0.5, 0.5]
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    // Reset smoothly back to 0 on leave
    x.set(0);
    y.set(0);
    if (onBlur) onBlur();
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="snap-start flex-shrink-0 py-4"
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={onFocus}
        onMouseLeave={handleMouseLeave}
        className={`relative w-[310px] sm:w-[360px] md:w-[390px] min-h-[460px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden border transition-shadow duration-300 group cursor-pointer ${
          theme.border
        } ${isFocused ? `shadow-2xl ${theme.glow}` : 'shadow-xl'} bg-[#0b0f1a]`}
      >
        {/* Dynamic Gradient Background Layer */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        />

        {/* Dynamic Interactive Light Glare (Parallax lighting sheen) */}
        <motion.div
          style={{
            background: `radial-gradient(circle 240px at ${glareX} ${glareY}, rgba(255,255,255,0.12), transparent 70%)`
          }}
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        />

        {/* Ambient Glowing Color Orb */}
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: theme.accentColor }}
        />

        {/* Card Content with 3D Depth (Layer 1 - Floating foreground) */}
        <div
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
          className="relative z-10 space-y-4"
        >
          {/* Top Tag Header */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-mono font-bold tracking-wider uppercase px-3.5 py-1 rounded-full border shadow-sm ${theme.tagBg}`}
            >
              Track #{track.trackNumber}
            </span>

            <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">
              Domain {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Banner Graphic or 3D Depth Icon Box */}
          {track.bannerImage ? (
            <div
              style={{ transform: 'translateZ(20px)' }}
              className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950/80 border border-white/5 relative group-hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={getImageUrl(track.bannerImage)}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-transparent opacity-60" />
            </div>
          ) : (
            <div
              style={{ transform: 'translateZ(25px)' }}
              className="w-full h-36 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 flex items-center justify-center p-4 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/10">
                <Cpu className="w-7 h-7" />
              </div>
            </div>
          )}

          {/* Track Title & Description with distinct elevation */}
          <div style={{ transform: 'translateZ(25px)' }}>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-cyan-200 transition-colors tracking-tight line-clamp-1">
              {track.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mt-2 leading-relaxed font-normal">
              {track.shortDescription}
            </p>
          </div>

          {/* Focus Areas Pills */}
          {track.problemAreas && track.problemAreas.length > 0 && (
            <div style={{ transform: 'translateZ(20px)' }} className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Problem Statements:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {track.problemAreas.slice(0, 3).map((area, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-200 group-hover:border-white/25 transition"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer with Pop-out 3D Depth */}
        <div
          style={{ transform: 'translateZ(35px)' }}
          className="relative z-10 pt-5 mt-5 border-t border-white/10 flex items-center justify-between"
        >
          <Link
            to={`/tracks/${track._id}`}
            className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-cyan-300 group-hover:text-white transition-colors"
          >
            <span>Explore Track</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <Link
            to={`/register?track=${track._id}`}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500 hover:text-black text-slate-300 border border-white/10 transition-all duration-200 shadow-md"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ParallaxTrackCard;
