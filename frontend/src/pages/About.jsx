import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Zap, Code, Users, Award, Trophy, ArrowRight } from 'lucide-react';
import AboutSection from '../components/Home/AboutSection';

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          About The Organization
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          ABOUT <span className="text-gradient">NEXACK 2K26</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The landmark hackathon uniting technical acumen with real-world business systems innovation.
        </p>
      </div>

      {/* Organizer Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="cyber-card p-8 border border-cyan-500/20">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-white mb-2">
            Nexora Association
          </h3>
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
            Department Student Body
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Nexora is the premier student association of the Department of Computer Science & Business Systems at KGiSL Institute of Technology. 
            Committed to cultivating leadership, technical craftsmanship, and entrepreneurial mindsets through competitive hackathons, workshops, and student-led symposiums.
          </p>
        </div>

        <div className="cyber-card p-8 border border-purple-500/20">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-white mb-2">
            KGiSL Institute of Technology
          </h3>
          <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4">
            Center of Academic Excellence
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            KGiSL Institute of Technology (KiTE) is an industry-embedded educational institution in Coimbatore, Tamil Nadu. 
            Surrounded by IT parks and industry giants, KiTE bridges academia and cutting-edge software ecosystems to mold world-class technologists.
          </p>
        </div>
      </div>

      {/* Reusable About Section (7 steps, gains, process) */}
      <AboutSection />

      {/* Who Can Participate */}
      <div className="my-16 cyber-card p-8 sm:p-12 border border-white/10 text-center max-w-4xl mx-auto">
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white uppercase tracking-wider mb-4">
          Who Can Participate?
        </h3>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
          NEXACK 2K26 is open to undergraduate and postgraduate students from engineering, technology, and computer applications streams nationwide. 
          Teams can consist of 2 to 4 members. Cross-departmental and inter-year teams are actively encouraged!
        </p>

        <Link
          to="/register"
          className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform"
        >
          <span>REGISTER YOUR TEAM NOW</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default About;
