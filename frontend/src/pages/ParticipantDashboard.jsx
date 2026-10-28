import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CreditCard,
  FileCode,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Upload,
  Calendar,
  Layers,
  Award,
  Terminal,
  Activity,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { teamService, submissionService, announcementService, settingsService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import PaymentQRCard from '../components/PaymentQRCard';

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { user, isParticipant, logout } = useAuth();

  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment re-upload modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newTransactionId, setNewTransactionId] = useState('');
  const [newProofFile, setNewProofFile] = useState(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [teamRes, subRes, annRes, setRes] = await Promise.all([
        teamService.getMyTeam().catch(() => ({ data: { team: null } })),
        submissionService.getMySubmission().catch(() => ({ data: { submission: null } })),
        announcementService.getPublic().catch(() => ({ data: { items: [] } })),
        settingsService.getPublicSettings().catch(() => ({ data: { settings: null } }))
      ]);

      if (teamRes.data?.team) setTeam(teamRes.data.team);
      if (subRes.data?.submission) setSubmission(subRes.data.submission);
      if (annRes.data?.items) setAnnouncements(annRes.data.items);
      if (setRes.data?.settings) setSettings(setRes.data.settings);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isParticipant) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, isParticipant, navigate]);

  const handleReuploadPayment = async (e) => {
    e.preventDefault();
    setUploadingPayment(true);
    setModalMsg('');

    try {
      const payload = new FormData();
      if (newTransactionId) payload.append('transactionId', newTransactionId);
      if (newProofFile) payload.append('screenshot', newProofFile);

      const res = await teamService.uploadPayment(payload);
      if (res.data?.success) {
        setModalMsg('Payment proof uploaded successfully! Awaiting review.');
        setShowPaymentModal(false);
        fetchDashboardData();
      }
    } catch (err) {
      setModalMsg(err.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setUploadingPayment(false);
    }
  };

  if (loading) return <Loader message="Accessing Participant Telemetry Center..." />;

  if (!team) {
    return (
      <div className="min-h-screen py-20 px-4 text-center text-white">
        <div className="p-12 max-w-xl mx-auto border border-amber-500/30 bg-zinc-950/80 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2 uppercase">No Team Profile Linked</h2>
          <p className="text-zinc-400 text-sm mb-6 font-sans">
            Your participant profile is not linked to an active hackathon squad.
          </p>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-heading font-black text-xs uppercase hover:bg-emerald-400 transition-colors inline-block"
          >
            Register a Squad
          </Link>
        </div>
      </div>
    );
  }

  // Progress Pipeline Steps
  const isRegistered = Boolean(team);
  const isPaymentUploaded = team.paymentStatus === 'Proof Uploaded' || team.paymentStatus === 'Verified';
  const isVerified = team.registrationStatus === 'Verified' && team.paymentStatus === 'Verified';
  const isSubmitted = submission && submission.status !== 'Draft';
  const isEvaluated = submission && submission.evaluationCount > 0;
  const isResultsDone = Boolean(settings?.isResultsPublished);

  const progressSteps = [
    { label: 'Registration', done: isRegistered },
    { label: 'Payment', done: isPaymentUploaded },
    { label: 'Verification', done: isVerified },
    { label: 'Submission', done: isSubmitted },
    { label: 'Evaluation', done: isEvaluated },
    { label: 'Results', done: isResultsDone }
  ];

  const completedCount = progressSteps.filter(s => s.done).length;
  const progressPercent = Math.round((completedCount / progressSteps.length) * 100);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Top Banner - Developer Command Center */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 sm:p-10 mb-8 border border-white/[0.08] bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3 flex-wrap gap-y-2">
              <span className="font-mono text-xs sm:text-sm font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-lg border border-emerald-500/30">
                SQUAD_ID: {team.teamId}
              </span>
              <StatusBadge status={team.registrationStatus} />
              <StatusBadge status={team.paymentStatus} />
              <span className="inline-flex items-center space-x-1.5 font-mono text-xs text-zinc-400 bg-white/[0.03] px-3 py-1 rounded-md border border-white/[0.06]">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>CSBS_CODEX_TELEMETRY</span>
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              {team.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 flex items-center space-x-2 font-sans">
              <span>Problem Domain:</span>
              <span className="text-emerald-300 font-semibold font-mono">{team.track?.title || 'Open Innovation'}</span>
            </p>
          </div>

          {/* Action Quick Links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-mono font-semibold flex items-center space-x-2 transition-all"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>PAYMENT PROOF</span>
            </button>

            <Link
              to="/my-team"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 text-xs font-mono font-semibold flex items-center space-x-2 transition-all"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>SQUAD ROSTER</span>
            </Link>

            <Link
              to="/submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <FileCode className="w-4 h-4 text-black" />
              <span>PROJECT SUBMISSION</span>
            </Link>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
              // SQUAD READINESS PROGRESS
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              {progressPercent}% Complete ({completedCount}/{progressSteps.length})
            </span>
          </div>

          {/* Graphical Progress Bar */}
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden mb-5 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {progressSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  step.done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                    : 'bg-zinc-900/50 border-white/5 text-zinc-500'
                }`}
              >
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-mono font-bold ${
                  step.done ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {step.done ? '✓' : idx + 1}
                </div>
                <span className="text-xs font-medium block font-sans">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Payment Rejected Alert & Action */}
      {team.paymentStatus === 'Rejected' && (
        <div className="mb-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-base text-rose-300 uppercase">
                Payment Verification Rejected
              </h4>
              <p className="text-xs text-rose-200 mt-0.5 font-sans">
                Reason: {team.rejectionReason || 'Proof unclear or transaction not matched.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-500 text-black font-bold text-xs uppercase flex items-center space-x-2 self-start sm:self-auto hover:bg-rose-400 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Re-upload Payment Proof</span>
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Project & Squad Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Status Card */}
          <div className="p-7 rounded-2xl border border-white/[0.08] bg-zinc-950/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2 uppercase">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <span>Project Submission Status</span>
              </h3>
              <StatusBadge status={submission ? submission.status : 'Not Submitted'} />
            </div>

            {submission ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-mono">Submission ID:</span>
                    <span className="font-mono font-bold text-emerald-400">{submission.submissionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Project Title:</span>
                    <span className="font-semibold text-white">{submission.projectTitle}</span>
                  </div>
                  {submission.githubUrl && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">GitHub Repository:</span>
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-mono text-xs hover:underline flex items-center space-x-1"
                      >
                        <span>Repository Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {submission.demoUrl && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Live Demo URL:</span>
                      <a
                        href={submission.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 font-mono text-xs hover:underline flex items-center space-x-1"
                      >
                        <span>Demo Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/submit"
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-2 transition-all"
                  >
                    <span>View / Update Submission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs sm:text-sm text-zinc-400 mb-5 font-sans">
                  {isVerified
                    ? 'Your squad is verified! You can now access the project submission portal.'
                    : 'Team registration is currently undergoing verification before project submission opens.'}
                </p>

                {isVerified && (
                  <Link
                    to="/submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-heading font-black text-xs uppercase shadow-neon-emerald transition-colors"
                  >
                    <span>START PROJECT SUBMISSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Squad Roster Card */}
          <div className="p-7 rounded-2xl border border-white/[0.08] bg-zinc-950/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2 uppercase">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Squad Roster ({team.members ? team.members.length + 1 : 1} Members)</span>
              </h3>
              <Link to="/my-team" className="text-xs text-emerald-400 hover:underline font-mono">
                Manage Squad →
              </Link>
            </div>

            <div className="space-y-3">
              {/* Leader */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {team.leader?.name || user.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                      Team Leader
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                    {team.leader?.email || user.email} • {team.leader?.department} ({team.leader?.year})
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">{team.leader?.phone}</span>
              </div>

              {/* Members */}
              {team.members && team.members.map((mem, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white text-sm block">{mem.name}</span>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                      {mem.email} • {mem.department} ({mem.year})
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{mem.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Checkpoints & Announcements */}
        <div className="space-y-6">
          {/* Key Dates */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Timeline Checkpoints</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-zinc-400 block font-mono">Submission Deadline</span>
                <span className="font-bold text-white text-sm font-sans mt-0.5 block">
                  {settings?.submissionDeadline
                    ? new Date(settings.submissionDeadline).toLocaleString()
                    : 'March 28, 2026 — 12:00 PM'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-zinc-400 block font-mono">Hackathon Grand Finale</span>
                <span className="font-bold text-white text-sm font-sans mt-0.5 block">
                  {settings?.eventDate
                    ? new Date(settings.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'March 27-28, 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/60">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Live Announcements</span>
            </h3>

            {announcements.length === 0 ? (
              <p className="text-xs text-zinc-500 italic font-sans">No announcements published yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-emerald-300">{item.title}</span>
                      <StatusBadge status={item.priority} className="text-[9px] py-0 px-1.5" />
                    </div>
                    <p className="text-xs text-zinc-400 font-sans">{item.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details & Re-upload Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Payment & UPI Verification"
      >
        <div className="space-y-6">
          <PaymentQRCard
            registrationFee={settings?.registrationFee ?? 400}
            upiId={settings?.upiId || ''}
            qrUrl={settings?.paymentQrDriveLink || settings?.upiQrCode}
            instructions={settings?.paymentInstructions || "Scan the UPI QR code and complete payment. Upload your transaction screenshot for review."}
          />

          <form onSubmit={handleReuploadPayment} className="space-y-4 pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              // SUBMIT PAYMENT PROOF
            </h4>

            {modalMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans">
                {modalMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">
                Transaction ID / UTR
              </label>
              <input
                type="text"
                value={newTransactionId}
                onChange={(e) => setNewTransactionId(e.target.value)}
                placeholder="e.g. 408221839211"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">
                Payment Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProofFile(e.target.files[0])}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-emerald-500/20 file:text-emerald-300 font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-zinc-300 hover:bg-zinc-800 font-mono"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={uploadingPayment}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase disabled:opacity-50 transition-colors font-mono"
              >
                {uploadingPayment ? 'Uploading...' : 'Submit Payment Proof'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ParticipantDashboard;
