import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { announcementsService } from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    isActive: true,
    linkText: '',
    linkUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementsService.getAll();
      setAnnouncements(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to load announcements' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      isActive: true,
      linkText: '',
      linkUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      priority: item.priority || 'normal',
      isActive: item.isActive !== false,
      linkText: item.linkText || '',
      linkUrl: item.linkUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingItem) {
        await announcementsService.update(editingItem._id, formData);
        setActionMsg({ type: 'success', text: 'Announcement updated successfully' });
      } else {
        await announcementsService.create(formData);
        setActionMsg({ type: 'success', text: 'Announcement broadcasted successfully' });
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementsService.delete(id);
      setActionMsg({ type: 'success', text: 'Announcement deleted' });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to delete announcement' });
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">Urgent Alert</span>;
      case 'low':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-400 border border-slate-700">Notice</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-100 flex items-center gap-3">
            <Bell className="w-7 h-7 text-cyan-400" /> Announcements & Alerts
          </h1>
          <p className="text-slate-400 text-sm mt-1">Broadcast real-time notices, milestone deadlines, and emergency alerts</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> New Announcement
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

      {loading ? (
        <Loader text="Loading announcements..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No announcements published yet"
          description="Broadcast important schedule changes, mentor office hours, or submission reminders to participants."
          actionText="Create Announcement"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    {getPriorityBadge(item.priority)}
                    <h3 className="text-slate-100 font-semibold text-base">{item.title}</h3>
                    {!item.isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">Draft / Hidden</span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{item.content}</p>

                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline pt-1"
                    >
                      {item.linkText || 'Learn more &rarr;'}
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-slate-500 text-xs pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt || item.publishedAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        title={editingItem ? 'Edit Announcement' : 'Post Announcement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mentor Review Session Starts at 4:00 PM"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="low">Low / Notice</option>
                <option value="normal">Normal / General</option>
                <option value="urgent">Urgent / Alert</option>
              </select>
            </div>
            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300 font-medium">Active (Visible on site)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Content / Notice Details
            </label>
            <textarea
              rows="4"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Explain details, booth locations, Discord links, or requirements..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Link Text (Optional)
              </label>
              <input
                type="text"
                value={formData.linkText}
                onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                placeholder="e.g. Join Google Meet"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Link URL (Optional)
              </label>
              <input
                type="url"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
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
              {submitting ? 'Posting...' : editingItem ? 'Save Changes' : 'Broadcast Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
