import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown = ({ targetDate, durationHours = 24 }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = targetDate ? new Date(targetDate).getTime() : new Date('2026-03-27T09:00:00').getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-14 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl bg-zinc-900/90 border border-white/10 group-hover:border-emerald-500/50 backdrop-blur-xl flex items-center justify-center shadow-xl transition-all duration-300">
                  <span className="font-mono font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-wider">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                </div>
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                {unit.label}
              </span>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-xl sm:text-3xl font-mono text-emerald-500/60 -mt-6 font-bold">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
