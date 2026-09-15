import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { faqsService } from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const CATEGORIES = ['All', 'General', 'Registration', 'Tracks', 'Submissions', 'Evaluation', 'Logistics'];

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await faqsService.getAll();
      setFaqs(res.data.items || res.data || []);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to load FAQs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      order: faqs.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      order: faq.order || 0,
      isActive: faq.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingFaq) {
        await faqsService.update(editingFaq._id, formData);
        setActionMsg({ type: 'success', text: 'FAQ updated successfully' });
      } else {
        await faqsService.create(formData);
        setActionMsg({ type: 'success', text: 'FAQ added successfully' });
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqsService.delete(id);
      setActionMsg({ type: 'success', text: 'FAQ deleted' });
      setFaqs((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to delete FAQ' });
    }
  };

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-100 flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-cyan-400" /> FAQ Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage participant help queries and category answers</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add FAQ
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

      {/* Category filter pills */}
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
        <Loader text="Loading FAQs..." />
      ) : filteredFaqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No FAQs found"
          description="Create frequently asked questions to resolve team queries proactively."
          actionText="Add First FAQ"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq._id;
            return (
              <div
                key={faq._id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition"
              >
                <div
                  onClick={() => setExpandedId(isOpen ? null : faq._id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {faq.category || 'General'}
                    </span>
                    <h3 className="font-semibold text-slate-100 text-sm md:text-base">{faq.question}</h3>
                    {!faq.isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">Draft</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(faq)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isOpen ? null : faq._id)}
                      className="p-1.5 text-slate-400 hover:text-slate-200"
                    >
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 whitespace-pre-line bg-slate-950/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="General">General</option>
              <option value="Registration">Registration</option>
              <option value="Tracks">Tracks</option>
              <option value="Submissions">Submissions</option>
              <option value="Evaluation">Evaluation</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Question
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. Can participants from different colleges form a team?"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Answer
            </label>
            <textarea
              rows="5"
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide clear, concise answer..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300 font-medium">Active (Visible to public)</span>
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
              {submitting ? 'Saving...' : editingFaq ? 'Save Changes' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
