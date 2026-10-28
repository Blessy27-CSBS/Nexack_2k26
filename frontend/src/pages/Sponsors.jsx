import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { sponsorService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await sponsorService.getPublic();
        if (res.data?.items) {
          setSponsors(res.data.items);
        }
      } catch (err) {
        console.error('Sponsors load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  if (loading) return <Loader message="Loading Sponsors & Partners..." />;

  // Group by category
  const categories = sponsors.reduce((acc, sp) => {
    const cat = sp.category || 'Partner';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sp);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // INDUSTRY ALLIANCES
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          PARTNERS & <span className="text-gradient">SPONSORS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Industry tech leaders, enterprise cloud platforms, and developer ecosystems empowering CSBS NEXACK 2K26.
        </p>
      </div>

      {sponsors.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Sponsors and partner announcements coming soon."
          message="Our corporate sponsors, cloud platforms, and bounty track partners will be unveiled shortly."
        />
      ) : (
        <div className="space-y-16">
          {/* Infinite Marquee */}
          {sponsors.length > 2 && (
            <div className="relative overflow-hidden py-4 border-y border-white/[0.08] bg-zinc-950/40 rounded-2xl">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07080a] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07080a] to-transparent z-10 pointer-events-none" />
              
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused] space-x-12 items-center px-6">
                {[...sponsors, ...sponsors].map((sp, idx) => (
                  <div 
                    key={`marquee-${idx}`} 
                    className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-zinc-900/60 border border-white/5 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {sp.logo ? (
                      <img 
                        src={getImageUrl(sp.logo)} 
                        alt={sp.name} 
                        className="h-8 max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <span className="font-mono text-sm font-bold text-zinc-300">{sp.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Sponsors Grid */}
          {Object.entries(categories).map(([category, catSponsors]) => (
            <div key={category}>
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="h-[1px] w-12 bg-emerald-500/40" />
                <h3 className="font-heading font-bold text-lg sm:text-xl text-center text-emerald-400 uppercase tracking-widest">
                  {category}
                </h3>
                <div className="h-[1px] w-12 bg-emerald-500/40" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                {catSponsors.map((sp, idx) => (
                  <motion.div
                    key={sp._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-7 rounded-3xl w-64 text-center border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 group relative overflow-hidden transition-all duration-300"
                  >
                    <div className="h-20 flex items-center justify-center mb-4 bg-zinc-900/80 rounded-2xl p-3 border border-white/5 group-hover:border-emerald-500/20 transition-all">
                      {sp.logo ? (
                        <img
                          src={getImageUrl(sp.logo)}
                          alt={sp.name}
                          className="max-h-14 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <span className="font-heading font-bold text-lg text-white">{sp.name}</span>
                      )}
                    </div>

                    <h4 className="font-heading font-bold text-base text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {sp.name}
                    </h4>

                    {sp.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3 font-sans">
                        {sp.description}
                      </p>
                    )}

                    {sp.website && (
                      <a
                        href={sp.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sponsors;
