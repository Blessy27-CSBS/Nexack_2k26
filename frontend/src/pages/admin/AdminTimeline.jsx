import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { timelineService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const AdminTimeline = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await timelineService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: 'March 27, 2026',
      time: '09:00 AM',
      description: '',
      displayOrder: items.length + 1,
      status: 'Published'
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      date: item.date,
      time: item.time || '',
      description: item.description || '',
      displayOrder: item.displayOrder || 0,
      status: item.status || 'Published'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await timelineService.update(editingItem._id, formData);
      } else {
        await timelineService.create(formData);
      }
      setModalOpen(false);
      fetchTimeline();
    } catch (err) {
      alert('Failed to save timeline stage');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this timeline stage?')) {
      try {
        await timelineService.delete(id);
        fetchTimeline();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Timeline Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Control milestones, stages, and date-times visible on the public schedule
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timeline Stage</span>
        </button>
      </div>

      <div className="cyber-card border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Stage Title</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="6" className="py-12 text-center text-slate-400">Loading timeline...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="6" className="py-12 text-center text-slate-500 italic">No timeline stages added yet.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{item.displayOrder}</td>
                  <td className="py-3 px-4 font-bold text-white text-sm">{item.title}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.date} {item.time && `• ${item.time}`}</td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{item.description}</td>
                  <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Timeline Stage">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase mb-1">Stage Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Hackathon Begins & Ideation Sprint"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Date *</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                placeholder="March 27, 2026"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-white/10 text-slate-400">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Stage'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTimeline;
