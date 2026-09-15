import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { teamService, trackService, getImageUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminRegistrations = () => {
  const [teams, setTeams] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [regStatus, setRegStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal View
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await teamService.getAllAdmin({
        page: currentPage,
        limit: 15,
        search,
        track: selectedTrack,
        paymentStatus,
        registrationStatus: regStatus
      });

      if (res.data?.success) {
        setTeams(res.data.teams);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTracksList = async () => {
      try {
        const res = await trackService.getAllAdmin();
        if (res.data?.tracks) setTracks(res.data.tracks);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTracksList();
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [currentPage, selectedTrack, paymentStatus, regStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTeams();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await teamService.updateRegistrationStatus(id, { status });
      fetchTeams();
      if (selectedTeam && selectedTeam._id === id) {
        setSelectedTeam(prev => ({ ...prev, registrationStatus: status }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this team and its participant accounts?')) {
      try {
        await teamService.deleteTeam(id);
        fetchTeams();
        setSelectedTeam(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const exportToExcel = () => {
    const exportData = teams.map(t => ({
      'Team ID': t.teamId,
      'Team Name': t.name,
      'Track': t.track?.title || 'N/A',
      'Leader Name': t.leader?.name || '',
      'Leader Email': t.leader?.email || '',
      'Leader Phone': t.leader?.phone || '',
      'College': t.leader?.college || '',
      'Department': t.leader?.department || '',
      'Year': t.leader?.year || '',
      'Member Count': (t.members?.length || 0) + 1,
      'Members': t.members?.map(m => `${m.name} (${m.email})`).join('; ') || '',
      'Registration Status': t.registrationStatus,
      'Payment Status': t.paymentStatus,
      'Transaction ID': t.paymentTransactionId || '',
      'Registered At': new Date(t.createdAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `NEXACK_Registrations_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Team Registrations
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {pagination.total} registered teams total
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export to Excel</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="cyber-card p-4 border border-white/10 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Team ID, Team Name, or UTR..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
          />
        </form>

        <select
          value={selectedTrack}
          onChange={(e) => { setSelectedTrack(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
        >
          <option value="">All Tracks</option>
          {tracks.map(t => (
            <option key={t._id} value={t._id}>Track #{t.trackNumber} - {t.title}</option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
        >
          <option value="">All Payment Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Proof Uploaded">Proof Uploaded</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={regStatus}
          onChange={(e) => { setRegStatus(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-xs focus:outline-none"
        >
          <option value="">All Registration Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Team ID</th>
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Leader & College</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Members</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Loading registrations...
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 italic">
                    No team registrations found matching your criteria.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {team.teamId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {team.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{team.leader?.name || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{team.leader?.college}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">
                      {team.track?.title || 'General'}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {(team.members ? team.members.length : 0) + 1}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={team.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={team.registrationStatus} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedTeam(team)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(team._id, 'Verified')}
                          title="Approve / Verify"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(team._id, 'Rejected')}
                          title="Reject"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team._id)}
                          title="Delete Team"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Page {pagination.page} of {pagination.pages}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
                className="p-1.5 rounded-lg bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <Modal
          isOpen={Boolean(selectedTeam)}
          onClose={() => setSelectedTeam(null)}
          title={`Team Details: ${selectedTeam.teamId}`}
        >
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="text-slate-400 block font-mono">Team Name</span>
                <span className="font-bold text-white text-base">{selectedTeam.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Track</span>
                <span className="font-bold text-cyan-300">{selectedTeam.track?.title || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Registration Status</span>
                <StatusBadge status={selectedTeam.registrationStatus} />
              </div>
              <div>
                <span className="text-slate-400 block font-mono">Payment Status</span>
                <StatusBadge status={selectedTeam.paymentStatus} />
              </div>
            </div>

            {/* Leader Details */}
            <div>
              <h4 className="font-mono text-cyan-400 uppercase font-bold mb-2">Team Leader</h4>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-white font-semibold">{selectedTeam.leader?.name}</p>
                <p className="text-slate-400">{selectedTeam.leader?.email} • {selectedTeam.leader?.phone}</p>
                <p className="text-slate-400">{selectedTeam.leader?.college} - {selectedTeam.leader?.department} ({selectedTeam.leader?.year})</p>
              </div>
            </div>

            {/* Squad Members */}
            <div>
              <h4 className="font-mono text-purple-400 uppercase font-bold mb-2">Squad Members</h4>
              <div className="space-y-2">
                {selectedTeam.members && selectedTeam.members.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-white font-medium">{m.name} ({m.email})</p>
                    <p className="text-slate-400 text-xs">{m.phone} • {m.department} ({m.college})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Proof Preview if any */}
            {selectedTeam.paymentProofUrl && (
              <div>
                <h4 className="font-mono text-emerald-400 uppercase font-bold mb-2">Payment Proof Screenshot</h4>
                <a href={getImageUrl(selectedTeam.paymentProofUrl)} target="_blank" rel="noreferrer">
                  <img
                    src={getImageUrl(selectedTeam.paymentProofUrl)}
                    alt="Payment Proof"
                    className="h-48 rounded-xl object-contain bg-black border border-white/10"
                  />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminRegistrations;
