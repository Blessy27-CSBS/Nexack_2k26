import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Instagram, Linkedin, Github, Twitter, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { settingsService } from '../services/api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublicSettings();
        if (res.data.success) {
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
    <footer className="relative bg-[#05060a] border-t border-white/10 pt-16 pb-12 overflow-hidden text-slate-400 text-sm">
      {/* Background neon atmospheric flare */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Organization */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-neon-cyan">
                <div className="w-full h-full bg-[#07080d] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-wider text-white">
                NEXACK <span className="text-gradient">2K26</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {settings?.description || "A next-generation hackathon where students transform real-world problems into technology-driven solutions."}
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Organized By</p>
              <p className="text-white font-medium text-sm">{settings?.organizerName || 'Nexora Association'}</p>
              <p className="text-xs text-slate-400">{settings?.department || 'Department of Computer Science & Business Systems'}</p>
              <p className="text-xs text-slate-400">{settings?.college || 'KGiSL Institute of Technology'}</p>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About NEXACK</Link></li>
              <li><Link to="/tracks" className="hover:text-cyan-400 transition-colors">Hackathon Tracks</Link></li>
              <li><Link to="/timeline" className="hover:text-cyan-400 transition-colors">Timeline & Schedule</Link></li>
              <li><Link to="/rules" className="hover:text-cyan-400 transition-colors">Rules & Guidelines</Link></li>
              <li><Link to="/prizes" className="hover:text-cyan-400 transition-colors">Prizes & Awards</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/mentors" className="hover:text-cyan-400 transition-colors">Mentors</Link></li>
              <li><Link to="/sponsors" className="hover:text-cyan-400 transition-colors">Sponsors</Link></li>
              <li><Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link></li>
              <li><Link to="/association" className="hover:text-cyan-400 transition-colors">Nexora Association</Link></li>
              <li><Link to="/faculty" className="hover:text-cyan-400 transition-colors">Faculty Coordinators</Link></li>
              <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQs</Link></li>
              <li><Link to="/announcements" className="hover:text-cyan-400 transition-colors">Announcements</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="flex items-start space-x-3 text-xs">
              <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>{settings?.venueAddress || 'KGiSL Campus, Saravanampatti, Coimbatore - 641035'}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <a href={`mailto:${settings?.contactEmail || 'nexack@kgkite.ac.in'}`} className="hover:text-white transition-colors">
                {settings?.contactEmail || 'nexack@kgkite.ac.in'}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <a href={`tel:${settings?.contactPhone || '+919876543210'}`} className="hover:text-white transition-colors">
                {settings?.contactPhone || '+91 98765 43210'}
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-3 flex items-center space-x-3">
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/40 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/40 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/40 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/40 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {currentYear} NEXACK 2K26. All rights reserved. Department of CSBS, KGiSL Institute of Technology.</p>
          <div className="flex items-center space-x-6">
            <Link to="/rules" className="hover:text-slate-400">Rules</Link>
            <Link to="/faq" className="hover:text-slate-400">FAQ</Link>
            <Link to="/admin/login" className="text-slate-600 hover:text-cyan-500 font-mono text-[11px]">System Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
