import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Calendar, 
  CreditCard, 
  Award, 
  Share2, 
  Eye, 
  Globe, 
  FileText, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { settingsService, getImageUrl } from '../../services/api';
import { extractGoogleDriveFileId, isGoogleDriveUrl, normalizeGoogleDriveUrl } from '../../utils/googleDrive';
import Loader from '../../components/Loader';

const TABS = [
  { id: 'general', label: 'General', icon: FileText },
  { id: 'event', label: 'Event Schedule', icon: Calendar },
  { id: 'registration', label: 'Registration', icon: Award },
  { id: 'payment', label: 'Payment & QR', icon: CreditCard },
  { id: 'submission', label: 'Submission', icon: FileText },
  { id: 'contact', label: 'Contact', icon: Share2 },
  { id: 'social', label: 'Social', icon: Globe },
  { id: 'homepage', label: 'Homepage', icon: Eye },
  { id: 'results', label: 'Results & Podium', icon: Award },
];

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    eventName: 'NEXACK 2K26',
    edition: '2026',
    tagline: 'BUILD. BREAK. INNOVATE.',
    description: '',
    organizerName: 'Nexora Association',
    department: 'Department of Computer Science & Business Systems',
    college: 'KGiSL Institute of Technology',
    venue: 'KGiSL Campus, Coimbatore, Tamil Nadu',
    venueAddress: 'KGiSL Campus, Saravanampatti, Coimbatore - 641035',
    eventDate: '2026-03-27',
    startTime: '08:30 AM',
    endTime: '05:30 PM',
    durationHours: 24,
    registrationStatus: 'Open',
    registrationFee: 400,
    currency: '₹',
    minTeamSize: 2,
    maxTeamSize: 4,
    upiId: '',
    upiQrCode: '',
    paymentQrDriveLink: '',
    paymentInstructions: 'Scan the UPI QR code and complete payment. Take a screenshot of the completed payment showing the Transaction ID/UTR and upload it below.',
    submissionDeadline: '2026-03-27T23:59',
    allowLateSubmissions: false,
    contactEmail: 'nexack@kgkite.ac.in',
    contactPhone: '+91 98765 43210',
    websiteUrl: '',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      website: ''
    },
    heroTitle: 'NEXACK 2K26',
    heroDescription: 'A next-generation hackathon where students transform real-world problems into technology-driven solutions.',
    isPublicLeaderboardEnabled: false,
    isResultsPublished: false,
    maintenanceMode: false
  });

  const [msg, setMsg] = useState({ type: '', text: '' });
  const [qrPreview, setQrPreview] = useState('');
  const [qrDriveWarning, setQrDriveWarning] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getPublicSettings();
      const s = res.data?.settings || {};
      
      const merged = {
        ...settings,
        ...s,
        socialLinks: {
          ...settings.socialLinks,
          ...(s.socialLinks || {})
        }
      };

      if (merged.eventDate) {
        merged.eventDate = new Date(merged.eventDate).toISOString().slice(0, 10);
      }
      if (merged.submissionDeadline) {
        merged.submissionDeadline = new Date(merged.submissionDeadline).toISOString().slice(0, 16);
      }

      setSettings(merged);

      // Compute QR preview
      const qrLink = merged.paymentQrDriveLink || merged.upiQrCode || '';
      if (qrLink) {
        setQrPreview(getImageUrl(qrLink));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setMsg({ type: 'error', text: 'Failed to load system settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  // Google Drive link validator & normalizer
  const handleDriveLinkChange = (url) => {
    setSettings((prev) => ({
      ...prev,
      paymentQrDriveLink: url,
      upiQrCode: url
    }));

    if (!url.trim()) {
      setQrPreview('');
      setQrDriveWarning('');
      return;
    }

    if (isGoogleDriveUrl(url)) {
      const fileId = extractGoogleDriveFileId(url);
      if (!fileId) {
        setQrDriveWarning('Could not extract a valid Google Drive file ID from this URL.');
      } else {
        setQrDriveWarning('');
      }
    } else if (url.startsWith('http')) {
      setQrDriveWarning('');
    } else {
      setQrDriveWarning('Please provide a valid URL.');
    }

    const normalized = normalizeGoogleDriveUrl(url);
    setQrPreview(normalized);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setMsg({ type: '', text: '' });

      // Build payload matching SiteSettings schema
      const payload = {
        ...settings,
        registrationFee: Number(settings.registrationFee) || 0,
        minTeamSize: Number(settings.minTeamSize) || 1,
        maxTeamSize: Number(settings.maxTeamSize) || 4,
        durationHours: Number(settings.durationHours) || 24,
        upiQrCode: settings.paymentQrDriveLink || settings.upiQrCode
      };

      const res = await settingsService.updateSettings(payload);
      if (res.data?.success) {
        setMsg({ type: 'success', text: 'Site settings saved successfully!' });
        setTimeout(() => setMsg({ type: '', text: '' }), 5000);
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading site configurations..." />;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-100 flex items-center gap-3">
            <Settings className="w-7 h-7 text-cyan-400" /> Platform & Site Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Database-driven settings for hackathon details, deadlines, payment QR, and public visibility
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Action Notification */}
      {msg.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg({ type: '', text: '' })}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={settings.eventName || ''}
                  onChange={(e) => handleChange('eventName', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Edition
                </label>
                <input
                  type="text"
                  value={settings.edition || ''}
                  onChange={(e) => handleChange('edition', e.target.value)}
                  placeholder="2K26"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={settings.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={settings.venue || ''}
                  onChange={(e) => handleChange('venue', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Venue Detailed Address
                </label>
                <input
                  type="text"
                  value={settings.venueAddress || ''}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENT */}
        {activeTab === 'event' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Event Schedule & Timing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Event Date
                </label>
                <input
                  type="date"
                  value={settings.eventDate || ''}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  value={settings.startTime || ''}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  placeholder="08:30 AM"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  value={settings.endTime || ''}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  placeholder="05:30 PM"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  value={settings.durationHours ?? 24}
                  onChange={(e) => handleChange('durationHours', parseInt(e.target.value) || 24)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRATION */}
        {activeTab === 'registration' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Registration Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Registration Status
                </label>
                <select
                  value={settings.registrationStatus || 'Open'}
                  onChange={(e) => handleChange('registrationStatus', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.registrationFee ?? 400}
                  onChange={(e) => handleChange('registrationFee', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Min Team Size
                </label>
                <input
                  type="number"
                  value={settings.minTeamSize ?? 2}
                  onChange={(e) => handleChange('minTeamSize', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Max Team Size
                </label>
                <input
                  type="number"
                  value={settings.maxTeamSize ?? 4}
                  onChange={(e) => handleChange('maxTeamSize', parseInt(e.target.value) || 4)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT & QR */}
        {activeTab === 'payment' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Payment & Google Drive QR Setup</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Configure UPI receiving handle, payment instructions, and direct Google Drive QR image link
                </p>
              </div>
            </div>

            {/* Instruction Alert */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-cyan-300">
                  Google Drive QR Image Instructions:
                </p>
                <p>
                  1. Upload your payment QR code image to Google Drive.
                </p>
                <p>
                  2. Right-click the file &gt; click <strong>Share</strong> &gt; set General Access to <strong>"Anyone with the link can view"</strong>.
                </p>
                <p className="text-cyan-200 font-medium">
                  "Make sure the Google Drive QR image is accessible to anyone with the link."
                </p>
                <p>
                  3. Copy and paste the share link below. Supported formats:
                  <code className="text-cyan-400 ml-1 font-mono">/file/d/FILE_ID/view</code>, 
                  <code className="text-cyan-400 ml-1 font-mono">/open?id=FILE_ID</code>, 
                  <code className="text-cyan-400 ml-1 font-mono">/uc?id=FILE_ID</code>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.registrationFee ?? 400}
                  onChange={(e) => handleChange('registrationFee', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Official UPI ID
                </label>
                <input
                  type="text"
                  value={settings.upiId || ''}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  placeholder="nexack2026@okaxis"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Google Drive Link Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                PAYMENT QR DRIVE LINK *
              </label>
              <input
                type="url"
                value={settings.paymentQrDriveLink || settings.upiQrCode || ''}
                onChange={(e) => handleDriveLinkChange(e.target.value)}
                placeholder="https://drive.google.com/file/d/1A2B3C4D5E6F.../view?usp=sharing"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              {qrDriveWarning && (
                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{qrDriveWarning}</span>
                </p>
              )}
            </div>

            {/* Live QR Card Preview */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Live QR Card Preview (As Seen by Participants)
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {qrPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-44 h-44 bg-white border border-slate-700 rounded-2xl p-3 flex items-center justify-center shadow-lg">
                      <img
                        src={qrPreview}
                        alt="Payment QR Code Preview"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          const current = e.target.src;
                          if (current.includes('lh3.googleusercontent.com/d/')) {
                            const id = current.split('/d/')[1];
                            e.target.src = `https://drive.google.com/uc?export=view&id=${id}`;
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDriveLinkChange('')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Clear QR Link
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-4">
                    <CreditCard className="w-8 h-8 text-slate-600 mb-2" />
                    <span className="text-xs text-slate-500">No QR link configured</span>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-400 flex-1">
                  <p className="font-semibold text-slate-200">Participant Portal Display Status:</p>
                  <p>
                    {qrPreview 
                      ? '✓ Direct image preview active. Once saved, this QR image will render immediately on the team registration and participant payment pages.'
                      : 'Paste a Google Drive share link above to enable the direct QR image for participants.'}
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition"
                    >
                      SAVE PAYMENT DETAILS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Payment Instructions
              </label>
              <textarea
                rows={3}
                value={settings.paymentInstructions || ''}
                onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SUBMISSION */}
        {activeTab === 'submission' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Project Submission Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Submission Deadline
                </label>
                <input
                  type="datetime-local"
                  value={settings.submissionDeadline || ''}
                  onChange={(e) => handleChange('submissionDeadline', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowLateSubmissions || false}
                    onChange={(e) => handleChange('allowLateSubmissions', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-slate-200 font-medium">Allow Late Submissions</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={settings.websiteUrl || ''}
                  onChange={(e) => handleChange('websiteUrl', e.target.value)}
                  placeholder="https://nexack.kgkite.ac.in"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SOCIAL */}
        {activeTab === 'social' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Social Media Handles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.socialLinks?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  YouTube
                </label>
                <input
                  type="url"
                  value={settings.socialLinks?.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: HOMEPAGE */}
        {activeTab === 'homepage' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Homepage Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ''}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  value={settings.heroDescription || ''}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: RESULTS */}
        {activeTab === 'results' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">Results & Podium Visibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Public Leaderboard</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Allow public viewing of live scores</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isPublicLeaderboardEnabled || false}
                  onChange={(e) => handleChange('isPublicLeaderboardEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Results & Winners Published</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Reveal final podium places and awards publicly</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isResultsPublished || false}
                  onChange={(e) => handleChange('isResultsPublished', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
