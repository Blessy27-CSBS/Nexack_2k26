import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-center text-white">
      <div className="cyber-card p-12 max-w-lg border border-white/10 relative overflow-hidden bg-[#090b10] rounded-2xl shadow-2xl">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-neon-emerald animate-pulse">
          <Compass className="w-10 h-10" />
        </div>

        <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase block mb-2">
          ERROR 404
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white mb-3 tracking-tight">
          System Address Not Found
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm mb-8 leading-relaxed font-sans">
          The route or protocol you are attempting to query does not exist or has been modified in the NEXACK 2K26 system mesh.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO COMMAND TERMINAL</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
