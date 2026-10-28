import React from 'react';
import { Sparkles, Zap, Flame, Trophy, Clock, Cpu } from 'lucide-react';

const tickerItems = [
  { text: "₹1,00,000+ TOTAL PRIZE POOL", icon: Trophy, color: "text-amber-400" },
  { text: "24 HOURS NON-STOP HACKATHON", icon: Clock, color: "text-emerald-400" },
  { text: "7 INNOVATION TRACK DOMAINS", icon: Cpu, color: "text-purple-400" },
  { text: "INDUSTRY JURY & MENTORSHIP", icon: Zap, color: "text-amber-400" },
  { text: "NATIONAL ACCREDITED CERTIFICATION", icon: Sparkles, color: "text-emerald-400" },
  { text: "OFFICIAL NEXORA MARATHON", icon: Flame, color: "text-orange-400" },
];

const TextTicker = () => {
  // Duplicate for seamless infinite loop
  const list = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-white/10 bg-[#0a0c10]/90 backdrop-blur-md">
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#07080a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#07080a] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-8 items-center select-none">
        {list.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-2.5 px-3 group"
            >
              <Icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0 animate-pulse`} />
              <span className="font-mono text-xs sm:text-sm font-extrabold tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">
                {item.text}
              </span>
              <span className="text-zinc-600 font-bold ml-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TextTicker;
