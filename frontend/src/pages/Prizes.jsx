import React, { useState, useEffect } from 'react';
import { Trophy, Award, Gift, Check, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { prizeService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import PrizeSection from '../components/Home/PrizeSection';

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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Editorial Prize Section */}
      <PrizeSection prizes={prizes} />

      {/* Additional Awards Info */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              Official Certificates
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              All validated participating teams receive digitally verifiable, accredited Certificates of Excellence and Participation from the Department of CSBS.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              Incubation Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Top-ranked products will be invited for incubation backing, industry cloud compute grants, and mentorship to scale projects into commercial startups.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              Placement Fast-Track
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Distinguished coders and architectural finalists receive direct interview referrals with sponsoring partner companies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prizes;
