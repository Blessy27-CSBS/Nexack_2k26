import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Upload,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Sparkles,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackService, settingsService, teamService, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import PaymentQRCard from '../components/PaymentQRCard';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRegisterSuccess } = useAuth();

  const [tracks, setTracks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Form State
  const [step, setStep] = useState(1); // 1: Team & Leader, 2: Members, 3: Payment & Proof
  const [formData, setFormData] = useState({
    teamName: '',
    trackId: '',
    leaderName: '',
    leaderEmail: '',
    leaderPassword: '',
    leaderPhone: '',
    leaderCollege: '',
    leaderDepartment: '',
    leaderYear: '3rd Year',
    leaderGithub: '',
    leaderLinkedin: '',
    transactionId: ''
  });

  const [members, setMembers] = useState([
    { name: '', email: '', phone: '', college: '', department: '', year: '3rd Year', github: '', linkedin: '' }
  ]);

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        const [trackRes, settingsRes] = await Promise.all([
          trackService.getPublished().catch(() => ({ data: { tracks: [] } })),
          settingsService.getPublicSettings().catch(() => ({ data: { settings: null } }))
        ]);

        if (trackRes.data?.tracks) {
          setTracks(trackRes.data.tracks);
          // Check query param for preselected track
          const params = new URLSearchParams(location.search);
          const trackParam = params.get('track');
          if (trackParam && trackRes.data.tracks.some(t => t._id === trackParam)) {
            setFormData(prev => ({ ...prev, trackId: trackParam }));
          } else if (trackRes.data.tracks.length > 0) {
            setFormData(prev => ({ ...prev, trackId: trackRes.data.tracks[0]._id }));
          }
        }

        if (settingsRes.data?.settings) {
          setSettings(settingsRes.data.settings);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addMember = () => {
    const max = settings?.maxTeamSize ? settings.maxTeamSize - 1 : 3;
    if (members.length < max) {
      setMembers(prev => [
        ...prev,
        {
          name: '',
          email: '',
          phone: '',
          college: formData.leaderCollege || '',
          department: formData.leaderDepartment || '',
          year: formData.leaderYear || '3rd Year',
          github: '',
          linkedin: ''
        }
      ]);
    }
  };

  const removeMember = (index) => {
    setMembers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  // Step Validation
  const validateStep1 = () => {
    setError('');
    const { teamName, trackId, leaderName, leaderEmail, leaderPassword, leaderPhone, leaderCollege, leaderDepartment } = formData;
    if (!teamName.trim() || !trackId || !leaderName.trim() || !leaderEmail.trim() || !leaderPassword || !leaderPhone.trim() || !leaderCollege.trim() || !leaderDepartment.trim()) {
      setError('Please fill in all mandatory team leader fields and select a track.');
      return false;
    }
    if (leaderPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setError('');
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.email.trim() || !m.phone.trim()) {
        setError(`Please fill in all required fields (Name, Email, Phone) for Member ${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.transactionId.trim()) {
      setError('Please enter the UPI Transaction ID / UTR.');
      return;
    }

    if (!screenshotFile) {
      setError('Please upload your payment screenshot proof.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      const registrationData = {
        teamName: formData.teamName,
        trackId: formData.trackId,
        leaderName: formData.leaderName,
        leaderEmail: formData.leaderEmail,
        leaderPassword: formData.leaderPassword,
        leaderPhone: formData.leaderPhone,
        leaderCollege: formData.leaderCollege,
        leaderDepartment: formData.leaderDepartment,
        leaderYear: formData.leaderYear,
        leaderGithub: formData.leaderGithub,
        leaderLinkedin: formData.leaderLinkedin,
        members: members.filter(m => m.name.trim() && m.email.trim()),
        transactionId: formData.transactionId
      };

      payload.append('data', JSON.stringify(registrationData));
      payload.append('screenshot', screenshotFile);

      const res = await teamService.register(payload);

      if (res.data?.success) {
        handleRegisterSuccess(res.data);
        setSuccessData(res.data);
      } else {
        setError(res.data?.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration submission error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Setting up CSBS NEXACK 2K26 registration portal..." />;

  if (settings?.registrationStatus === 'Closed') {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <div className="p-12 max-w-xl mx-auto border border-amber-500/20 bg-zinc-950/80 rounded-3xl">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2 uppercase">Registration Closed</h2>
          <p className="text-zinc-400 text-sm font-sans">
            Registrations for CSBS NEXACK 2K26 are officially closed. Thank you to all participating squads!
          </p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (successData) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 sm:p-12 text-center border border-emerald-500/40 bg-zinc-950/90 rounded-3xl shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-neon-emerald">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block mb-1">
            // INTAKE CONFIRMED
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase mb-3">
            SQUAD REGISTERED!
          </h2>
          <p className="text-zinc-300 text-sm mb-8 font-sans">
            Your team has been successfully registered for CSBS NEXACK 2K26.
          </p>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 text-left space-y-3.5 mb-8 font-sans">
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
              <span className="text-zinc-400 font-mono">Assigned Squad ID:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">{successData.team?.teamId}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
              <span className="text-zinc-400">Team Name:</span>
              <span className="font-semibold text-white">{successData.team?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2.5">
              <span className="text-zinc-400">Team Leader:</span>
              <span className="text-white">{successData.participant?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400">Verification Status:</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                PENDING VERIFICATION
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-[1.02] transition-transform"
          >
            ENTER PARTICIPANT DASHBOARD
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // INTAKE PORTAL
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-4 mb-3">
          REGISTER FOR <span className="text-gradient">CSBS NEXACK 2K26</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-sans">
          Complete the 3-phase registration to reserve your squad's slot in the developer arena.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-8 mt-8 border-t border-b border-white/[0.08] py-4 bg-zinc-950/40 rounded-2xl">
          {[
            { stepNum: 1, label: '01 Leader & Team' },
            { stepNum: 2, label: '02 Squad Roster' },
            { stepNum: 3, label: '03 Payment & Proof' }
          ].map((s) => (
            <div key={s.stepNum} className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step === s.stepNum
                    ? 'bg-emerald-500 text-black shadow-neon-emerald scale-110'
                    : step > s.stepNum
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-900 text-zinc-500 border border-white/10'
                }`}
              >
                {step > s.stepNum ? '✓' : s.stepNum}
              </div>
              <span className={`text-xs font-mono hidden sm:inline ${step === s.stepNum ? 'text-white font-bold' : 'text-zinc-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm flex items-center space-x-3 font-sans">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card with Step Transitions */}
      <div className="p-6 sm:p-10 border border-white/[0.08] bg-zinc-950/80 rounded-3xl shadow-2xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Team & Leader Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Phase 1: Squad Identity & Team Leader</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                    Team / Squad Name *
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="e.g. CyberArchitects"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                    Selected Problem Domain / Track *
                  </label>
                  <select
                    name="trackId"
                    value={formData.trackId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0e1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                  >
                    {tracks.length === 0 ? (
                      <option value="">General Track</option>
                    ) : (
                      tracks.map(t => (
                        <option key={t._id} value={t._id}>
                          Track #{t.trackNumber} - {t.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">
                  // TEAM LEADER CREDENTIALS & CONTACT
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Leader Full Name *</label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleInputChange}
                      placeholder="Full Legal Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Leader Email Address *</label>
                    <input
                      type="email"
                      name="leaderEmail"
                      value={formData.leaderEmail}
                      onChange={handleInputChange}
                      placeholder="leader@college.edu"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Dashboard Access Password *</label>
                    <input
                      type="password"
                      name="leaderPassword"
                      value={formData.leaderPassword}
                      onChange={handleInputChange}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      name="leaderPhone"
                      value={formData.leaderPhone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">College / University Name *</label>
                    <input
                      type="text"
                      name="leaderCollege"
                      value={formData.leaderCollege}
                      onChange={handleInputChange}
                      placeholder="College Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Department / Stream *</label>
                    <input
                      type="text"
                      name="leaderDepartment"
                      value={formData.leaderDepartment}
                      onChange={handleInputChange}
                      placeholder="e.g. CSBS, CSE, IT"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Year of Study</label>
                    <select
                      name="leaderYear"
                      value={formData.leaderYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0e1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">GitHub Profile URL</label>
                    <input
                      type="url"
                      name="leaderGithub"
                      value={formData.leaderGithub}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-black text-xs tracking-wider uppercase flex items-center space-x-2 transition-transform hover:scale-105"
                >
                  <span>NEXT: ADD SQUAD ROSTER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Team Members */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Phase 2: Squad Roster ({members.length + 1} Members Total)</span>
                </h3>

                {members.length < (settings?.maxTeamSize ? settings.maxTeamSize - 1 : 3) && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-emerald-500/20 font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              {members.map((member, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      // SQUAD MEMBER #{idx + 2}
                    </span>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        placeholder="email@college.edu"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/50 font-sans"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold uppercase flex items-center space-x-2 font-mono"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-black text-xs tracking-wider uppercase flex items-center space-x-2 transition-transform hover:scale-105"
                >
                  <span>NEXT: PAYMENT VERIFICATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment Workflow */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmitRegistration} 
              className="space-y-6"
            >
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Phase 3: Registration Fee & Verification Proof</span>
              </h3>

              {/* Payment Details Box */}
              <PaymentQRCard
                registrationFee={settings?.registrationFee ?? 400}
                upiId={settings?.upiId || ''}
                qrUrl={settings?.paymentQrDriveLink || settings?.upiQrCode || settings?.registration?.upiQrCodeUrl}
                instructions={settings?.paymentInstructions || "Scan the UPI QR code and complete payment. Take a screenshot of the completed payment showing the Transaction ID/UTR and upload it below."}
              />

              {/* UTR and Proof Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                    UPI Transaction ID / UTR *
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="e.g. 408221839211"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                    Upload Payment Screenshot Proof *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full text-xs text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 cursor-pointer font-sans"
                  />
                </div>
              </div>

              {screenshotPreview && (
                <div className="p-3 bg-zinc-900 rounded-xl border border-white/10 w-fit">
                  <p className="text-[11px] font-mono text-zinc-400 mb-2">Screenshot Preview:</p>
                  <img src={screenshotPreview} alt="Proof preview" className="h-32 rounded object-cover" />
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-zinc-300 hover:text-white text-xs font-semibold uppercase flex items-center space-x-2 font-mono"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {submitting ? 'PROCESSING REGISTRATION...' : 'SUBMIT TEAM REGISTRATION'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center mt-8 text-xs text-zinc-500 font-sans">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-400 hover:underline font-mono">
          Sign In to Participant Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Register;
