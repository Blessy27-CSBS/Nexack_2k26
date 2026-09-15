import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Sparkles } from 'lucide-react';
import { mentorService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await mentorService.getPublic();
        if (res.data?.items) {
          setMentors(res.data.items);
        }
      } catch (err) {
        console.error('Mentors load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Mentors..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Industry Advisory
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HACKATHON <span className="text-gradient">MENTORS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Seasoned software architects, tech founders, and domain experts mentoring participants through the 24-hour sprint.
        </p>
      </div>

      {mentors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Mentors will be announced soon."
          message="Our mentor lineup featuring industry leaders and alumni will be unveiled shortly."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, idx) => (
            <div
              key={mentor._id || idx}
              className="cyber-card p-6 flex flex-col justify-between group border border-white/10 hover:border-cyan-500/30"
            >
              <div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 bg-white/5 border border-white/10">
                  {mentor.photo ? (
                    <img
                      src={getImageUrl(mentor.photo)}
                      alt={mentor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold font-mono text-xl">
                      {mentor.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white text-center mb-1">
                  {mentor.name}
                </h3>
                <p className="text-xs text-cyan-300 text-center font-medium">
                  {mentor.designation}
                </p>
                <p className="text-[11px] text-slate-400 text-center mb-3">
                  {mentor.organization}
                </p>

                {mentor.bio && (
                  <p className="text-xs text-slate-400 text-center line-clamp-3 mb-4">
                    {mentor.bio}
                  </p>
                )}

                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {mentor.expertise.map((exp, eIdx) => (
                      <span key={eIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {mentor.linkedin && (
                <div className="pt-4 border-t border-white/5 text-center">
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;
