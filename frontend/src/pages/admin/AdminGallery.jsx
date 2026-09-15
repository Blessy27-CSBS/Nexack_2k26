import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Edit2, CheckCircle2, XCircle, Upload, Eye } from 'lucide-react';
import { galleryService, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const CATEGORIES = ['All', 'Hackathon', 'Workshops', 'Awards', 'Campus', 'Keynotes'];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Hackathon',
    eventYear: '2K26',
    isFeatured: false,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await galleryService.getAll();
      setItems(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to load gallery items' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      caption: '',
      category: 'Hackathon',
      eventYear: '2K26',
      isFeatured: false,
      isActive: true,
    });
    setImageFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'Hackathon',
      eventYear: item.eventYear || '2K26',
      isFeatured: !!item.isFeatured,
      isActive: item.isActive !== false,
    });
    setImageFile(null);
    setPreviewUrl(getImageUrl(item.imageUrl));
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !imageFile) {
      setActionMsg({ type: 'error', text: 'Please select an image file to upload' });
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('caption', formData.caption);
      data.append('category', formData.category);
      data.append('eventYear', formData.eventYear);
      data.append('isFeatured', formData.isFeatured);
      data.append('isActive', formData.isActive);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingItem) {
        await galleryService.update(editingItem._id, data);
        setActionMsg({ type: 'success', text: 'Gallery item updated successfully' });
      } else {
        await galleryService.create(data);
        setActionMsg({ type: 'success', text: 'Gallery item added successfully' });
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      await galleryService.delete(id);
      setActionMsg({ type: 'success', text: 'Gallery photo deleted' });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to delete item' });
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-100 flex items-center gap-3">
            <Image className="w-7 h-7 text-cyan-400" /> Gallery Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Upload event memories, photos, and highlight moments</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {actionMsg.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            actionMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
          }`}
        >
          <span>{actionMsg.text}</span>
          <button onClick={() => setActionMsg({ type: '', text: '' })} className="hover:opacity-70">✕</button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading gallery..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No gallery photos found"
          description="Upload event memories and highlights to showcase the hackathon energy."
          actionText="Upload Photo"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden group hover:border-cyan-500/40 transition duration-300 flex flex-col"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title || 'Gallery item'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/80 backdrop-blur-md text-black">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm line-clamp-1">{item.title || 'Untitled Photo'}</h3>
                  {item.caption && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.caption}</p>}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500">{item.eventYear || '2K26'}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Title / Label
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Grand Finale Judging Round"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Workshops">Workshops</option>
              <option value="Awards">Awards</option>
              <option value="Campus">Campus</option>
              <option value="Keynotes">Keynotes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Photo Upload
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center cursor-pointer relative bg-slate-950/40 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {previewUrl ? (
                <div className="relative aspect-video max-h-40 mx-auto rounded-lg overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-xs text-slate-400">Click to browse or drag and drop photo</p>
                  <p className="text-[11px] text-slate-600 mt-1">PNG, JPG, WebP up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Caption (Optional)
            </label>
            <textarea
              rows="3"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Provide context or highlight of this photo..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Event Edition / Year
              </label>
              <input
                type="text"
                value={formData.eventYear}
                onChange={(e) => setFormData({ ...formData, eventYear: e.target.value })}
                placeholder="2K26"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300 font-medium">Highlight / Feature</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload Photo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
