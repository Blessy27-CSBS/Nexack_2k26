import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { facultyService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await facultyService.getPublic();
        if (res.data?.items) {
          setFaculty(res.data.items);
        }
      } catch (err) {
        console.error('Faculty load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  if (loading) return <Loader message="Loading Faculty Advisors & Leadership..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // ACADEMIC LEADERSHIP
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          FACULTY <span className="text-gradient">ADVISORS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Distinguished faculty members from the Department of Computer Science and Business Systems guiding the hackathon.
        </p>
      </div>

      {faculty.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Faculty advisors roster will appear here shortly."
          message="Department faculty coordinator details are currently being updated."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
            >
              <div>
                <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-5 bg-zinc-900 border border-white/10 group-hover:border-emerald-500/40 transition-colors shadow-md">
                  {item.photo ? (
                    <img
                      src={getImageUrl(item.photo)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold font-mono text-3xl bg-zinc-900">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-xl text-white text-center mb-1 group-hover:text-emerald-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-emerald-400 text-center font-mono uppercase mb-1 font-semibold">
                  {item.designation}
                </p>
                <p className="text-xs text-zinc-400 text-center mb-4 font-sans">
                  {item.department}
                </p>

                {item.bio && (
                  <p className="text-xs text-zinc-300 text-center line-clamp-3 mb-6 font-sans leading-relaxed">
                    {item.bio}
                  </p>
                )}
              </div>

              <div className="pt-5 border-t border-white/[0.06] space-y-2 text-xs text-zinc-400">
                {item.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <a href={`mailto:${item.email}`} className="hover:text-emerald-300 truncate transition-colors font-mono text-xs">
                      {item.email}
                    </a>
                  </div>
                )}
                {item.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <a href={`tel:${item.phone}`} className="hover:text-cyan-300 transition-colors font-mono text-xs">
                      {item.phone}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;
