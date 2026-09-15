import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Sparkles, ExternalLink } from 'lucide-react';
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

  if (loading) return <Loader message="Loading Official Hackathon Results..." />;

  const isPublished = resultsData?.isPublished;
  const results = resultsData?.results || [];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          Hall of Fame
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          NEXACK <span className="text-gradient">RESULTS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Celebrating the most exceptional, disruptive, and technically accomplished innovations of NEXACK 2K26.
        </p>
      </div>

      {!isPublished || results.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Results will be announced soon."
          message="Judging and final evaluations are underway. The official winners will be revealed here following the grand pitch finale."
        />
      ) : (
        <div className="space-y-12">
          {/* Podium Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.slice(0, 3).map((item, idx) => {
              const isFirst = item.rank === 1;
              return (
                <div
                  key={item._id || idx}
                  className={`cyber-card p-8 flex flex-col justify-between relative overflow-hidden border ${
                    isFirst
                      ? 'border-amber-400/50 bg-gradient-to-b from-amber-500/10 to-[#0d101e] shadow-neon-glow md:-translate-y-4'
                      : 'border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                        isFirst ? 'bg-amber-400 text-black font-black' : 'bg-white/10 text-white'
                      }`}>
                        RANK #{item.rank}
                      </span>
                      <Trophy className={`w-6 h-6 ${isFirst ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                    </div>

                    <h3 className="font-heading font-black text-2xl text-white mb-1">
                      {item.awardTitle}
                    </h3>

                    <p className="font-mono text-sm text-cyan-400 font-bold mb-4">
                      {item.team?.name} ({item.team?.teamId})
                    </p>

                    {item.prizeAmount > 0 && (
                      <div className="text-2xl font-heading font-black text-amber-300 mb-4">
                        ₹{item.prizeAmount.toLocaleString()}
                      </div>
                    )}

                    {item.submission && (
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5 mb-4 text-xs">
                        <span className="text-slate-400 block font-mono">Winning Project:</span>
                        <span className="font-semibold text-white">{item.submission.projectTitle}</span>
                      </div>
                    )}

                    {item.citation && (
                      <p className="text-xs text-slate-300 italic mb-4">
                        "{item.citation}"
                      </p>
                    )}
                  </div>

                  {item.submission?.liveDemoUrl && (
                    <a
                      href={item.submission.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 pt-4 border-t border-white/5"
                    >
                      <span>Explore Live Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Remaining Special Awards */}
          {results.length > 3 && (
            <div className="mt-12">
              <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wider mb-6 text-center">
                Special Track & Innovation Awards
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.slice(3).map((item, idx) => (
                  <div key={item._id || idx} className="cyber-card p-6 border border-white/10">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-heading font-bold text-xl text-white mb-2">
                      {item.awardTitle}
                    </h4>
                    <p className="text-xs font-semibold text-cyan-300 mb-2">
                      {item.team?.name}
                    </p>
                    {item.citation && (
                      <p className="text-xs text-slate-400 leading-relaxed">
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
