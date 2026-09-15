import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Edit2, CheckCircle, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import { resultService, teamService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    awardTitle: '',
    category: 'Winner',
    teamId: '',
    rank: 1,
    prizeAmount: 25000,
    citation: '',
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const [resRes, teamRes] = await Promise.all([
        resultService.getAllAdmin(),
        teamService.getAllAdmin({ limit: 100 })
      ]);

      if (resRes.data) {
        setResults(resRes.data.results || []);
        setIsPublished(Boolean(resRes.data.isResultsPublished));
      }

      if (teamRes.data?.teams) {
        setTeams(teamRes.data.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const openCreateModal = () => {
    setEditingResult(null);
    setFormData({
      awardTitle: 'Grand Winner - 1st Place',
      category: 'Winner',
      teamId: teams[0]?._id || '',
      rank: 1,
      prizeAmount: 25000,
      citation: '',
      status: 'Published'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingResult) {
        await resultService.update(editingResult._id, formData);
      } else {
        await resultService.create(formData);
      }
      setModalOpen(false);
      fetchResults();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save award');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this award?')) {
      try {
        await resultService.delete(id);
        fetchResults();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleTogglePublish = async () => {
    const newStatus = !isPublished;
    try {
      await resultService.togglePublish(newStatus);
      setIsPublished(newStatus);
    } catch (err) {
      alert('Failed to toggle results publication');
    }
  };

  if (loading) return <Loader message="Loading award designations..." />;

  return (
    <div className="space-y-6 text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Awards & Results Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Designate podium champions and control public announcement release
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTogglePublish}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 border transition-all ${
              isPublished
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-neon-glow'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {isPublished ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
            <span>{isPublished ? 'RESULTS ARE LIVE ON PUBLIC SITE' : 'RESULTS ARE DRAFT (HIDDEN)'}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Designate Award</span>
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length === 0 ? (
          <div className="col-span-3 cyber-card p-12 text-center border border-white/10 text-slate-500 italic">
            No awards designated yet. Click "Designate Award" to crown podium teams.
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item._id}
              className="cyber-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    RANK #{item.rank}
                  </span>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-1">
                  {item.awardTitle}
                </h3>

                <p className="font-mono text-xs font-bold text-cyan-300 mb-2">
                  {item.team?.name} ({item.team?.teamId})
                </p>

                {item.prizeAmount > 0 && (
                  <div className="text-xl font-heading font-black text-amber-300 mb-2">
                    ₹{item.prizeAmount.toLocaleString()}
                  </div>
                )}

                {item.citation && (
                  <p className="text-xs text-slate-400 italic mb-4">
                    "{item.citation}"
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end space-x-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Designate Award */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Designate Hackathon Award"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Award Title *</label>
            <input
              type="text"
              value={formData.awardTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, awardTitle: e.target.value }))}
              required
              placeholder="e.g. Grand Winner or Best AI Innovation"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="Winner">Winner</option>
                <option value="1st Runner Up">1st Runner Up</option>
                <option value="2nd Runner Up">2nd Runner Up</option>
                <option value="Track Winner">Track Winner</option>
                <option value="Special Award">Special Award</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Rank</label>
              <input
                type="number"
                value={formData.rank}
                onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Winning Team *</label>
            <select
              value={formData.teamId}
              onChange={(e) => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
              required
              className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
            >
              <option value="">Select Team...</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>
                  {t.teamId} - {t.name} ({t.track?.title || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Prize Cash Amount (₹)</label>
            <input
              type="number"
              value={formData.prizeAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, prizeAmount: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Citation / Remarks</label>
            <textarea
              value={formData.citation}
              onChange={(e) => setFormData(prev => ({ ...prev, citation: e.target.value }))}
              rows={2}
              placeholder="Commendation citation for the project..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs uppercase hover:bg-cyan-400 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Award'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminResults;
