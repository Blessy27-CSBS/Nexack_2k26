import React from 'react';

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-[#050608] select-none ${fullScreen ? 'fixed inset-0 z-50' : 'min-h-[40vh] w-full py-12'}`}>
      {/* Central Holographic Spinner with NX26 in the Center */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div 
          className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" 
          style={{ animationDuration: '2.5s' }} 
        />
        {/* Concentric spinning rings */}
        <div 
          className="w-24 h-24 rounded-full border-2 border-transparent border-t-emerald-400 border-r-amber-400 animate-spin" 
          style={{ animationDuration: '1.2s' }} 
        />
        <div 
          className="absolute inset-2 rounded-full border border-transparent border-b-purple-400 border-l-emerald-500 animate-spin" 
          style={{ animationDuration: '2s', animationDirection: 'reverse' }} 
        />
        
        {/* Center NX26 Text */}
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black tracking-widest text-emerald-300">
          NX26
        </div>
      </div>
    </div>
  );
};

export default Loader;
