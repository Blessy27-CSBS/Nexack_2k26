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
  Layers
} from 'lucide-react';
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
        setModalMsg('Payment proof uploaded successfully! Awaiting admin review.');
        setShowPaymentModal(false);
        fetchDashboardData();
      }
    } catch (err) {
      setModalMsg(err.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setUploadingPayment(false);
    }
  };

  if (loading) return <Loader message="Loading Participant Dashboard..." />;

  if (!team) {
    return (
      <div className="min-h-screen py-20 px-4 text-center text-white">
        <div className="cyber-card p-12 max-w-xl mx-auto border border-amber-500/30">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-white mb-2">No Team Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your participant account is not currently linked to a team.
          </p>
          <Link
            to="/register"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase"
          >
            Register a Team
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
    { label: 'Judging', done: isEvaluated },
    { label: 'Results', done: isResultsDone }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Top Banner */}
      <div className="cyber-card p-6 sm:p-8 mb-8 border border-white/10 bg-gradient-to-r from-[#0c0f1d] via-[#101426] to-[#0c0f1d]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-sm font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30 shadow-neon-cyan">
                {team.teamId}
              </span>
              <StatusBadge status={team.registrationStatus} />
              <StatusBadge status={team.paymentStatus} />
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              {team.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center space-x-2">
              <span>Track:</span>
              <span className="text-cyan-300 font-semibold">{team.track?.title || 'General'}</span>
            </p>
          </div>

          {/* Action Quick Links */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>PAYMENT DETAILS</span>
            </button>

            <Link
              to="/team"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center space-x-2 transition-all"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>TEAM SQUAD</span>
            </Link>

            <Link
              to="/submission"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <FileCode className="w-4 h-4" />
              <span>PROJECT PORTAL</span>
            </Link>
          </div>
        </div>

        {/* Progress Pipeline */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-4">
            Marathon Progression
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {progressSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  step.done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-slate-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-mono font-bold">
                  {step.done ? '✓' : '○'}
                </div>
                <span className="text-xs font-medium block">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Rejected Alert & Action */}
      {team.paymentStatus === 'Rejected' && (
        <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-base text-red-300">
                Payment Verification Rejected
              </h4>
              <p className="text-xs text-red-200 mt-0.5">
                Reason: {team.rejectionReason || 'Proof unclear or transaction not matched.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 rounded-xl bg-red-500 text-black font-bold text-xs uppercase flex items-center space-x-2 self-start sm:self-auto hover:bg-red-400 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Re-upload Payment Proof</span>
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Team Squad & Track Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submission Status Card */}
          <div className="cyber-card p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <span>Project Submission Status</span>
              </h3>
              <StatusBadge status={submission ? submission.status : 'Not Submitted'} />
            </div>

            {submission ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Submission ID:</span>
                    <span className="font-mono font-bold text-cyan-400">{submission.submissionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Project Title:</span>
                    <span className="font-semibold text-white">{submission.projectTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">GitHub Repository:</span>
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/submission"
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-2 transition-all"
                  >
                    <span>View / Update Submission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs sm:text-sm text-slate-400 mb-4">
                  {isVerified
                    ? 'Your team is verified! You can now draft and submit your project solution.'
                    : 'Team registration is pending admin verification before project submission opens.'}
                </p>

                {isVerified && (
                  <Link
                    to="/submission"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase"
                  >
                    <span>START PROJECT SUBMISSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Team Members Card */}
          <div className="cyber-card p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Squad Roster ({team.members ? team.members.length + 1 : 1} Members)</span>
              </h3>
              <Link to="/team" className="text-xs text-cyan-400 hover:underline">
                Manage Squad →
              </Link>
            </div>

            <div className="space-y-3">
              {/* Leader */}
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-white text-sm">
                      {team.leader?.name || user.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      Leader
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {team.leader?.email || user.email} • {team.leader?.department} ({team.leader?.year})
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">{team.leader?.phone}</span>
              </div>

              {/* Members */}
              {team.members && team.members.map((mem, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white text-sm block">{mem.name}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mem.email} • {mem.department} ({mem.year})
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{mem.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Announcements */}
        <div className="space-y-6">
          {/* Key Dates & Countdown */}
          <div className="cyber-card p-6 border border-white/10">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Important Deadlines</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block font-mono">Submission Deadline</span>
                <span className="font-bold text-white text-sm">
                  {settings?.submissionDeadline
                    ? new Date(settings.submissionDeadline).toLocaleString()
                    : 'To be announced'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block font-mono">Hackathon Grand Finale</span>
                <span className="font-bold text-white text-sm">
                  {settings?.eventDate
                    ? new Date(settings.eventDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'March 27, 2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="cyber-card p-6 border border-white/10">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>Live Announcements</span>
            </h3>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No announcements published yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-cyan-300">{item.title}</span>
                      <StatusBadge status={item.priority} className="text-[9px] py-0 px-1.5" />
                    </div>
                    <p className="text-xs text-slate-400">{item.message}</p>
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
        title="Payment & UPI Details"
      >
        <div className="space-y-6">
          <PaymentQRCard
            registrationFee={settings?.registrationFee ?? 400}
            upiId={settings?.upiId || ''}
            qrUrl={settings?.paymentQrDriveLink || settings?.upiQrCode}
            instructions={settings?.paymentInstructions || "Scan the UPI QR code and complete payment. Upload your transaction screenshot for review."}
          />

          <form onSubmit={handleReuploadPayment} className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Submit / Update Payment Proof
            </h4>

            {modalMsg && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                {modalMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Transaction ID / UTR
              </label>
              <input
                type="text"
                value={newTransactionId}
                onChange={(e) => setNewTransactionId(e.target.value)}
                placeholder="e.g. 408221839211"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Payment Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProofFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-300"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={uploadingPayment}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase disabled:opacity-50"
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
