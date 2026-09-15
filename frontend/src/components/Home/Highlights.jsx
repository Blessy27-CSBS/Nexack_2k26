import React from 'react';
import { Layers, Users, Shield, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Highlights = ({ stats, trackCount = 0, prizePoolTotal = 0, settings }) => {
  const items = [
    {
      label: 'Technology Tracks',
      value: trackCount > 0 ? `${trackCount}` : '7',
      subtext: 'Core Innovation Domains',
      icon: Layers,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Registered Teams',
      value: stats?.totalTeams !== undefined ? `${stats.totalTeams}` : '0',
      subtext: 'Active Innovation Squads',
      icon: Shield,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'Hackathon Participants',
      value: stats?.totalParticipants !== undefined ? `${stats.totalParticipants}` : '0',
      subtext: 'Builders & Problem Solvers',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Hackathon Duration',
      value: `${settings?.durationHours || 24}H`,
      subtext: 'Continuous Sprint',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="cyber-card p-5 sm:p-6 flex flex-col items-start justify-between relative overflow-hidden group"
            >
              <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div>
                <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                  {item.value}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                  {item.label}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {item.subtext}
                </p>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors rounded-bl-full pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Highlights;
