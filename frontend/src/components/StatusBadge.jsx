import React from 'react';

const statusConfig = {
  // Team & Payment Statuses
  Verified: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  Approved: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  'Proof Uploaded': { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  Pending: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  Rejected: { bg: 'bg-red-500/10 text-red-400 border-red-500/30' },

  // Submission Statuses
  'Not Submitted': { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
  Draft: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
  Submitted: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  'Under Review': { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  Shortlisted: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  Finalist: { bg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' },
  Winner: { bg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },

  // Dynamic Content Statuses
  Published: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  Unpublished: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },

  // Priorities
  low: { bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' },
  medium: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  high: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  urgent: { bg: 'bg-red-500/10 text-red-400 border-red-500/30' }
};

const StatusBadge = ({ status, className = '' }) => {
  const current = statusConfig[status] || { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${current.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
