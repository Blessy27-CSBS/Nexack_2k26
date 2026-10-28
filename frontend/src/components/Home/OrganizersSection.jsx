import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Cpu, ShieldCheck, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const organizers = [
  {
    name: 'Nexora Association',
    role: 'Student Association',
    dept: 'Department of CSBS',
    desc: 'The official student body driving technical excellence, hackathons, open-source symposiums, and leadership cultivation across CSBS.',
    icon: Terminal,
    accent: 'emerald',
    badge: 'STUDENT_BODY'
  },
  {
    name: 'CODEX Coding Club',
    role: 'Competitive Programming & Tech Club',
    dept: 'Technical Guild',
    desc: 'Dedicated developer society focused on advanced algorithm design, distributed computing, full-stack craftsmanship, and hackathon victories.',
    icon: Code,
    accent: 'cyan',
    badge: 'CODING_CLUB'
  },
  {
    name: 'Department of CSBS',
    role: 'Academic & Industry Pillar',
    dept: 'Computer Science & Business Systems',
    desc: 'An industry-curated curriculum combining deep computational theory with real-world enterprise business systems and modern product engineering.',
    icon: Cpu,
    accent: 'amber',
    badge: 'ACADEMIC_PILLAR'
  }
];

const OrganizersSection = () => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none -translate-y-1/2" />

      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            // 08 LEADERSHIP
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            ORGANIZING BODIES & COALITION
          </span>
        </div>
        <Link
          to="/association"
          className="text-xs font-mono uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 group"
        >
          <span>LEARN ABOUT THE ORGANIZERS</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Heading */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          ORGANIZED <span className="text-gradient">BY</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          A powerful collaboration uniting student builders, developer guilds, and academic mentorship.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {organizers.map((org, idx) => {
          const Icon = org.icon;

          return (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:text-black transition-colors" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded border border-white/[0.06]">
                    {org.badge}
                  </span>
                </div>

                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block mb-1 font-semibold">
                  {org.dept}
                </span>

                <h3 className="font-heading font-bold text-2xl text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {org.name}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans mb-6">
                  {org.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{org.role}</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default OrganizersSection;
