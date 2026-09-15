import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
        setStatusMsg({ type: 'success', text: 'Thank you! Your message has been received by our coordinators.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading Contact Info..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Get in Touch
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          CONTACT <span className="text-gradient">COORDINATORS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Have queries regarding registration, tracks, problem areas, or logistics? Our team is available to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information & Venue Card */}
        <div className="space-y-6">
          <div className="cyber-card p-8 border border-white/10 space-y-6">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">
              Event Headquarters
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Campus Venue</h4>
                  <p className="text-slate-300 mt-0.5">{settings?.venue || 'KGiSL Campus, Coimbatore'}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{settings?.venueAddress || 'Saravanampatti, Coimbatore - 641035'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Official Email</h4>
                  <a href={`mailto:${settings?.contactEmail || 'nexack@kgkite.ac.in'}`} className="text-cyan-400 hover:underline">
                    {settings?.contactEmail || 'nexack@kgkite.ac.in'}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Helpdesk Contact</h4>
                  <a href={`tel:${settings?.contactPhone || '+919876543210'}`} className="text-slate-300 hover:text-white">
                    {settings?.contactPhone || '+91 98765 43210'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-1 text-xs text-slate-400">
              <p className="font-semibold text-white">{settings?.organizerName || 'Nexora Association'}</p>
              <p>{settings?.department || 'Department of Computer Science & Business Systems'}</p>
              <p>{settings?.college || 'KGiSL Institute of Technology'}</p>
            </div>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="cyber-card p-8 border border-white/10">
          <h3 className="font-heading font-bold text-2xl text-white mb-4">
            Send Us a Message
          </h3>

          {statusMsg.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
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
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g. Registration inquiry or track question"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Message Content *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Type your message here..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-cyan hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
