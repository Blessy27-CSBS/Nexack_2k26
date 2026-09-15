import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { trackService, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const AdminTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    trackNumber: 1,
    title: '',
    shortDescription: '',
    detailedDescription: '',
    problemAreas: '',
    suggestedTechnologies: '',
    icon: 'Cpu',
    displayOrder: 0,
    status: 'Published'
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const res = await trackService.getAllAdmin();
      if (res.data?.tracks) {
        setTracks(res.data.tracks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const openCreateModal = () => {
    setEditingTrack(null);
    setFormData({
      trackNumber: tracks.length + 1,
      title: '',
      shortDescription: '',
      detailedDescription: '',
      problemAreas: '',
      suggestedTechnologies: '',
      icon: 'Cpu',
      displayOrder: tracks.length + 1,
      status: 'Published'
    });
    setBannerFile(null);
    setModalOpen(true);
  };

  const openEditModal = (track) => {
    setEditingTrack(track);
    setFormData({
      trackNumber: track.trackNumber,
      title: track.title,
      shortDescription: track.shortDescription,
      detailedDescription: track.detailedDescription || '',
      problemAreas: Array.isArray(track.problemAreas) ? track.problemAreas.join(', ') : '',
      suggestedTechnologies: Array.isArray(track.suggestedTechnologies) ? track.suggestedTechnologies.join(', ') : '',
      icon: track.icon || 'Cpu',
      displayOrder: track.displayOrder || 0,
      status: track.status || 'Published'
    });
    setBannerFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      if (bannerFile) {
        payload.append('banner', bannerFile);
      }

      if (editingTrack) {
        await trackService.update(editingTrack._id, payload);
      } else {
        await trackService.create(payload);
      }

      setModalOpen(false);
      fetchTracks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save track');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      try {
        await trackService.delete(id);
        fetchTracks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete track');
      }
    }
  };

  const toggleStatus = async (track) => {
    const newStatus = track.status === 'Published' ? 'Unpublished' : 'Published';
    try {
      const payload = new FormData();
      payload.append('status', newStatus);
      await trackService.update(track._id, payload);
      fetchTracks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Track Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage challenge domains, problem areas, and publication status
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Track</span>
        </button>
      </div>

      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Track Title</th>
                <th className="py-3 px-4">Problem Areas</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading tracks...
                  </td>
                </tr>
              ) : tracks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 italic">
                    No tracks created yet. Click "Add New Track" above to create one.
                  </td>
                </tr>
              ) : (
                tracks.map((track) => (
                  <tr key={track._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      #{track.trackNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{track.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{track.shortDescription}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {track.problemAreas && track.problemAreas.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">{track.displayOrder}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(track)}
                        title="Click to toggle publish status"
                      >
                        <StatusBadge status={track.status} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(track)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(track._id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal Create/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTrack ? `Edit Track: #${formData.trackNumber}` : 'Create New Hackathon Track'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Track Number *</label>
              <input
                type="number"
                value={formData.trackNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, trackNumber: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Track Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Artificial Intelligence & Machine Learning"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Short Description *</label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              required
              rows={2}
              placeholder="Brief summary for track card..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Detailed Description & Scope</label>
            <textarea
              value={formData.detailedDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
              rows={3}
              placeholder="Complete overview for the track details page..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Focus Problem Areas (Comma-separated)</label>
            <input
              type="text"
              value={formData.problemAreas}
              onChange={(e) => setFormData(prev => ({ ...prev, problemAreas: e.target.value }))}
              placeholder="Automated Diagnosis, Patient Monitoring, Clinical Decision Systems"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Suggested Tech Stack (Comma-separated)</label>
            <input
              type="text"
              value={formData.suggestedTechnologies}
              onChange={(e) => setFormData(prev => ({ ...prev, suggestedTechnologies: e.target.value }))}
              placeholder="Python, PyTorch, React, Fastify, Docker"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300"
              />
            </div>
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
              {saving ? 'Saving...' : 'Save Track'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTracks;
