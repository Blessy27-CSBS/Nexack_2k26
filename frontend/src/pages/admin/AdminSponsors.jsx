import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { sponsorService, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const sponsorTiers = [
  'Title Sponsor', 'Gold Sponsor', 'Silver Sponsor',
  'Technology Partner', 'Community Partner', 'Media Partner'
];

const AdminSponsors = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technology Partner',
    website: '',
    description: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await sponsorService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Technology Partner',
      website: '',
      description: '',
      displayOrder: items.length + 1,
      status: 'Published'
    });
    setLogoFile(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || 'Technology Partner',
      website: item.website || '',
      description: item.description || '',
      displayOrder: item.displayOrder || 0,
      status: item.status || 'Published'
    });
    setLogoFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(k => payload.append(k, formData[k]));
      if (logoFile) payload.append('image', logoFile);

      if (editingItem) {
        await sponsorService.update(editingItem._id, payload);
      } else {
        await sponsorService.create(payload);
      }
      setModalOpen(false);
      fetchSponsors();
    } catch (err) {
      alert('Failed to save sponsor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sponsor?')) {
      try {
        await sponsorService.delete(id);
        fetchSponsors();
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
            Sponsor Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage partner logos, tier hierarchies, and sponsor landing links
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-slate-400">Loading sponsors...</div>
        ) : items.length === 0 ? (
          <div className="col-span-4 py-12 text-center text-slate-500 italic">No sponsors added yet.</div>
        ) : (
          items.map((s) => (
            <div key={s._id} className="cyber-card p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-16 flex items-center justify-center p-2 rounded-xl bg-white/[0.02] mb-3">
                  {s.logo ? (
                    <img src={getImageUrl(s.logo)} alt={s.name} className="max-h-12 max-w-full object-contain" />
                  ) : (
                    <span className="font-bold text-white text-sm">{s.name}</span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-1">{s.name}</h3>
                <span className="text-[10px] font-mono text-cyan-400 block mb-2">{s.category}</span>
                <div className="mb-3"><StatusBadge status={s.status} /></div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end space-x-2">
                <button onClick={() => openEdit(s)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(s._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Sponsor Partner">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase mb-1">Sponsor / Company Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Tier / Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white"
              >
                {sponsorTiers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://..."
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
              <label className="block font-mono uppercase mb-1">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-300"
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
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Sponsor'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSponsors;
