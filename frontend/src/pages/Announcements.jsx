import React, { useState, useEffect } from 'react';
import { Bell, Calendar, AlertCircle, Sparkles } from 'lucide-react';
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
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Official Bulletins
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          LIVE <span className="text-gradient">ANNOUNCEMENTS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Critical updates, venue instructions, track clarifications, and competition news.
        </p>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No announcements yet."
          message="Important announcements, reminders, and deadline alerts will be published here."
        />
      ) : (
        <div className="space-y-6">
          {announcements.map((item, idx) => (
            <div
              key={item._id || idx}
              className={`cyber-card p-6 sm:p-8 border ${
                item.priority === 'urgent'
                  ? 'border-red-500/40 bg-gradient-to-r from-red-950/20 to-transparent'
                  : item.priority === 'high'
                  ? 'border-amber-500/40'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={item.priority} />
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
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
