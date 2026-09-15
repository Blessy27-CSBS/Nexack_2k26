import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { timelineService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await timelineService.getPublic();
        if (res.data?.items) {
          setTimeline(res.data.items);
        }
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Timeline..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Chronological Schedule
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HACKATHON <span className="text-gradient">TIMELINE</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Mark the key checkpoints, submission deadlines, mentoring sessions, and pitch evaluations.
        </p>
      </div>

      {timeline.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Schedule will be announced soon."
          message="The organizing committee is scheduling the hackathon milestones. Check back shortly!"
        />
      ) : (
        <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {timeline.map((item, idx) => (
            <div key={item._id || idx} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#07080d] border-2 border-cyan-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-neon-cyan">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Event card */}
              <div className="cyber-card p-6 border border-white/10 hover:border-cyan-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20 w-fit">
                    PHASE {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.date}</span>
                    </span>
                    {item.time && (
                      <span className="flex items-center space-x-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>{item.time}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xl text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
