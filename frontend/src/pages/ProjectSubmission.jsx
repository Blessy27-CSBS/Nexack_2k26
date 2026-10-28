import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCode,
  Github,
  Globe,
  Figma,
  Video,
  FileText,
  Upload,
  Save,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  Code2,
  Rocket,
  CheckCircle2,
  Sparkles,
  Terminal,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { submissionService, teamService, settingsService } from '../services/api';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

// 5 Core Progress Stages as requested
const submissionProgressSteps = [
  { num: '01', id: 'details', label: 'DETAILS', desc: 'Title, problem brief & architecture' },
  { num: '02', id: 'repo', label: 'REPOSITORY', desc: 'GitHub codebase & live demo URLs' },
  { num: '03', id: 'doc', label: 'DOCUMENTATION', desc: 'PDF report & pitch deck slides' },
  { num: '04', id: 'review', label: 'REVIEW', desc: 'Completeness check & verification' },
  { num: '05', id: 'submit', label: 'SUBMIT', desc: 'Final lockdown & hash issuance' }
];

const ProjectSubmission = () => {
  const navigate = useNavigate();
  const { user, isParticipant } = useAuth();

  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    projectTitle: '',
    problemStatement: '',
    projectDescription: '',
    proposedSolution: '',
    keyFeatures: '',
    technologyStack: '',
    innovation: '',
    impact: '',
    futureScope: '',
    githubUrl: '',
    liveDemoUrl: '',
    figmaUrl: '',
    videoDemoUrl: ''
  });

  const [docFile, setDocFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [screenshotFiles, setScreenshotFiles] = useState([]);

  useEffect(() => {
    if (!user || !isParticipant) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [teamRes, subRes, setRes] = await Promise.all([
          teamService.getMyTeam().catch(() => ({ data: { team: null } })),
          submissionService.getMySubmission().catch(() => ({ data: { submission: null } })),
          settingsService.getPublicSettings().catch(() => ({ data: { settings: null } }))
        ]);

        if (teamRes.data?.team) setTeam(teamRes.data.team);
        if (setRes.data?.settings) setSettings(setRes.data.settings);

        if (subRes.data?.submission) {
          const s = subRes.data.submission;
          setSubmission(s);
          setFormData({
            projectTitle: s.projectTitle || '',
            problemStatement: s.problemStatement || '',
            projectDescription: s.projectDescription || '',
            proposedSolution: s.proposedSolution || '',
            keyFeatures: Array.isArray(s.keyFeatures) ? s.keyFeatures.join('\n') : '',
            technologyStack: Array.isArray(s.technologyStack) ? s.technologyStack.join(', ') : '',
            innovation: s.innovation || '',
            impact: s.impact || '',
            futureScope: s.futureScope || '',
            githubUrl: s.githubUrl || '',
            liveDemoUrl: s.liveDemoUrl || '',
            figmaUrl: s.figmaUrl || '',
            videoDemoUrl: s.videoDemoUrl || ''
          });
        }

        if (subRes.data?.deadlinePassed) {
          setDeadlinePassed(true);
        }
      } catch (err) {
        console.error('Submission load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isParticipant, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveOrSubmit = async (isFinalSubmit) => {
    setMessage({ type: '', text: '' });

    if (isFinalSubmit) {
      if (!formData.projectTitle.trim() || !formData.projectDescription.trim() || !formData.githubUrl.trim()) {
        setMessage({ type: 'error', text: 'Project Title, Description, and GitHub Repository URL are mandatory for submission.' });
        return;
      }
    }

    setSaving(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      payload.append('isFinalSubmit', isFinalSubmit ? 'true' : 'false');

      if (docFile) payload.append('documentation', docFile);
      if (pptFile) payload.append('ppt', pptFile);
      if (screenshotFiles.length > 0) {
        Array.from(screenshotFiles).forEach(f => payload.append('screenshots', f));
      }

      const res = await submissionService.saveOrSubmit(payload);

      if (res.data?.success) {
        setSubmission(res.data.submission);
        setMessage({
          type: 'success',
          text: isFinalSubmit ? 'Project successfully submitted for jury evaluation!' : 'Draft saved successfully.'
        });
      }
    } catch (err) {
      console.error('Submission save error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save submission.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Accessing Project Submission Telemetry..." />;

  const isLocked = deadlinePassed && submission && submission.status !== 'Draft';

  // Determine stage completion
  const step1Done = Boolean(formData.projectTitle && formData.problemStatement && formData.projectDescription);
  const step2Done = Boolean(formData.githubUrl);
  const step3Done = Boolean(docFile || submission?.documentationUrl || pptFile || submission?.pptUrl);
  const step4Done = step1Done && step2Done;
  const step5Done = Boolean(submission && submission.status !== 'Draft');

  const stepStatusArray = [step1Done, step2Done, step3Done, step4Done, step5Done];

  const currentStatus = submission?.status || 'Draft';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Back to Dashboard */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO SQUAD DASHBOARD</span>
      </Link>

      {/* Header Banner */}
      <div className="p-8 sm:p-10 border border-white/[0.08] mb-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-3xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                SQUAD_ID: {team?.teamId}
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                Track: <strong className="text-white font-mono">{team?.track?.title || 'Open Innovation'}</strong>
              </span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
              PROJECT <span className="text-gradient">SUBMISSION</span>
            </h1>
          </div>

          {/* Visual Status Indicator: DRAFT | SUBMITTED | UNDER REVIEW | APPROVED */}
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
              // SUBMISSION_STATUS
            </span>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border bg-zinc-900 font-mono text-xs font-bold uppercase">
              <span className={`w-2 h-2 rounded-full ${
                currentStatus === 'Approved' ? 'bg-emerald-400 animate-pulse' :
                currentStatus === 'Under Review' || currentStatus === 'Submitted' ? 'bg-cyan-400 animate-pulse' :
                'bg-amber-400'
              }`} />
              <span className={
                currentStatus === 'Approved' ? 'text-emerald-300' :
                currentStatus === 'Under Review' || currentStatus === 'Submitted' ? 'text-cyan-300' :
                'text-amber-300'
              }>
                {currentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Step Progress Bar: 01 DETAILS, 02 REPOSITORY, 03 DOCUMENTATION, 04 REVIEW, 05 SUBMIT */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-3">
            // 5-STAGE SUBMISSION PIPELINE
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {submissionProgressSteps.map((stage, idx) => {
              const isDone = stepStatusArray[idx];
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                      : 'bg-zinc-900/50 border-white/5 text-zinc-500'
                  }`}
                >
                  <span className={`text-xs font-mono font-black block mb-0.5 ${
                    isDone ? 'text-emerald-400' : 'text-zinc-600'
                  }`}>
                    {stage.num}
                  </span>
                  <span className="text-xs font-heading font-bold block">{stage.label}</span>
                  <span className="text-[9px] text-zinc-500 font-sans block mt-0.5 truncate">{stage.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadline Notice */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-zinc-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>
              Submission Deadline:{' '}
              <strong className="text-white font-mono">
                {settings?.submissionDeadline
                  ? new Date(settings.submissionDeadline).toLocaleString()
                  : 'March 28, 2026 — 12:00 PM'}
              </strong>
            </span>
          </div>

          {deadlinePassed && (
            <span className="text-amber-400 font-mono font-semibold">
              ⚠️ Submission window has concluded.
            </span>
          )}
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 font-sans ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {isLocked && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-sans">
          The submission window is officially closed. Submitted codebases are locked for jury evaluation.
        </div>
      )}

      {/* Submission Form Blocks */}
      <div className="space-y-8">
        {/* Stage 01: Details */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Project Details & Architecture</span>
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">PHASE_01_CORE</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleInputChange}
              disabled={isLocked}
              placeholder="e.g. Autonomous Multi-Agent Supply Chain Engine"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
              Problem Statement *
            </label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleInputChange}
              disabled={isLocked}
              rows={3}
              placeholder="What core industry friction or bottleneck does your prototype eliminate?"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
              Detailed Project Description & Architecture *
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              disabled={isLocked}
              rows={5}
              placeholder="Explain system dataflow, microservice topology, database layout, and runtime algorithms..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
            />
          </div>
        </div>

        {/* Technical Architecture & Stack */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="text-cyan-400 font-mono">02.</span>
              <span>Features, Tech Stack & Impact</span>
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">PHASE_02_TECH</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Key Features (One per line)
              </label>
              <textarea
                name="keyFeatures"
                value={formData.keyFeatures}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={4}
                placeholder="Real-time predictive telemetry&#10;Zero-knowledge proof verification&#10;Sub-second consensus engine"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Technology Stack (Comma-separated)
              </label>
              <textarea
                name="technologyStack"
                value={formData.technologyStack}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={4}
                placeholder="React, Node.js, FastAPI, PyTorch, PostgreSQL, Docker, Redis"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Innovation Factor
              </label>
              <textarea
                name="innovation"
                value={formData.innovation}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="What gives your technical design a breakthrough edge?"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Target Impact
              </label>
              <textarea
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="Who benefits and what are measurable efficiency gains?"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Future Scalability
              </label>
              <textarea
                name="futureScope"
                value={formData.futureScope}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="Commercial roadmaps, edge deployments, enterprise scale"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Stage 02: Repository & Links */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="text-amber-400 font-mono">03.</span>
              <span>Project Links & Codebase</span>
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">PHASE_03_REPOSITORIES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                GitHub Repository URL *
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://github.com/squad/csbs-codex-project"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Live Deployment / Hosted Demo URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="liveDemoUrl"
                  value={formData.liveDemoUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://my-hackathon-demo.vercel.app"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Figma Prototype URL
              </label>
              <div className="relative">
                <Figma className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="figmaUrl"
                  value={formData.figmaUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://figma.com/file/..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Video Pitch URL (YouTube / Drive)
              </label>
              <div className="relative">
                <Video className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="videoDemoUrl"
                  value={formData.videoDemoUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stage 03: Documentation & Pitch */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="text-purple-400 font-mono">04.</span>
              <span>Documentation & Pitch Deck</span>
            </h3>
            <span className="font-mono text-[10px] text-zinc-500">PHASE_04_ASSETS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Project Documentation (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                disabled={isLocked}
                onChange={(e) => setDocFile(e.target.files[0])}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-emerald-500/20 file:text-emerald-300 cursor-pointer disabled:opacity-50 font-mono"
              />
              {submission?.documentationUrl && (
                <a
                  href={submission.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline mt-1.5 block font-mono"
                >
                  View current uploaded documentation ↗
                </a>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Pitch Deck (PPT / PPTX / PDF)
              </label>
              <input
                type="file"
                accept=".ppt,.pptx,.pdf"
                disabled={isLocked}
                onChange={(e) => setPptFile(e.target.files[0])}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-purple-500/20 file:text-purple-300 cursor-pointer disabled:opacity-50 font-mono"
              />
              {submission?.pptUrl && (
                <a
                  href={submission.pptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-400 hover:underline mt-1.5 block font-mono"
                >
                  View current uploaded pitch deck ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stage 05: Action Controls */}
        {!isLocked && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleSaveOrSubmit(false)}
              disabled={saving}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 text-xs font-mono font-bold uppercase flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-zinc-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveOrSubmit(true)}
              disabled={saving}
              className="w-full sm:w-auto px-9 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4 text-black" />
              <span>{saving ? 'SUBMITTING PROJECT...' : '05 FINAL SUBMIT PROJECT'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSubmission;
