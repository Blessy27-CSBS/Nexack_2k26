import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { ruleService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const ruleCategories = [
  'Eligibility', 'Team Size', 'Team Formation', 'Project Requirements',
  'Originality', 'AI Usage', 'Open Source Usage', 'Submission',
  'Code Repository', 'Presentation', 'Judging', 'Code of Conduct',
  'Plagiarism', 'Intellectual Property', 'Disqualification', 'Late Submission', 'General'
];

const AdminRules = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Eligibility',
    title: '',
    description: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await ruleService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      category: 'Eligibility',
      title: '',
      description: '',
      displayOrder: items.length + 1,
      status: 'Published'
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      category: item.category || 'General',
      title: item.title,
      description: item.description,
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
        await ruleService.update(editingItem._id, formData);
      } else {
        await ruleService.create(formData);
      }
      setModalOpen(false);
      fetchRules();
    } catch (err) {
      alert('Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this rule?')) {
      try {
        await ruleService.delete(id);
        fetchRules();
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
            Rules & Code of Conduct
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Define compliance criteria, ethics, originality checks, and judging guidelines
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      <div className="cyber-card border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
            <tr>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Rule Title</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="5" className="py-12 text-center text-slate-400">Loading rules...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan="5" className="py-12 text-center text-slate-500 italic">No rules defined yet.</td></tr>
            ) : (
              items.map((rule) => (
                <tr key={rule._id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{rule.category}</td>
                  <td className="py-3 px-4 font-bold text-white text-sm">{rule.title}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-sm truncate">{rule.description}</td>
                  <td className="py-3 px-4"><StatusBadge status={rule.status} /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openEdit(rule)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(rule._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Rule / Guideline">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white"
              >
                {ruleCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase mb-1">Rule Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g. Code Originality & AI Usage Policy"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block font-mono uppercase mb-1">Rule Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              placeholder="Specific terms and conditions for this rule..."
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

          <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-white/10 text-slate-400">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Rule'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRules;
