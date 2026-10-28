import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Instagram, Linkedin, Github, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { settingsService } from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublicSettings();
        if (res.data?.success) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050608] border-t border-white/[0.08] pt-20 pb-12 overflow-hidden text-zinc-400 text-sm">
      {/* Background neon atmospheric flare */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Brand & Organization */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 p-0.5 shadow-neon-emerald">
                <div className="w-full h-full bg-[#07080a] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="font-heading text-2xl font-black tracking-wider text-white">
                CSBS <span className="text-gradient">CODEX</span>
              </span>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
              {settings?.description || "The flagship national-level technical hackathon bringing together software craftsmanship, distributed systems, and real-world enterprise problem statements."}
            </p>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
              <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                // ORGANIZED JOINTLY BY
              </p>
              <p className="text-white font-heading font-bold text-sm">
                Nexora Association × CODEX Coding Club
              </p>
              <p className="text-xs text-zinc-400 font-sans">
                Department of Computer Science & Business Systems
              </p>
              <p className="text-xs text-zinc-500 font-sans">
                {settings?.college || 'KGiSL Institute of Technology'}
              </p>
            </div>
          </div>

          {/* Quick Links 1: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-widest mb-4">
              // DISCOVERY
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Intro</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About CSBS NEXACK</Link></li>
              <li><Link to="/tracks" className="hover:text-emerald-400 transition-colors">Challenges & Tracks</Link></li>
              <li><Link to="/timeline" className="hover:text-emerald-400 transition-colors">Timeline & Checkpoints</Link></li>
              <li><Link to="/rules" className="hover:text-emerald-400 transition-colors">Rules & Integrity</Link></li>
              <li><Link to="/prizes" className="hover:text-emerald-400 transition-colors">Prizes & Bounties</Link></li>
            </ul>
          </div>

          {/* Quick Links 2: Community */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-widest mb-4">
              // GUILDS
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li><Link to="/association" className="hover:text-emerald-400 transition-colors">Nexora Association</Link></li>
              <li><Link to="/mentors" className="hover:text-emerald-400 transition-colors">Mentors & Jurors</Link></li>
              <li><Link to="/faculty" className="hover:text-emerald-400 transition-colors">Faculty Advisors</Link></li>
              <li><Link to="/sponsors" className="hover:text-emerald-400 transition-colors">Sponsors & Partners</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-400 transition-colors">Event Gallery</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Knowledge Base FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-mono font-bold text-xs uppercase tracking-widest mb-4">
              // TELEMETRY & CONTACT
            </h4>
            <div className="flex items-start space-x-3 text-xs font-sans">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{settings?.venueAddress || 'Department of CSBS, KGiSL Campus, Coimbatore - 641035'}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-sans">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`mailto:${settings?.contactEmail || 'csbscodex@kgkite.ac.in'}`} className="hover:text-white transition-colors">
                {settings?.contactEmail || 'csbscodex@kgkite.ac.in'}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-xs font-sans">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`tel:${settings?.contactPhone || '+919876543210'}`} className="hover:text-white transition-colors">
                {settings?.contactPhone || '+91 98765 43210'}
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center space-x-2.5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-4 sm:space-y-0 font-sans">
          <p>© {currentYear} CSBS NEXACK 2K26. Organized by Nexora Association × CODEX. All rights reserved.</p>
          <div className="flex items-center space-x-6 font-mono text-[11px]">
            <Link to="/rules" className="hover:text-zinc-300">RULES</Link>
            <Link to="/faq" className="hover:text-zinc-300">FAQ</Link>
            <Link to="/admin/login" className="text-zinc-600 hover:text-emerald-400">SYSTEM_PORTAL</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
