import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Sparkles, ExternalLink, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
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

  if (loading) return <Loader message="Loading Industry Mentors & Jurors..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // INDUSTRY ADVISORY & JURY
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HACKATHON <span className="text-gradient">MENTORS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Senior software architects, cloud engineers, founders, and domain specialists on-site to mentor squads throughout the 24-hour sprint.
        </p>
      </div>

      {mentors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Mentors lineup will be unveiled shortly."
          message="Our mentor roster featuring industry technology leaders and alumni is being finalized."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, idx) => (
            <motion.div
              key={mentor._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
            >
              <div>
                {/* Photo */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5 bg-zinc-900 border border-white/10 group-hover:border-emerald-500/40 relative transition-all duration-300 shadow-md">
                  {mentor.photo ? (
                    <img
                      src={getImageUrl(mentor.photo)}
                      alt={mentor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold font-mono text-2xl bg-zinc-900">
                      {mentor.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white text-center mb-1 group-hover:text-emerald-300 transition-colors">
                  {mentor.name}
                </h3>
                <p className="text-xs text-emerald-400 text-center font-mono font-semibold uppercase mb-1">
                  {mentor.designation}
                </p>
                <p className="text-[11px] text-zinc-400 text-center mb-4 font-sans">
                  {mentor.organization}
                </p>

                {mentor.bio && (
                  <p className="text-xs text-zinc-400 text-center line-clamp-3 mb-4 font-sans leading-relaxed">
                    {mentor.bio}
                  </p>
                )}

                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-4">
                    {mentor.expertise.map((exp, eIdx) => (
                      <span 
                        key={eIdx} 
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {mentor.linkedin && (
                <div className="pt-4 border-t border-white/5 text-center mt-2">
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors font-mono"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;
