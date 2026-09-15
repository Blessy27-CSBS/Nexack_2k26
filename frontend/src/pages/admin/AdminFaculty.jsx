import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { facultyService, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const AdminFaculty = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'Department of Computer Science & Business Systems',
    email: '',
    phone: '',
    bio: '',
    displayOrder: 0,
    status: 'Published'
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyService.getAllAdmin();
      if (res.data?.items) setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      designation: 'Assistant Professor',
      department: 'Department of Computer Science & Business Systems',
      email: '',
      phone: '',
      bio: '',
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
      designation: item.designation,
      department: item.department,
      email: item.email || '',
      phone: item.phone || '',
      bio: item.bio || '',
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
        await facultyService.update(editingItem._id, payload);
      } else {
        await facultyService.create(payload);
      }
      setModalOpen(false);
      fetchFaculty();
    } catch (err) {
      alert('Failed to save faculty coordinator');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this faculty coordinator?')) {
      try {
        await facultyService.delete(id);
        fetchFaculty();
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
            Faculty Coordinators
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage department faculty mentors and organizing staff coordinators
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Coordinator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading coordinators...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500 italic">No faculty coordinators added yet.</div>
        ) : (
          items.map((f) => (
            <div key={f._id} className="cyber-card p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-3 bg-white/5 border border-white/10">
                  {f.photo ? (
                    <img src={getImageUrl(f.photo)} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xl text-purple-400 font-bold">{f.name.charAt(0)}</div>
                  )}
                </div>
                <h3 className="font-heading font-bold text-lg text-white text-center">{f.name}</h3>
                <p className="text-xs text-purple-300 text-center">{f.designation}</p>
                <p className="text-xs text-slate-400 text-center mb-3">{f.department}</p>
                <div className="text-center mb-3"><StatusBadge status={f.status} /></div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-end space-x-2">
                <button onClick={() => openEdit(f)} className="p-1.5 text-slate-300 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(f._id)} className="p-1.5 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Faculty Coordinator">
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
              <label className="block font-mono uppercase mb-1">Designation *</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono uppercase mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block font-mono uppercase mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                className="w-full text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300"
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
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold uppercase">{saving ? 'Saving...' : 'Save Coordinator'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFaculty;
