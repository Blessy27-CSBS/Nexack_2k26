import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Github,
  Globe,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Scale,
  Award,
  Download
} from 'lucide-react';
import { submissionService, trackService, judgeService, getImageUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [viewSub, setViewSub] = useState(null);
  const [assignModalSub, setAssignModalSub] = useState(null);
  const [selectedJudgeIds, setSelectedJudgeIds] = useState([]);
  const [savingAssignment, setSavingAssignment] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getAllAdmin({
        search,
        track: selectedTrack,
        status: selectedStatus
      });
      if (res.data?.submissions) {
        setSubmissions(res.data.submissions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [trackRes, judgeRes] = await Promise.all([
          trackService.getAllAdmin(),
          judgeService.getAllJudges()
        ]);
        if (trackRes.data?.tracks) setTracks(trackRes.data.tracks);
        if (judgeRes.data?.judges) setJudges(judgeRes.data.judges);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedTrack, selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSubmissions();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await submissionService.updateStatus(id, status);
      fetchSubmissions();
      if (viewSub && viewSub._id === id) {
        setViewSub(prev => ({ ...prev, status }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const openAssignModal = (sub) => {
    setAssignModalSub(sub);
    setSelectedJudgeIds(sub.assignedJudges ? sub.assignedJudges.map(j => j._id) : []);
  };

  const handleSaveJudges = async (e) => {
    e.preventDefault();
    setSavingAssignment(true);
    try {
      await submissionService.assignJudges(assignModalSub._id, selectedJudgeIds);
      setAssignModalSub(null);
      fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign judges');
    } finally {
      setSavingAssignment(false);
    }
  };

  const toggleJudgeSelection = (judgeId) => {
    setSelectedJudgeIds(prev =>
      prev.includes(judgeId)
        ? prev.filter(id => id !== judgeId)
        : [...prev, judgeId]
    );
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
          Project Submissions Desk
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Review participant codebases, documentation, demo links, and assign evaluation panels
        </p>
      </div>

      {/* Filters */}
      <div className="cyber-card p-4 border border-white/10 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project title or submission ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
          />
        </form>

        <select
          value={selectedTrack}
          onChange={(e) => setSelectedTrack(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
        >
          <option value="">All Tracks</option>
          {tracks.map(t => (
            <option key={t._id} value={t._id}>Track #{t.trackNumber} - {t.title}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Finalist">Finalist</option>
          <option value="Winner">Winner</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Sub ID</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Assigned Judges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 italic">
                    No submissions found under this filter.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {sub.submissionId || 'SUB-DRAFT'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{sub.projectTitle}</div>
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-cyan-400 hover:underline inline-flex items-center space-x-1"
                        >
                          <Github className="w-3 h-3" />
                          <span>Repo</span>
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{sub.team?.name}</div>
                      <span className="font-mono text-[11px] text-slate-400">{sub.team?.teamId}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">
                      {sub.track?.title || 'General'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {sub.averageScore > 0 ? `${sub.averageScore}/100` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="font-mono font-bold text-purple-300">
                          {sub.assignedJudges ? sub.assignedJudges.length : 0}
                        </span>
                        <button
                          onClick={() => openAssignModal(sub)}
                          className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[10px]"
                          title="Manage Assigned Judges"
                        >
                          + Panel
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewSub(sub)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                          title="View Submission Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'Shortlisted')}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400"
                          title="Mark Shortlisted"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'Finalist')}
                          className="p-1.5 rounded-lg bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400"
                          title="Mark Finalist"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub._id, 'Rejected')}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Reject Submission"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {viewSub && (
        <Modal
          isOpen={Boolean(viewSub)}
          onClose={() => setViewSub(null)}
          title={`Project Submission: ${viewSub.projectTitle}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="text-slate-400 block font-mono">Team</span>
                <span className="font-bold text-white text-base">{viewSub.team?.name} ({viewSub.team?.teamId})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Track</span>
                <span className="font-bold text-cyan-300">{viewSub.track?.title}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Status</span>
                <StatusBadge status={viewSub.status} />
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Average Evaluation Score</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {viewSub.averageScore > 0 ? `${viewSub.averageScore} / 100` : 'Not evaluated yet'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-cyan-400 uppercase font-bold mb-1">Problem Statement</h4>
              <p className="text-slate-300 leading-relaxed">{viewSub.problemStatement || 'None provided'}</p>
            </div>

            <div>
              <h4 className="font-mono text-cyan-400 uppercase font-bold mb-1">Project Description & Architecture</h4>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{viewSub.projectDescription}</p>
            </div>

            {viewSub.keyFeatures && viewSub.keyFeatures.length > 0 && (
              <div>
                <h4 className="font-mono text-purple-400 uppercase font-bold mb-1">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {viewSub.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {viewSub.technologyStack && viewSub.technologyStack.length > 0 && (
              <div>
                <h4 className="font-mono text-purple-400 uppercase font-bold mb-1">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewSub.technologyStack.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white/5 text-slate-300 font-mono text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links and Files */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              {viewSub.githubUrl && (
                <a
                  href={viewSub.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center space-x-1.5"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>GitHub Repo ↗</span>
                </a>
              )}
              {viewSub.liveDemoUrl && (
                <a
                  href={viewSub.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center space-x-1.5"
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Live Demo ↗</span>
                </a>
              )}
              {viewSub.documentationUrl && (
                <a
                  href={getImageUrl(viewSub.documentationUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Documentation PDF ↗</span>
                </a>
              )}
              {viewSub.pptUrl && (
                <a
                  href={getImageUrl(viewSub.pptUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Pitch Deck PPT ↗</span>
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Judges Panel Modal */}
      {assignModalSub && (
        <Modal
          isOpen={Boolean(assignModalSub)}
          onClose={() => setAssignModalSub(null)}
          title={`Assign Judges to: ${assignModalSub.projectTitle}`}
        >
          <form onSubmit={handleSaveJudges} className="space-y-4">
            <p className="text-xs text-slate-300">
              Select one or more qualified judges to evaluate this submission:
            </p>

            {judges.length === 0 ? (
              <p className="text-xs text-amber-400 italic">No judges created yet. Please create judges in the Judges section.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {judges.map((judge) => {
                  const isSelected = selectedJudgeIds.includes(judge._id);
                  return (
                    <div
                      key={judge._id}
                      onClick={() => toggleJudgeSelection(judge._id)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-xs text-white">{judge.name}</p>
                        <p className="text-[11px] text-slate-400">{judge.email} • {judge.designation || 'Judge'}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-cyan-500"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAssignModalSub(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingAssignment}
                className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs uppercase hover:bg-cyan-400 disabled:opacity-50"
              >
                {savingAssignment ? 'Saving...' : 'Save Panel Assignment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminSubmissions;
