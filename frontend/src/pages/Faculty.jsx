import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone } from 'lucide-react';
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

  if (loading) return <Loader message="Loading Faculty Coordinators..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
          Faculty Guidance
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          FACULTY <span className="text-gradient">COORDINATORS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Faculty leadership guiding the Nexora Association and Department of CSBS at KGiSL Institute of Technology.
        </p>
      </div>

      {faculty.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Faculty coordinators will be announced soon."
          message="Department faculty coordinator details are currently being updated."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((item, idx) => (
            <div
              key={item._id || idx}
              className="cyber-card p-6 flex flex-col justify-between group border border-white/10 hover:border-purple-500/40"
            >
              <div>
                <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-5 bg-white/5 border border-white/10">
                  {item.photo ? (
                    <img
                      src={getImageUrl(item.photo)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-400 font-bold font-mono text-2xl">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-xl text-white text-center mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-purple-300 text-center font-medium">
                  {item.designation}
                </p>
                <p className="text-xs text-slate-400 text-center mb-4">
                  {item.department}
                </p>

                {item.bio && (
                  <p className="text-xs text-slate-300 text-center line-clamp-3 mb-6">
                    {item.bio}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400">
                {item.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <a href={`mailto:${item.email}`} className="hover:text-white truncate">
                      {item.email}
                    </a>
                  </div>
                )}
                {item.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <a href={`tel:${item.phone}`} className="hover:text-white">
                      {item.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;
