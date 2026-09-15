import React, { useState, useEffect } from 'react';
import {
  Scale,
  CheckCircle,
  Clock,
  ExternalLink,
  Github,
  Globe,
  FileText,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { judgeService, settingsService, getImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const defaultWeights = {
  innovation: 20,
  technicalImplementation: 25,
  problemRelevance: 15,
  userExperience: 15,
  scalability: 10,
  impact: 10,
  presentation: 5
};

const AdminEvaluations = () => {
  const { user, role, isJudge } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalAssigned: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  // Scoring Modal
  const [evalModalProject, setEvalModalProject] = useState(null);
  const [scores, setScores] = useState({
    innovation: 0,
    technicalImplementation: 0,
    problemRelevance: 0,
    userExperience: 0,
    scalability: 0,
    impact: 0,
    presentation: 0
  });
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchJudgeProjects = async () => {
    setLoading(true);
    try {
      const [projRes, setRes] = await Promise.all([
        judgeService.getProjects(),
        settingsService.getPublicSettings()
      ]);

      if (projRes.data?.success) {
        setProjects(projRes.data.projects || []);
        setStats({
          totalAssigned: projRes.data.totalAssigned || 0,
          completed: projRes.data.completed || 0,
          pending: projRes.data.pending || 0
        });
      }

      if (setRes.data?.settings) {
        setSettings(setRes.data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudgeProjects();
  }, []);

  const openEvaluationModal = (project) => {
    setEvalModalProject(project);
    if (project.evaluation) {
      setScores(project.evaluation.scores || {
        innovation: 0,
        technicalImplementation: 0,
        problemRelevance: 0,
        userExperience: 0,
        scalability: 0,
        impact: 0,
        presentation: 0
      });
      setComments(project.evaluation.comments || '');
    } else {
      setScores({
        innovation: 0,
        technicalImplementation: 0,
        problemRelevance: 0,
        userExperience: 0,
        scalability: 0,
        impact: 0,
        presentation: 0
      });
      setComments('');
    }
  };

  const handleScoreChange = (criterion, val) => {
    const num = Number(val);
    setScores(prev => ({ ...prev, [criterion]: num }));
  };

  const weights = settings?.judgingCriteriaWeights || defaultWeights;

  const totalCalculatedScore =
    (Number(scores.innovation) || 0) +
    (Number(scores.technicalImplementation) || 0) +
    (Number(scores.problemRelevance) || 0) +
    (Number(scores.userExperience) || 0) +
    (Number(scores.scalability) || 0) +
    (Number(scores.impact) || 0) +
    (Number(scores.presentation) || 0);

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await judgeService.submitEvaluation({
        submissionId: evalModalProject._id,
        scores,
        comments
      });

      if (res.data?.success) {
        setEvalModalProject(null);
        fetchJudgeProjects();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader message="Loading assigned evaluation panels..." />;

  return (
    <div className="space-y-6 text-white">
      {/* Header & Judge Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Judging & Evaluation Suite
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {role === 'judge' ? `Assigned to: ${user?.name}` : 'Judge evaluation controls & weighted score audits'}
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            Assigned: <strong>{stats.totalAssigned}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            Evaluated: <strong>{stats.completed}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            Pending: <strong>{stats.pending}</strong>
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="cyber-card p-12 text-center border border-white/10">
          <Scale className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-white mb-1">No Projects Assigned</h3>
          <p className="text-xs text-slate-400">
            You do not currently have any submissions assigned for scoring. Check back once the competition moves to the evaluation phase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className={`cyber-card p-6 border flex flex-col justify-between ${
                project.isEvaluated
                  ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 to-transparent'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                    {project.submissionId || 'SUB'}
                  </span>
                  <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    project.isEvaluated
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {project.isEvaluated ? '✓ Evaluated' : '○ Pending Evaluation'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-1">
                  {project.projectTitle}
                </h3>

                <p className="text-xs font-mono text-purple-300 mb-3">
                  {project.team?.name} ({project.track?.title})
                </p>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {project.projectDescription}
                </p>

                {/* Score badge if evaluated */}
                {project.evaluation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-400">Your Awarded Score:</span>
                    <span className="font-heading font-black text-lg text-emerald-400">
                      {project.evaluation.totalScore} / 100
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center space-x-1">
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openEvaluationModal(project)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    project.isEvaluated
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-neon-cyan hover:scale-105'
                  }`}
                >
                  {project.isEvaluated ? 'Review / Edit Score' : 'Score Submission'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evaluation Scoring Modal */}
      {evalModalProject && (
        <Modal
          isOpen={Boolean(evalModalProject)}
          onClose={() => setEvalModalProject(null)}
          title={`Evaluating: ${evalModalProject.projectTitle}`}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSubmitEvaluation} className="space-y-6">
            {/* Quick Project Summary */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Team: <strong className="text-white">{evalModalProject.team?.name}</strong></span>
                <span className="text-slate-400">Track: <strong className="text-cyan-400">{evalModalProject.track?.title}</strong></span>
              </div>
              <p className="text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
                {evalModalProject.projectDescription}
              </p>
            </div>

            {/* Criteria Sliders / Inputs */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                Scoring Rubric (100-Point Weighted Scale)
              </h4>

              {[
                { key: 'innovation', label: 'Innovation & Originality', max: 20 },
                { key: 'technicalImplementation', label: 'Technical Implementation & Code Quality', max: 25 },
                { key: 'problemRelevance', label: 'Problem Relevance & Scope', max: 15 },
                { key: 'userExperience', label: 'User Experience & Design', max: 15 },
                { key: 'scalability', label: 'Scalability & Architecture', max: 10 },
                { key: 'impact', label: 'Business / Social Impact', max: 10 },
                { key: 'presentation', label: 'Pitch & Presentation Delivery', max: 5 }
              ].map((c) => (
                <div key={c.key} className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-white">{c.label}</span>
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      {scores[c.key] || 0} / {c.max} pts
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={c.max}
                    value={scores[c.key] || 0}
                    onChange={(e) => handleScoreChange(c.key, e.target.value)}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Total Weighted Score Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-slate-400 uppercase block">Total Weighted Score</span>
                <span className="text-[11px] text-cyan-400">Sum of all evaluation criteria</span>
              </div>
              <span className="font-heading font-black text-3xl text-gradient">
                {totalCalculatedScore} / 100
              </span>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Judge Evaluation Feedback & Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Constructive feedback for the participants regarding code quality, pitch, and technical depth..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEvalModalProject(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs uppercase shadow-neon-cyan hover:scale-105 transition-transform disabled:opacity-50"
              >
                {submitting ? 'Submitting Score...' : 'Lock & Submit Evaluation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminEvaluations;
