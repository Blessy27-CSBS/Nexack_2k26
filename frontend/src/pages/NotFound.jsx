import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-center text-white">
      <div className="cyber-card p-12 max-w-lg border border-white/10 relative overflow-hidden">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-neon-cyan animate-pulse">
          <Compass className="w-10 h-10" />
        </div>

        <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase block mb-2">
          ERROR 404
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-white mb-3">
          Looks like you took a wrong turn.
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed">
          The page or sub-portal you are attempting to access does not exist or has been shifted in the NEXACK matrix.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO NEXACK</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
