import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Terminal, Sparkles } from 'lucide-react';
import { contactService, settingsService } from '../services/api';
import Loader from '../components/Loader';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublicSettings();
        if (res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Settings load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await contactService.sendMessage(formData);
      if (res.data?.success) {
        setStatusMsg({ type: 'success', text: 'Thank you! Your message has been received by the CSBS NEXACK 2K26 coordinating committee.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading Telemetry & Contact Info..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // TELEMETRY DESK
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          CONTACT <span className="text-gradient">ORGANIZERS</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Inquiries regarding squad registration, track parameters, hardware logistics, or sponsorship partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Information & Venue Card */}
        <div className="space-y-6">
          <div className="p-8 border border-white/[0.08] space-y-6 bg-zinc-950/60 rounded-3xl">
            <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wide">
              Event Headquarters
            </h3>

            <div className="space-y-5 text-xs sm:text-sm font-sans">
              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-neon-emerald">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white font-mono text-xs uppercase text-emerald-400">Campus Venue</h4>
                  <p className="text-zinc-200 mt-0.5">{settings?.venue || 'KGiSL Campus, Coimbatore'}</p>
                  <p className="text-zinc-400 text-xs mt-0.5">{settings?.venueAddress || 'Department of CSBS, KGiSL Campus, Coimbatore - 641035'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white font-mono text-xs uppercase text-cyan-400">Official Communications</h4>
                  <a href={`mailto:${settings?.contactEmail || 'csbscodex@kgkite.ac.in'}`} className="text-emerald-400 hover:underline font-mono">
                    {settings?.contactEmail || 'csbscodex@kgkite.ac.in'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white font-mono text-xs uppercase text-amber-400">Coordinator Helpdesk</h4>
                  <a href={`tel:${settings?.contactPhone || '+919876543210'}`} className="text-zinc-300 hover:text-white font-mono">
                    {settings?.contactPhone || '+91 98765 43210'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08] space-y-1 text-xs text-zinc-400 font-sans">
              <p className="font-bold text-white font-heading text-sm">Nexora Association × CODEX Coding Club</p>
              <p>Department of Computer Science & Business Systems</p>
              <p className="text-zinc-500">{settings?.college || 'KGiSL Institute of Technology'}</p>
            </div>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl">
          <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wide mb-4">
            Direct Dispatch
          </h3>

          {statusMsg.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 font-sans ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g. Registration inquiry or track question"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Message Content *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'DISPATCHING...' : 'DISPATCH MESSAGE'}</span>
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
