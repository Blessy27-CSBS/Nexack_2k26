import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Sparkles, ExternalLink, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { resultService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Results = () => {
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await resultService.getPublic();
        if (res.data) {
          setResultsData(res.data);
        }
      } catch (err) {
        console.error('Results load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <Loader message="Accessing Podium Results & Hall of Fame..." />;

  const isPublished = resultsData?.isPublished;
  const results = resultsData?.results || [];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          // PODIUM HONORS
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HALL OF <span className="text-gradient-amber">FAME</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Honoring the most technically accomplished, innovative, and impactful solutions of CSBS NEXACK 2K26.
        </p>
      </div>

      {!isPublished || results.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Results will be announced following jury defense."
          message="Judging and scoring evaluations are currently underway. Official winners will be declared here during the grand valedictory ceremony."
        />
      ) : (
        <div className="space-y-12">
          {/* Podium Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.slice(0, 3).map((item, idx) => {
              const isFirst = item.rank === 1;
              return (
                <motion.div
                  key={item._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 flex flex-col justify-between relative overflow-hidden border rounded-3xl ${
                    isFirst
                      ? 'border-amber-400/60 bg-gradient-to-b from-amber-500/15 via-zinc-950 to-[#07080a] shadow-2xl md:-translate-y-4 shadow-amber-500/10'
                      : 'border-white/[0.08] bg-zinc-950/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-md ${
                        isFirst ? 'bg-amber-400 text-black font-black' : 'bg-white/10 text-white'
                      }`}>
                        RANK #{item.rank}
                      </span>
                      <Trophy className={`w-6 h-6 ${isFirst ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
                    </div>

                    <h3 className="font-heading font-black text-2xl text-white mb-1 uppercase">
                      {item.awardTitle}
                    </h3>

                    <p className="font-mono text-sm text-emerald-400 font-bold mb-4">
                      {item.team?.name} ({item.team?.teamId})
                    </p>

                    {item.prizeAmount > 0 && (
                      <div className="text-3xl font-heading font-black text-amber-300 mb-4 font-mono">
                        ₹{item.prizeAmount.toLocaleString()}
                      </div>
                    )}

                    {item.submission && (
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/5 mb-4 text-xs font-sans">
                        <span className="text-zinc-400 block font-mono text-[10px] uppercase">Winning Solution:</span>
                        <span className="font-semibold text-white mt-0.5 block">{item.submission.projectTitle}</span>
                      </div>
                    )}

                    {item.citation && (
                      <p className="text-xs text-zinc-300 italic mb-4 font-sans leading-relaxed">
                        "{item.citation}"
                      </p>
                    )}
                  </div>

                  {item.submission?.liveDemoUrl && (
                    <a
                      href={item.submission.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline flex items-center space-x-1.5 pt-4 border-t border-white/5 font-mono"
                    >
                      <span>Explore Live Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Remaining Special Awards */}
          {results.length > 3 && (
            <div className="mt-12">
              <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wider mb-6 text-center">
                Special Track & Innovation Honors
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.slice(3).map((item, idx) => (
                  <div key={item._id || idx} className="p-6 border border-white/[0.08] bg-zinc-950/60 rounded-2xl">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-heading font-bold text-xl text-white mb-2">
                      {item.awardTitle}
                    </h4>
                    <p className="text-xs font-bold text-emerald-300 mb-2 font-mono">
                      {item.team?.name}
                    </p>
                    {item.citation && (
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {item.citation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
