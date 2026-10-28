import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Github, Instagram, Terminal, Code, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { associationService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import OrganizersSection from '../components/Home/OrganizersSection';

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

  if (loading) return <Loader message="Loading Leadership Committee..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* 3 Pillars Overview Component */}
      <OrganizersSection />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 mt-12 pt-12 border-t border-white/[0.08]">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // LEADERSHIP ROSTER
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-4 mb-4">
          ORGANIZING <span className="text-gradient">COMMITTEE</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          The student executive committee and developer leads behind CSBS NEXACK 2K26.
        </p>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Leadership committee roster will appear here shortly."
          message="The Nexora Association and CODEX executive committee roster is currently being updated."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => (
            <motion.div
              key={member._id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
            >
              <div>
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5 bg-zinc-900 border border-white/10 group-hover:border-emerald-500/40 transition-colors">
                  {member.photo ? (
                    <img
                      src={getImageUrl(member.photo)}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold font-mono text-2xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-heading font-bold text-lg text-white text-center mb-1 group-hover:text-emerald-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-emerald-400 text-center font-mono font-semibold uppercase mb-3">
                  {member.position}
                </p>

                {member.bio && (
                  <p className="text-xs text-zinc-400 text-center line-clamp-3 mb-4 font-sans leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-center space-x-3 text-zinc-400">
                {member.socialLinks?.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.socialLinks?.instagram && (
                  <a href={member.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Association;
