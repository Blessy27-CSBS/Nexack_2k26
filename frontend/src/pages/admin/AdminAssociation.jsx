import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { associationService, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const AdminAssociation = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: 'Computer Science & Business Systems',
    year: '3rd Year',
    bio: '',
    linkedin: '',
    github: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAssociation = async () => {
    setLoading(true);
    try {
      const res = await associationService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociation();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      position: 'President',
      department: 'Computer Science & Business Systems',
      year: '3rd Year',
      bio: '',
      linkedin: '',
      github: '',
      displayOrder: items.length + 1,
      status: 'Published'
    });
    setPhotoFile(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      position: item.position,
      department: item.department || 'Computer Science & Business Systems',
      year: item.year || '',
      bio: item.bio || '',
      linkedin: item.socialLinks?.linkedin || '',
      github: item.socialLinks?.github || '',
      displayOrder: item.displayOrder || 0,
      status: item.status || 'Published'
    });
    setPhotoFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(k => payload.append(k, formData[k]));
      if (photoFile) payload.append('image', photoFile);

      if (editingItem) {
        await associationService.update(editingItem._id, payload);
      } else {
        await associationService.create(payload);
      }
      setModalOpen(false);
      fetchAssociation();
    } catch (err) {
      alert('Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this association member?')) {
      try {
        await associationService.delete(id);
        fetchAssociation();
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
            Nexora Association Members
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage student office bearers, team leaders, and event organizers
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-slate-400">Loading members...</div>
        ) : items.length === 0 ? (
          <div className="col-span-4 py-12 text-center text-slate-500 italic">No association members added yet.</div>
        ) : (
          items.map((m) => (
            <div key={m._id} className="cyber-card p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-3 bg-white/5 border border-white/10">
                  {m.photo ? (
                    <img src={getImageUrl(m.photo)} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xl text-cyan-400 font-bold">{m.name.charAt(0)}</div>
                  )}
                </div>
                <h3 className="font-heading font-bold text-base text-white text-center">{m.name}</h3>
                <p className="text-xs text-cyan-300 font-mono uppercase text-center font-semibold mb-2">{m.position}</p>
                <div className="text-center mb-3"><StatusBadge status={m.status} /></div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end space-x-2">
                <button onClick={() => openEdit(m)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(m._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Association Member">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase mb-1">Full Name *</label>
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
              <label className="block font-mono uppercase mb-1">Position / Office *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                required
                placeholder="e.g. President, Tech Lead"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="3rd Year"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
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
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Member'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAssociation;
