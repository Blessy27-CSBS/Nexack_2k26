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
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submissionService, teamService, settingsService } from '../services/api';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

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
          teamService.getMyTeam(),
          submissionService.getMySubmission(),
          settingsService.getPublicSettings()
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
        setMessage({ type: 'error', text: 'Project Title, Description, and GitHub Repository URL are required.' });
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
          text: isFinalSubmit ? 'Project successfully submitted for evaluation!' : 'Draft saved successfully.'
        });
      }
    } catch (err) {
      console.error('Submission save error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save submission.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading Project Submission Portal..." />;

  const isLocked = deadlinePassed && submission && submission.status !== 'Draft';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO DASHBOARD</span>
      </Link>

      {/* Header Banner */}
      <div className="cyber-card p-6 sm:p-8 border border-white/10 mb-8 bg-gradient-to-r from-[#0c0f1e] via-[#111628] to-[#0c0f1e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                {team?.teamId}
              </span>
              <span className="text-xs text-slate-400">
                Track: <strong className="text-white">{team?.track?.title}</strong>
              </span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Project Submission Portal
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Submission Status</span>
            <StatusBadge status={submission ? submission.status : 'Not Submitted'} className="mt-1" />
          </div>
        </div>

        {/* Deadline Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>
              Submission Deadline:{' '}
              <strong className="text-white">
                {settings?.submissionDeadline
                  ? new Date(settings.submissionDeadline).toLocaleString()
                  : 'TBA'}
              </strong>
            </span>
          </div>

          {deadlinePassed && (
            <span className="text-amber-400 font-mono font-semibold">
              ⚠️ Submission deadline has passed.
            </span>
          )}
        </div>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {isLocked && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
          The submission window is closed. Submitted projects are currently locked for judging.
        </div>
      )}

      {/* Submission Form */}
      <div className="space-y-8">
        {/* Project Essence */}
        <div className="cyber-card p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider pb-2 border-b border-white/10">
            1. Project Overview
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleInputChange}
              disabled={isLocked}
              placeholder="e.g. Next-Gen Autonomous Logistics Engine"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
              Problem Statement *
            </label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleInputChange}
              disabled={isLocked}
              rows={3}
              placeholder="What real-world problem is your project tackling?"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
              Detailed Project Description & Architecture *
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              disabled={isLocked}
              rows={5}
              placeholder="Explain how your solution works, architecture, and core modules..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Technical Architecture & Stack */}
        <div className="cyber-card p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider pb-2 border-b border-white/10">
            2. Features, Tech Stack & Impact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Key Features (One per line)
              </label>
              <textarea
                name="keyFeatures"
                value={formData.keyFeatures}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={4}
                placeholder="Real-time analytics engine&#10;Sub-second latency verification&#10;Zero-knowledge authentication"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Technology Stack (Comma-separated)
              </label>
              <textarea
                name="technologyStack"
                value={formData.technologyStack}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={4}
                placeholder="React, Node.js, Express, MongoDB, TailwindCSS, PyTorch, Docker"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Innovation Factor
              </label>
              <textarea
                name="innovation"
                value={formData.innovation}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="What makes your solution novel or superior?"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Target Impact
              </label>
              <textarea
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="Who benefits and how measurable is the impact?"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Future Scope
              </label>
              <textarea
                name="futureScope"
                value={formData.futureScope}
                onChange={handleInputChange}
                disabled={isLocked}
                rows={3}
                placeholder="Future enhancements or commercialization path"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Project Links */}
        <div className="cyber-card p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider pb-2 border-b border-white/10">
            3. Project Links & Codebase
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                GitHub Repository URL *
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://github.com/organization/repo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Live Demo / Deployment URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="liveDemoUrl"
                  value={formData.liveDemoUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://my-nexack-project.vercel.app"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Figma Prototype URL
              </label>
              <div className="relative">
                <Figma className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="figmaUrl"
                  value={formData.figmaUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://figma.com/file/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Video Demo / Pitch URL (YouTube / Drive)
              </label>
              <div className="relative">
                <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="videoDemoUrl"
                  value={formData.videoDemoUrl}
                  onChange={handleInputChange}
                  disabled={isLocked}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Files */}
        <div className="cyber-card p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider pb-2 border-b border-white/10">
            4. Documentation & Pitch Deck
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Project Documentation (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                disabled={isLocked}
                onChange={(e) => setDocFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300 cursor-pointer disabled:opacity-50"
              />
              {submission?.documentationUrl && (
                <a
                  href={submission.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline mt-1.5 block"
                >
                  View uploaded documentation ↗
                </a>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Pitch Deck (PPT / PPTX / PDF)
              </label>
              <input
                type="file"
                accept=".ppt,.pptx,.pdf"
                disabled={isLocked}
                onChange={(e) => setPptFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:bg-purple-500/20 file:text-purple-300 cursor-pointer disabled:opacity-50"
              />
              {submission?.pptUrl && (
                <a
                  href={submission.pptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-400 hover:underline mt-1.5 block"
                >
                  View uploaded pitch deck ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        {!isLocked && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleSaveOrSubmit(false)}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-bold uppercase flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveOrSubmit(true)}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Submitting Project...' : 'Final Submit Project'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSubmission;
