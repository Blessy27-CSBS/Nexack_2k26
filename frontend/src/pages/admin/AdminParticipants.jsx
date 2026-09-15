import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Mail, Phone, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/api';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const AdminParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await adminService.getParticipants({ page, limit: 25, search });
      if (res.data?.success) {
        setParticipants(res.data.participants);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchParticipants();
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Participant Directory
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {pagination.total} registered individual participants across all hackathon squads
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by participant name, email, or college..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
          />
        </form>
      </div>

      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">College & Dept</th>
                <th className="py-3 px-4">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Loading directory...</td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 italic">No participants found.</td>
                </tr>
              ) : (
                participants.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {p.isLeader ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                          Leader
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Member</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {p.email}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {p.phone}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{p.college}</div>
                      <div className="text-[11px] text-slate-400">{p.department} ({p.year})</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 whitespace-nowrap">
                      {p.teamId?.name ? `${p.teamId.name} (${p.teamId.teamId})` : 'Unassigned'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Page {pagination.page} of {pagination.pages}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={page === pagination.pages}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminParticipants;
