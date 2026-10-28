import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Gift, Sparkles, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultPrizes = [
  {
    rank: '01',
    place: '1ST PLACE',
    category: 'CHAMPION',
    title: 'Grand Hackathon Winner',
    amount: '₹ 25,000',
    description: 'Premier cash prize, championship trophy, certificates of excellence, and direct incubation fast-track.',
    perks: ['Cash Prize ₹25,000', 'Winner Trophy & Medals', 'Direct Fast-Track Interview', 'Incubation Support'],
    accent: 'emerald',
    badge: 'GOLD_PODIUM'
  },
  {
    rank: '02',
    place: '2ND PLACE',
    category: 'FIRST_RUNNER_UP',
    title: 'First Runner Up',
    amount: '₹ 15,000',
    description: 'Substantial cash bounty, silver runner-up trophy, merit awards, and sponsored developer credits.',
    perks: ['Cash Prize ₹15,000', 'Silver Trophy & Medals', 'Industry Mentorship Sessions', 'Sponsored Cloud Credits'],
    accent: 'cyan',
    badge: 'SILVER_PODIUM'
  },
  {
    rank: '03',
    place: '3RD PLACE',
    category: 'SECOND_RUNNER_UP',
    title: 'Second Runner Up',
    amount: '₹ 10,000',
    description: 'Cash award, bronze trophy, excellence certificates, and premium developer toolkits.',
    perks: ['Cash Prize ₹10,000', 'Bronze Trophy & Medals', 'Developer Subscriptions', 'Certificate of Merit'],
    accent: 'amber',
    badge: 'BRONZE_PODIUM'
  }
];

const trackBounties = [
  { title: 'Best AI / Machine Learning Innovation', bounty: '₹ 5,000', icon: Sparkles },
  { title: 'Best Web3 & Cryptographic Architecture', bounty: '₹ 5,000', icon: ShieldCheck },
  { title: 'Best UI/UX & Design Craftsmanship', bounty: '₹ 5,000', icon: Flame },
  { title: 'Most Innovative Business Model', bounty: '₹ 5,000', icon: Trophy }
];

const PrizeSection = ({ prizes = [] }) => {
  // If backend prizes are provided, map them or use rich default mock
  const displayPrizes = prizes && prizes.length >= 3 ? prizes.slice(0, 3).map((p, idx) => ({
    rank: String(idx + 1).padStart(2, '0'),
    place: p.category || (idx === 0 ? '1ST PLACE' : idx === 1 ? '2ND PLACE' : '3RD PLACE'),
    category: p.category || 'PODIUM',
    title: p.title,
    amount: p.amount ? `₹ ${Number(p.amount).toLocaleString()}` : (idx === 0 ? '₹ 25,000' : idx === 1 ? '₹ 15,000' : '₹ 10,000'),
    description: p.description,
    perks: p.benefits && p.benefits.length > 0 ? p.benefits : ['Podium Trophy', 'Merit Certificate', 'Mentorship Fast-Track'],
    accent: idx === 0 ? 'emerald' : idx === 1 ? 'cyan' : 'amber',
    badge: idx === 0 ? 'GOLD_PODIUM' : idx === 1 ? 'SILVER_PODIUM' : 'BRONZE_PODIUM'
  })) : defaultPrizes;

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            // 04 REWARDS
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            THE PRIZE POOL
          </span>
        </div>
        <Link
          to="/prizes"
          className="text-xs font-mono uppercase tracking-widest text-amber-400 hover:text-amber-300 flex items-center space-x-1.5 group"
        >
          <span>VIEW FULL PRIZE BREAKDOWN</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Heading with Oversized Cumulative Prize Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-8">
          <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block mb-3">
            CUMULATIVE RECOGNITION
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-[0.95]">
            THE PRIZE <span className="text-gradient-amber">POOL</span>
          </h2>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-1">
            TOTAL CASH & BOUNTIES
          </div>
          <div className="font-heading font-black text-4xl sm:text-6xl text-amber-300 tracking-tight text-glow-amber">
            ₹ 70,000+
          </div>
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {displayPrizes.map((prize, idx) => {
          const isFirst = idx === 0;
          return (
            <motion.div
              key={prize.rank}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                isFirst
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-2xl shadow-amber-500/10 md:-translate-y-2'
                  : 'bg-zinc-950/60 border-white/[0.08] hover:border-white/20'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className={`font-mono text-xs font-bold px-3 py-1 rounded-md border uppercase tracking-wider ${
                    isFirst
                      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                      : 'text-zinc-400 bg-white/5 border-white/10'
                  }`}>
                    {prize.place}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    [ {prize.badge} ]
                  </span>
                </div>

                {/* Amount */}
                <div className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                  {prize.amount}
                </div>

                <h3 className="font-heading font-bold text-xl text-zinc-200 mb-3">
                  {prize.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-6">
                  {prize.description}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-2.5 border-t border-white/[0.08] pt-5">
                  {prize.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-center space-x-2.5 text-xs text-zinc-300 font-sans">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Rank Indicator */}
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-3xl font-black text-zinc-700 group-hover:text-zinc-500 transition-colors">
                  {prize.rank}
                </span>
                <Trophy className="w-5 h-5 text-amber-400/60 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Special Category Track Bounties */}
      <div className="border border-white/[0.08] rounded-2xl p-6 sm:p-8 bg-zinc-950/40">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
            SPECIAL TRACK BOUNTIES
          </span>
          <span className="font-mono text-xs text-zinc-500">
            ADDITIONAL CATEGORY CASH PRIZES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trackBounties.map((bounty, idx) => {
            const Icon = bounty.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {bounty.bounty}
                  </span>
                </div>
                <div className="text-xs font-medium text-zinc-200">
                  {bounty.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrizeSection;
