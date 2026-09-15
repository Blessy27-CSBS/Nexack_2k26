import React, { useState, useEffect } from 'react';
import { Award, Globe, ExternalLink } from 'lucide-react';
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
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Industry Alliances
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          OUR <span className="text-gradient">SPONSORS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Visionary industry leaders, technology companies, and community partners powering NEXACK 2K26.
        </p>
      </div>

      {sponsors.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Sponsors will be announced soon."
          message="Our corporate sponsors, cloud platforms, and prize partners will be revealed shortly."
        />
      ) : (
        <div className="space-y-16">
          {Object.entries(categories).map(([category, catSponsors]) => (
            <div key={category}>
              <h3 className="font-heading font-bold text-xl text-center text-cyan-400 uppercase tracking-widest mb-8">
                {category}
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-6">
                {catSponsors.map((sp, idx) => (
                  <div
                    key={sp._id || idx}
                    className="cyber-card p-6 w-64 text-center border border-white/10 hover:border-cyan-500/30 group"
                  >
                    <div className="h-20 flex items-center justify-center mb-4 bg-white/[0.02] rounded-xl p-3">
                      {sp.logo ? (
                        <img
                          src={getImageUrl(sp.logo)}
                          alt={sp.name}
                          className="max-h-14 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <span className="font-heading font-bold text-lg text-white">{sp.name}</span>
                      )}
                    </div>

                    <h4 className="font-heading font-bold text-base text-white mb-1">
                      {sp.name}
                    </h4>

                    {sp.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {sp.description}
                      </p>
                    )}

                    {sp.website && (
                      <a
                        href={sp.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:underline"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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
