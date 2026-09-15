import React from 'react';
import { CheckCircle2, Award, Zap, Code, Network, Trophy, Cpu, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Register', desc: 'Sign up team leader and create account' },
  { num: '02', title: 'Build Team', desc: 'Add 2-4 members with specialized skills' },
  { num: '03', title: 'Choose Track', desc: 'Select from 7 cutting-edge domains' },
  { num: '04', title: 'Build', desc: '24 hours of non-stop coding sprint' },
  { num: '05', title: 'Submit', desc: 'Upload code, live demo & documentation' },
  { num: '06', title: 'Pitch', desc: 'Present to expert industry judges' },
  { num: '07', title: 'Win', desc: 'Prizes, awards, mentorship & acclaim' }
];

const gains = [
  { title: 'Real-World Problem Solving', icon: Zap, text: 'Tackle genuine industry and societal challenges with technology.' },
  { title: 'Expert Mentorship', icon: Users, text: 'Guidance from seasoned tech professionals and faculty.' },
  { title: 'High-Impact Networking', icon: Network, text: 'Connect with peers, alumni, and technology innovators.' },
  { title: 'Full-Stack Experience', icon: Code, text: 'Architect, implement, and deploy complete applications.' },
  { title: 'Exciting Prize Pool', icon: Trophy, text: 'Cash awards, recognition badges, and sponsored bounties.' },
  { title: 'Official Certification', icon: Award, text: 'Accredited certificates of excellence & participation.' }
];

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          The Hackathon Odyssey
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-4 mb-4">
          WHAT IS <span className="text-gradient">NEXACK 2K26?</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          NEXACK 2K26 is the premier national-level hackathon organized by the <strong>Nexora Association</strong>, 
          Department of Computer Science & Business Systems at <strong>KGiSL Institute of Technology</strong>. 
          A pressure-tested arena where inventive minds turn disruptive ideas into impactful software and systems.
        </p>
      </div>

      {/* 7-Step Hackathon Roadmap */}
      <div className="mb-20">
        <h3 className="text-center font-heading font-bold text-xl sm:text-2xl text-white uppercase tracking-wider mb-8">
          The 7-Step Innovation Pipeline
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="cyber-card p-4 text-center flex flex-col justify-between relative group hover:border-cyan-500/40"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                {step.num}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight font-sans">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What Participants Gain */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gains.map((gain, idx) => {
          const Icon = gain.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="cyber-card p-6 flex items-start space-x-4 hover:border-purple-500/30 transition-all"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-white mb-1">
                  {gain.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {gain.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AboutSection;
