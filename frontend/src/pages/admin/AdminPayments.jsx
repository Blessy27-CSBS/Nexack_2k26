import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Eye, Search, ExternalLink, AlertCircle } from 'lucide-react';
import { teamService, getImageUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminPayments = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Proof Uploaded');
  const [search, setSearch] = useState('');

  // Rejection modal
  const [rejectModalTeam, setRejectModalTeam] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Proof viewer modal
  const [viewProofUrl, setViewProofUrl] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await teamService.getAllAdmin({
        paymentStatus: filter,
        search
      });
      if (res.data?.teams) {
        setTeams(res.data.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const handleApprove = async (teamId) => {
    try {
      await teamService.updatePaymentStatus(teamId, { status: 'Verified' });
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalTeam) return;

    try {
      await teamService.updatePaymentStatus(rejectModalTeam._id, {
        status: 'Rejected',
        rejectionReason
      });
      setRejectModalTeam(null);
      setRejectionReason('');
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
          Payment Verification Desk
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Review uploaded transaction receipts and reconcile UPI transactions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {['Proof Uploaded', 'Pending', 'Verified', 'Rejected', ''].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              filter === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab || 'All Payments'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Leader & College</th>
                <th className="py-3 px-4">Transaction UTR</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading payments...
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 italic">
                    No payment records found under this filter.
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-cyan-400">{team.teamId}</div>
                      <div className="font-semibold text-white">{team.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{team.leader?.name || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{team.leader?.college}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {team.paymentTransactionId || <span className="text-slate-500 italic">None provided</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                      ₹{team.paymentAmount || 400}
                    </td>
                    <td className="py-3 px-4">
                      {team.paymentProofUrl ? (
                        <button
                          onClick={() => setViewProofUrl(getImageUrl(team.paymentProofUrl))}
                          className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-[11px] flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No file</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={team.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(team._id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-semibold text-xs flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => {
                            setRejectModalTeam(team);
                            setRejectionReason('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold text-xs flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Viewer Lightbox Modal */}
      {viewProofUrl && (
        <Modal
          isOpen={Boolean(viewProofUrl)}
          onClose={() => setViewProofUrl('')}
          title="Payment Proof Screenshot"
        >
          <div className="text-center">
            <img
              src={viewProofUrl}
              alt="Payment Screenshot"
              className="max-h-[65vh] mx-auto rounded-xl border border-white/10 object-contain bg-black"
            />
            <div className="mt-4">
              <a
                href={viewProofUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Open in full resolution</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectModalTeam && (
        <Modal
          isOpen={Boolean(rejectModalTeam)}
          onClose={() => setRejectModalTeam(null)}
          title={`Reject Payment: ${rejectModalTeam.teamId}`}
        >
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <p className="text-xs text-slate-300">
              Provide a clear reason for rejecting this payment proof. The team leader will see this explanation on their dashboard and can submit a new receipt.
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                rows={3}
                placeholder="e.g. Transaction UTR does not match our bank statement, or screenshot is blurry."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500/50"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalTeam(null)}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-500 text-black font-bold text-xs uppercase hover:bg-red-400"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminPayments;
