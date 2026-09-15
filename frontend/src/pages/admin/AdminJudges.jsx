import React, { useState, useEffect } from 'react';
import { Scale, Plus, Mail, Lock, User, Building, CheckCircle } from 'lucide-react';
import { judgeService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminJudges = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: '',
    organization: ''
  });
  const [creating, setCreating] = useState(false);

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const res = await judgeService.getAllJudges();
      if (res.data?.judges) {
        setJudges(res.data.judges);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  const handleCreateJudge = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await judgeService.createJudge(formData);
      setModalOpen(false);
      setFormData({ name: '', email: '', password: '', designation: '', organization: '' });
      fetchJudges();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create judge');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Judge Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Provision judge accounts with secure evaluation permissions
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Judge Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">
            Loading judges...
          </div>
        ) : judges.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500 italic">
            No judges created yet. Click "Create Judge Account" to invite an evaluator.
          </div>
        ) : (
          judges.map((judge) => (
            <div
              key={judge._id}
              className="cyber-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono">
                    {judge.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    Role: Judge
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  {judge.name}
                </h3>
                <p className="text-xs text-cyan-400 font-medium">
                  {judge.designation || 'Specialist Judge'}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {judge.organization || 'Industry Partner'}
                </p>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{judge.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Create Judge */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Judge Account"
      >
        <form onSubmit={handleCreateJudge} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="e.g. Dr. Sarah Connor"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="judge@company.com"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Set Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                placeholder="Senior Architect"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Organization</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Tech Company"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs uppercase hover:bg-cyan-400 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Judge Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminJudges;
