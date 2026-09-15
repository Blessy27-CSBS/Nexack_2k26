import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Countdown = ({ targetDate, durationHours = 24 }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'UPCOMING' // 'UPCOMING' | 'LIVE' | 'CONCLUDED'
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const start = new Date(targetDate).getTime();
      const end = start + (durationHours * 60 * 60 * 1000);
      const now = new Date().getTime();

      if (now < start) {
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, status: 'UPCOMING' });
      } else if (now >= start && now <= end) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'LIVE' });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'CONCLUDED' });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, durationHours]);

  if (timeLeft.status === 'LIVE') {
    return (
      <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 font-heading font-extrabold tracking-widest text-lg animate-pulse shadow-neon-cyan">
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
        <span>HACKATHON IS LIVE</span>
      </div>
    );
  }

  if (timeLeft.status === 'CONCLUDED') {
    return (
      <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-heading font-extrabold tracking-widest text-base">
        <span>HACKATHON CONCLUDED</span>
      </div>
    );
  }

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
      {timeBlocks.map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0d101e]/80 border border-white/10 backdrop-blur-md shadow-glass"
        >
          <span className="font-heading font-black text-2xl sm:text-3xl text-gradient">
            {String(block.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
