import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = "Coming Soon",
  message = "Information will appear here once announced.",
  actionText,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-12 text-center max-w-xl mx-auto my-8 border border-white/5 relative overflow-hidden"
    >
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-5 shadow-neon-cyan">
        <Icon className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-xl font-heading font-bold text-white mb-2 tracking-wide">
        {title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-medium text-sm border border-cyan-500/40 transition-all hover:scale-105"
        >
          {actionText}
        </button>
      )}

      {/* Ambient background glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default EmptyState;
