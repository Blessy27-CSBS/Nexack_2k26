import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, CheckCircle2, Search, Clock, User, Archive, RefreshCw, Eye, MessageSquare, Send, Check } from 'lucide-react';
import { contactService } from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const STATUSES = ['All', 'Unread', 'Read', 'Replied', 'Archived'];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAllAdmin();
      // Handle array or wrapped response object
      const data = res.data?.messages || res.data?.items || (Array.isArray(res.data) ? res.data : []);
      setMessages(data);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to load contact messages' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (msgId, newStatus) => {
    try {
      setIsUpdating(true);
      await contactService.updateStatus(msgId, newStatus);
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msgId
            ? {
                ...m,
                status: newStatus,
                isRead: newStatus !== 'Unread',
                replied: newStatus === 'Replied'
              }
            : m
        )
      );
      if (selectedMessage && selectedMessage._id === msgId) {
        setSelectedMessage((prev) => ({
          ...prev,
          status: newStatus,
          isRead: newStatus !== 'Unread',
          replied: newStatus === 'Replied'
        }));
      }
      setActionMsg({ type: 'success', text: `Message marked as ${newStatus}` });
      setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead || msg.status === 'Unread') {
      handleStatusChange(msg._id, 'Read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      await contactService.delete(id);
      setActionMsg({ type: 'success', text: 'Message deleted successfully' });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setActionMsg({ type: 'error', text: 'Failed to delete message' });
    }
  };

  const filteredMessages = messages.filter((m) => {
    const statusMatch = activeTab === 'All' ? true : (m.status || (m.isRead ? 'Read' : 'Unread')) === activeTab;
    const q = searchTerm.toLowerCase();
    const searchMatch =
      !searchTerm ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status, isRead) => {
    const currentStatus = status || (isRead ? 'Read' : 'Unread');
    switch (currentStatus) {
      case 'Unread':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            Unread
          </span>
        );
      case 'Read':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">
            Read
          </span>
        );
      case 'Replied':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Replied
          </span>
        );
      case 'Archived':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const unreadCount = messages.filter((m) => (m.status === 'Unread' || (!m.status && !m.isRead))).length;

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-space text-slate-100 flex items-center gap-3">
            <Mail className="w-7 h-7 text-cyan-400" /> Contact Inquiries & Messages
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Inquiries and queries submitted via the public contact form</p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 self-start md:self-auto transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Notification */}
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

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          {STATUSES.map((status) => {
            const count = status === 'All' 
              ? messages.length 
              : messages.filter((m) => (m.status || (m.isRead ? 'Read' : 'Unread')) === status).length;
            const isActive = activeTab === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setActiveTab(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{status}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <Loader text="Loading inquiries..." />
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No messages yet.</p>
          <p className="text-slate-500 text-xs mt-1">Inquiries submitted via the Contact page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredMessages.map((msg) => {
              const currentStatus = msg.status || (msg.isRead ? 'Read' : 'Unread');
              const isUnread = currentStatus === 'Unread';

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-5 rounded-2xl border transition duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isUnread
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5 hover:border-cyan-500/70'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                        isUnread ? 'bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm md:text-base font-semibold ${isUnread ? 'text-slate-100 font-bold' : 'text-slate-300'}`}>
                          {msg.name}
                        </h3>
                        <span className="text-slate-500 text-xs font-mono">&lt;{msg.email}&gt;</span>
                        {getStatusBadge(msg.status, msg.isRead)}
                      </div>
                      <h4 className="text-slate-200 text-sm font-medium">{msg.subject || '(No subject)'}</h4>
                      <p className="text-slate-400 text-xs line-clamp-1">{msg.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-xs text-slate-500 whitespace-nowrap font-mono">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg._id);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title="Inquiry Details"
        >
          <div className="space-y-4">
            {/* Sender Metadata Box */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Sender</span>
                <span className="text-slate-200 font-medium">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Email</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-cyan-400 hover:underline font-mono text-xs"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Date Received</span>
                <span className="text-slate-400 text-xs font-mono">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Current Status</span>
                <div>{getStatusBadge(selectedMessage.status, selectedMessage.isRead)}</div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Subject
              </h4>
              <p className="text-slate-100 font-semibold text-base">{selectedMessage.subject || '(No subject)'}</p>
            </div>

            {/* Full Message */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Message Body
              </h4>
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions: Mark Status */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Update Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMessage._id, 'Unread')}
                  disabled={isUpdating || selectedMessage.status === 'Unread'}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition disabled:opacity-40"
                >
                  Mark as Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMessage._id, 'Read')}
                  disabled={isUpdating || selectedMessage.status === 'Read'}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition disabled:opacity-40"
                >
                  Mark as Read
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMessage._id, 'Replied')}
                  disabled={isUpdating || selectedMessage.status === 'Replied'}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition disabled:opacity-40"
                >
                  Mark as Replied
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedMessage._id, 'Archived')}
                  disabled={isUpdating || selectedMessage.status === 'Archived'}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 transition disabled:opacity-40"
                >
                  Archive
                </button>
              </div>
            </div>

            {/* Footer Delete and Reply Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage._id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'NEXACK 2K26 Inquiry')}`}
                onClick={() => handleStatusChange(selectedMessage._id, 'Replied')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
