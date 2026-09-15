import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Github, Instagram, Twitter } from 'lucide-react';
import { associationService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Association = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const res = await associationService.getPublic();
        if (res.data?.items) {
          setMembers(res.data.items);
        }
      } catch (err) {
        console.error('Association load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssociation();
  }, []);

  if (loading) return <Loader message="Loading Nexora Association Members..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Student Organizing Body
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          NEXORA <span className="text-gradient">ASSOCIATION</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The student executive committee and organizers behind NEXACK 2K26, Department of CSBS, KGiSL Institute of Technology.
        </p>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Association member details will appear here soon."
          message="The Nexora Association executive committee roster is currently being updated."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => (
            <div
              key={member._id || idx}
              className="cyber-card p-6 flex flex-col justify-between group border border-white/10 hover:border-cyan-500/30"
            >
              <div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 bg-white/5 border border-white/10">
                  {member.photo ? (
                    <img
                      src={getImageUrl(member.photo)}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold font-mono text-xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white text-center mb-1">
                  {member.name}
                </h3>
                <p className="text-xs text-cyan-300 text-center font-mono font-semibold uppercase mb-2">
                  {member.position}
                </p>

                {member.bio && (
                  <p className="text-xs text-slate-400 text-center line-clamp-3 mb-4">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-center space-x-3 text-slate-400">
                {member.socialLinks?.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-cyan-400">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.socialLinks?.instagram && (
                  <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-cyan-400">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Association;
