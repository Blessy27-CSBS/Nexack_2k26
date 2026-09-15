import React, { useState, useEffect } from 'react';
import { Trophy, Award, Gift, Check, Sparkles } from 'lucide-react';
import { prizeService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Prizes = () => {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await prizeService.getPublic();
        if (res.data?.items) {
          setPrizes(res.data.items);
        }
      } catch (err) {
        console.error('Failed to load prizes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrizes();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Prizes & Rewards..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          Rewards & Recognition
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          PRIZES & <span className="text-gradient">AWARDS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Substantial cash prizes, trophies, certificates, exclusive mentorship slots, and sponsored tech bounties.
        </p>
      </div>

      {prizes.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Prize details will be announced soon."
          message="The prize pool and track awards are being finalized with our partners and sponsors."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizes.map((prize, idx) => (
            <div
              key={prize._id || idx}
              className="cyber-card p-6 flex flex-col justify-between group relative overflow-hidden border border-white/10 hover:border-amber-500/40"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>

                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  {prize.category}
                </span>

                <h3 className="font-heading font-bold text-2xl text-white mb-2">
                  {prize.title}
                </h3>

                {prize.amount > 0 && (
                  <div className="text-3xl font-heading font-black text-amber-300 mb-4">
                    ₹{prize.amount.toLocaleString()}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {prize.description}
                </p>

                {prize.benefits && prize.benefits.length > 0 && (
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <p className="text-[11px] font-mono text-slate-400 uppercase">Perks & Benefits:</p>
                    {prize.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prizes;
