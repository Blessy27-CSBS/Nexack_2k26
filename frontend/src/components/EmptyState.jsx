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
      className="cyber-card p-12 text-center max-w-xl mx-auto my-8 border border-white/10 relative overflow-hidden bg-[#0d0f15]"
    >
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-neon-emerald">
        <Icon className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-xl font-heading font-bold text-white mb-2 tracking-wide">
        {title}
      </h3>

      <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-sm border border-emerald-500/40 transition-all hover:scale-105 shadow-sm"
        >
          {actionText}
        </button>
      )}

      {/* Ambient background glow */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};

export default EmptyState;
