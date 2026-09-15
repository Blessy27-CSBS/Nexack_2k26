import React from 'react';

const Loader = ({ message = "Initializing NEXACK 2K26..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080d] text-white">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
        {/* Spinning gradient ring */}
        <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-cyan-400 border-r-purple-500 animate-spin" />
        {/* Center hexagon/logo */}
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold tracking-widest text-cyan-400">
          NX26
        </div>
      </div>

      <p className="font-mono text-sm tracking-widest text-slate-400 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
