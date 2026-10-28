import React, { useState, useEffect } from 'react';
import { Bell, Calendar, AlertCircle, Sparkles, Terminal } from 'lucide-react';
import { announcementService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementService.getPublic();
        if (res.data?.items) {
          setAnnouncements(res.data.items);
        }
      } catch (err) {
        console.error('Announcements load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Bulletins..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // OFFICIAL DISPATCHES
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          LIVE <span className="text-gradient">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Critical updates, milestone checkpoints, room allocations, and competition telemetry for CSBS NEXACK 2K26.
        </p>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No dispatches published yet."
          message="Important announcements, reminders, and deadline alerts will appear here in real-time."
        />
      ) : (
        <div className="space-y-6">
          {announcements.map((item, idx) => (
            <div
              key={item._id || idx}
              className={`p-7 sm:p-8 rounded-3xl border ${
                item.priority === 'urgent'
                  ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/30 to-zinc-900/60'
                  : item.priority === 'high'
                  ? 'border-amber-500/40 bg-zinc-900/70'
                  : 'border-white/[0.08] bg-zinc-950/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={item.priority} />
                  <span className="text-xs font-mono text-zinc-400">
                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2 uppercase">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
