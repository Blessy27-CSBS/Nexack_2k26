import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CreditCard,
  FileCode,
  AlertCircle,
  ExternalLink,
  Upload,
  Sparkles,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { teamService, submissionService, settingsService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import PaymentQRCard from '../components/PaymentQRCard';

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { user, isParticipant, logout } = useAuth();

  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment upload modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newTransactionId, setNewTransactionId] = useState('');
  const [newProofFile, setNewProofFile] = useState(null);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [teamRes, subRes, setRes] = await Promise.all([
        teamService.getMyTeam().catch(() => ({ data: { team: null } })),
        submissionService.getMySubmission().catch(() => ({ data: { submission: null } })),
        settingsService.getPublicSettings().catch(() => ({ data: { settings: null } }))
      ]);

      if (teamRes.data?.team) setTeam(teamRes.data.team);
      if (subRes.data?.submission) setSubmission(subRes.data.submission);
      if (setRes.data?.settings) setSettings(setRes.data.settings);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!newTransactionId && !newProofFile) {
      setModalMsg('Please provide either a transaction ID / UTR or a screenshot proof.');
      return;
    }

    setUploadingPayment(true);
    setModalMsg('');

    try {
      const payload = new FormData();
      if (newTransactionId) payload.append('transactionId', newTransactionId);
      if (newProofFile) payload.append('screenshot', newProofFile);

      const res = await teamService.uploadPayment(payload);
      if (res.data?.success) {
        setModalMsg('Payment proof uploaded successfully! Awaiting review.');
        setTimeout(() => {
          setShowPaymentModal(false);
          setModalMsg('');
          fetchDashboardData();
        }, 1500);
      }
    } catch (err) {
      setModalMsg(err.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setUploadingPayment(false);
    }
  };

  if (loading) return <Loader fullScreen={false} />;

  if (!team) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 text-center text-white">
        <div className="p-10 max-w-lg mx-auto border border-amber-500/30 bg-zinc-950/80 rounded-3xl shadow-2xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="font-heading font-black text-2xl text-white mb-2 uppercase">No Team Profile Linked</h2>
          <p className="text-zinc-400 text-sm mb-6 font-sans">
            Your participant account ({user?.email}) is not linked to any active hackathon squad.
          </p>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-heading font-black text-xs uppercase shadow-neon-emerald hover:scale-105 transition-transform inline-block"
          >
            Register Your Squad
          </Link>
        </div>
      </div>
    );
  }

  const isVerified = team.registrationStatus === 'Verified' && team.paymentStatus === 'Verified';
  const hasProofUploaded = team.paymentStatus === 'Proof Uploaded' || team.paymentStatus === 'Verified';

  return (
    <div className="min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-white">
      {/* 1. Aligned Personalized Welcome Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 p-6 sm:p-10 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-[#07080a] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Participant Portal Active</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Welcome, <span className="text-gradient">{user?.name || 'Participant'}</span>! 👋
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
              Glad to have you with us for <strong className="text-white">CSBS NEXACK 2K26</strong>. Here is your essential squad telemetry, verification status, and project actions.
            </p>
          </div>

          {/* Action Buttons Aligned */}
          <div className="flex items-center gap-3 self-start lg:self-center flex-shrink-0">
            <Link
              to="/submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs uppercase tracking-wider shadow-neon-emerald hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <FileCode className="w-4 h-4 text-black" />
              <span>{submission ? 'View Submission' : 'Submit Project'}</span>
            </Link>

            <button
              onClick={logout}
              title="Logout"
              className="p-3.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Perfectly Sized 3-Column Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Squad Identity */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">// YOUR SQUAD</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="font-heading font-black text-xl text-white uppercase truncate mb-2">
              {team.name}
            </h3>
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 whitespace-nowrap">
                {team.teamId}
              </span>
              <span className="text-xs text-zinc-400 font-sans truncate">
                • {team.track?.title || 'Open Innovation'}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
            Registered Squad Profile
          </div>
        </div>

        {/* Card 2: Registration Approval Status */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">// REGISTRATION</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mb-3">
              <StatusBadge status={team.registrationStatus} />
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              {team.registrationStatus === 'Verified'
                ? 'Squad registration confirmed by faculty advisors.'
                : 'Squad intake profile is undergoing committee review.'}
            </p>
          </div>
          <div className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
            Faculty Evaluation Check
          </div>
        </div>

        {/* Card 3: Payment Verification Status & Action */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">// PAYMENT STATUS</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mb-3">
              <StatusBadge status={team.paymentStatus} />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasProofUploaded ? 'Update Payment Proof' : 'Upload Payment Proof'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Rejection / Warning Notice (if applicable) */}
      {team.paymentStatus === 'Rejected' && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-heading font-bold text-sm text-rose-300 uppercase">
                Payment Verification Issue
              </h4>
              <p className="text-xs text-rose-200 mt-1 font-sans">
                {team.rejectionReason || 'Screenshot unclear or reference ID was not located. Please re-upload your valid UPI payment screenshot.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 text-black font-bold text-xs uppercase hover:bg-rose-400 transition-colors flex-shrink-0 cursor-pointer"
          >
            Re-Upload Now
          </button>
        </div>
      )}

      {/* 4. Core Details: Squad Members & Submission Status (Clean 2-Column Equal Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Squad Members List */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <h3 className="font-heading font-bold text-base text-white flex items-center space-x-2 uppercase">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Squad Roster ({team.members ? team.members.length + 1 : 1} Members)</span>
              </h3>
              <Link to="/my-team" className="text-xs text-emerald-400 hover:underline font-mono">
                View Squad →
              </Link>
            </div>

            <div className="space-y-3">
              {/* Leader */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {team.leader?.name || user?.name}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                      Leader
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                    {team.leader?.email || user?.email}
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">{team.leader?.phone || user?.phone}</span>
              </div>

              {/* Team Members */}
              {team.members && team.members.length > 0 ? (
                team.members.map((mem, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white text-xs block">{mem.name}</span>
                      <span className="text-[11px] text-zinc-400 font-sans">{mem.email}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{mem.phone}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic font-sans py-2">No additional team members registered.</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Submission Box */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <h3 className="font-heading font-bold text-base text-white flex items-center space-x-2 uppercase">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Project Submission</span>
              </h3>
              <StatusBadge status={submission ? submission.status : 'Not Submitted'} />
            </div>

            {submission ? (
              <div className="space-y-3 font-sans">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Project Title:</span>
                    <span className="font-semibold text-white">{submission.projectTitle}</span>
                  </div>
                  {submission.githubUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">GitHub:</span>
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline font-mono flex items-center gap-1"
                      >
                        <span>Open Repo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {submission.demoUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Demo:</span>
                      <a
                        href={submission.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-mono flex items-center gap-1"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {isVerified
                    ? 'Your squad is verified! You can prepare and submit your project GitHub repository and architecture summary.'
                    : 'Once your registration and payment are verified by the organizers, project submission will be unlocked.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <Link
              to="/submit"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all"
            >
              <span>{submission ? 'Edit / Review Submission' : 'Go To Submission Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Payment Modal (Upload Proof & UPI QR) */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Squad Payment & Verification"
      >
        <div className="space-y-6">
          <PaymentQRCard
            registrationFee={settings?.registrationFee ?? 400}
            upiId={settings?.upiId || 'nexack2026@okaxis'}
            qrUrl={settings?.paymentQrDriveLink || settings?.upiQrCode}
            instructions={settings?.paymentInstructions || "Scan the UPI QR code using any UPI app (GPay / PhonePe / Paytm). Enter your transaction reference number and upload the screenshot below."}
          />

          <form onSubmit={handleUploadPayment} className="space-y-4 pt-3 border-t border-zinc-800">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              // UPLOAD PAYMENT PROOF
            </h4>

            {modalMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans">
                {modalMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">
                Transaction ID / UTR Number
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
                className="px-4 py-2.5 rounded-lg border border-white/10 text-xs text-zinc-300 hover:bg-zinc-800 font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadingPayment}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase disabled:opacity-50 transition-colors font-mono cursor-pointer"
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
