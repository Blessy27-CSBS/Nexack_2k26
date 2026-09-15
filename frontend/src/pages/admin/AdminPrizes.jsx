import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2 } from 'lucide-react';
import { prizeService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const AdminPrizes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Winner',
    amount: 0,
    description: '',
    benefits: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);

  const fetchPrizes = async () => {
    setLoading(true);
    try {
      const res = await prizeService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Winner',
      amount: 15000,
      description: '',
      benefits: 'Cash Prize, Winner Trophy, Certificate of Excellence',
      displayOrder: items.length + 1,
      status: 'Published'
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category || 'Winner',
      amount: item.amount || 0,
      description: item.description || '',
      benefits: Array.isArray(item.benefits) ? item.benefits.join(', ') : '',
      displayOrder: item.displayOrder || 0,
      status: item.status || 'Published'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
      };

      if (editingItem) {
        await prizeService.update(editingItem._id, payload);
      } else {
        await prizeService.create(payload);
      }
      setModalOpen(false);
      fetchPrizes();
    } catch (err) {
      alert('Failed to save prize');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this prize?')) {
      try {
        await prizeService.delete(id);
        fetchPrizes();
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
            Prize Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage rewards, cash prizes, certificates, and trophy categories
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prize</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading prizes...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500 italic">No prizes created yet.</div>
        ) : (
          items.map((prize) => (
            <div key={prize._id} className="cyber-card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{prize.category}</span>
                  <StatusBadge status={prize.status} />
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-1">{prize.title}</h3>
                {prize.amount > 0 && (
                  <div className="text-2xl font-black text-amber-300 font-heading mb-3">₹{prize.amount.toLocaleString()}</div>
                )}
                <p className="text-xs text-slate-400 mb-4">{prize.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end space-x-2">
                <button onClick={() => openEdit(prize)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(prize._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Prize Record">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase mb-1">Prize Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Winner, Best AI Solution"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Winner / Special Award"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Prize Cash Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
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

          <div>
            <label className="block font-mono uppercase mb-1">Perks & Benefits (Comma-separated)</label>
            <input
              type="text"
              value={formData.benefits}
              onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
              placeholder="Certificate, Trophy, Direct Interview Opportunity"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
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
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Prize'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPrizes;
