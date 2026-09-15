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
  QrCode
} from 'lucide-react';
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
          trackService.getPublished(),
          settingsService.getPublicSettings()
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
    // Ensure all entered members have at least name and email
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

  if (loading) return <Loader message="Setting up registration portal..." />;

  if (settings?.registrationStatus === 'Closed') {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <div className="cyber-card p-12 max-w-xl mx-auto border border-amber-500/20">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2">Registration Closed</h2>
          <p className="text-slate-400 text-sm">
            Registrations for NEXACK 2K26 are officially closed. Thank you to all applicant teams!
          </p>
        </div>
      </div>
    );
  }

  // Success Screen
  if (successData) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-white">
        <div className="cyber-card p-8 sm:p-12 text-center border border-emerald-500/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-neon-glow">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="font-heading font-black text-3xl text-white uppercase mb-2">
            Registration Submitted!
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            Your team has been successfully registered for NEXACK 2K26.
          </p>

          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-3 mb-8">
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400 font-mono">Assigned Team ID:</span>
              <span className="font-mono font-bold text-cyan-400 text-base">{successData.team?.teamId}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400">Team Name:</span>
              <span className="font-semibold text-white">{successData.team?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400">Team Leader:</span>
              <span className="text-white">{successData.participant?.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Verification Status:</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded">
                Pending Verification
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform"
          >
            PROCEED TO PARTICIPANT DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Team Registration
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase mt-3 mb-2">
          JOIN <span className="text-gradient">NEXACK 2K26</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Complete the 3-step registration form to secure your team's hackathon slot.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-8 mt-8">
          {[
            { stepNum: 1, label: 'Leader & Team' },
            { stepNum: 2, label: 'Members' },
            { stepNum: 3, label: 'Payment' }
          ].map((s) => (
            <div key={s.stepNum} className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step === s.stepNum
                    ? 'bg-cyan-500 text-black shadow-neon-cyan scale-110'
                    : step > s.stepNum
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 text-slate-500 border border-white/10'
                }`}
              >
                {step > s.stepNum ? '✓' : s.stepNum}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === s.stepNum ? 'text-white font-semibold' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="cyber-card p-6 sm:p-10 border border-white/10">
        {/* STEP 1: Team & Leader Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 flex items-center space-x-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Step 1: Team & Leader Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="e.g. CyberVanguard"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                  Choose Track *
                </label>
                <select
                  name="trackId"
                  value={formData.trackId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
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

            <div className="pt-2">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
                Team Leader Account (Sign In Credentials)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Leader Full Name *</label>
                  <input
                    type="text"
                    name="leaderName"
                    value={formData.leaderName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Leader Email *</label>
                  <input
                    type="email"
                    name="leaderEmail"
                    value={formData.leaderEmail}
                    onChange={handleInputChange}
                    placeholder="leader@college.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Set Account Password *</label>
                  <input
                    type="password"
                    name="leaderPassword"
                    value={formData.leaderPassword}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="leaderPhone"
                    value={formData.leaderPhone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">College / Institution *</label>
                  <input
                    type="text"
                    name="leaderCollege"
                    value={formData.leaderCollege}
                    onChange={handleInputChange}
                    placeholder="College Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Department *</label>
                  <input
                    type="text"
                    name="leaderDepartment"
                    value={formData.leaderDepartment}
                    onChange={handleInputChange}
                    placeholder="e.g. CSBS, CSE, IT"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Year of Study</label>
                  <select
                    name="leaderYear"
                    value={formData.leaderYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="leaderGithub"
                    value={formData.leaderGithub}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
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
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center space-x-2"
              >
                <span>NEXT: ADD MEMBERS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Team Members */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Step 2: Team Members ({members.length + 1} Total)</span>
              </h3>

              {members.length < (settings?.maxTeamSize ? settings.maxTeamSize - 1 : 3) && (
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-cyan-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            {members.map((member, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    MEMBER {idx + 1}
                  </span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Email *</label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      placeholder="email@college.edu"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                      placeholder="Phone"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/40"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs font-semibold uppercase flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center space-x-2"
              >
                <span>NEXT: PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Workflow */}
        {step === 3 && (
          <form onSubmit={handleSubmitRegistration} className="space-y-6">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider pb-3 border-b border-white/10 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Step 3: Registration Fee & Payment Proof</span>
            </h3>

            {/* Payment Details Box with Dynamic QR Card */}
            <PaymentQRCard
              registrationFee={settings?.registrationFee ?? 400}
              upiId={settings?.upiId || ''}
              qrUrl={settings?.paymentQrDriveLink || settings?.upiQrCode || settings?.registration?.upiQrCodeUrl}
              instructions={settings?.paymentInstructions || "Scan the UPI QR code and complete payment. Take a screenshot of the completed payment showing the Transaction ID/UTR and upload it below."}
            />

            {/* UTR and Proof Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                  UPI Transaction ID / UTR *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="e.g. 408221839211"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                  Upload Payment Screenshot Proof *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer"
                />
              </div>
            </div>

            {screenshotPreview && (
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit">
                <p className="text-[11px] font-mono text-slate-400 mb-2">Screenshot Preview:</p>
                <img src={screenshotPreview} alt="Proof preview" className="h-32 rounded object-cover" />
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white text-xs font-semibold uppercase flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform disabled:opacity-50"
              >
                {submitting ? 'PROCESSING REGISTRATION...' : 'SUBMIT TEAM REGISTRATION'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="text-center mt-6 text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline">
          Sign In to Participant Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Register;
