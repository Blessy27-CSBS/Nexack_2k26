import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Eye, Shield, CheckCircle, XCircle } from 'lucide-react';
import { teamService, trackService } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await teamService.getAllAdmin({ search, limit: 50 });
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
    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeams();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team and all linked member accounts?')) {
      try {
        await teamService.deleteTeam(id);
        fetchTeams();
        setSelectedTeam(null);
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
            Team Squads Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Direct access to roster structures, track selections, and team configurations
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400">Loading squads...</div>
        ) : teams.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-500 italic">No teams registered yet.</div>
        ) : (
          teams.map((team) => (
            <div
              key={team._id}
              className="cyber-card p-6 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    {team.teamId}
                  </span>
                  <StatusBadge status={team.registrationStatus} />
                </div>

                <h3 className="font-heading font-bold text-xl text-white mb-1">
                  {team.name}
                </h3>
                <p className="text-xs font-mono text-purple-300 mb-3">
                  Track: {team.track?.title || 'General'}
                </p>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1 text-xs mb-4">
                  <p className="text-slate-300"><strong>Leader:</strong> {team.leader?.name}</p>
                  <p className="text-slate-400 text-[11px]">{team.leader?.college}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{team.members ? team.members.length + 1 : 1} Members</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Roster</span>
                </button>

                <button
                  onClick={() => handleDelete(team._id)}
                  className="p-1.5 text-slate-400 hover:text-red-400"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTeam && (
        <Modal
          isOpen={Boolean(selectedTeam)}
          onClose={() => setSelectedTeam(null)}
          title={`Team Roster: ${selectedTeam.teamId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <span className="font-bold text-white text-sm block">{selectedTeam.name}</span>
              <span className="text-cyan-300 font-mono">Track: {selectedTeam.track?.title}</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono text-slate-400 uppercase font-bold">Team Members:</h4>
              <div className="p-3 bg-white/5 rounded-lg">
                <span className="font-bold text-white block">{selectedTeam.leader?.name} (Leader)</span>
                <span className="text-slate-400">{selectedTeam.leader?.email} • {selectedTeam.leader?.phone}</span>
              </div>
              {selectedTeam.members && selectedTeam.members.map((m, idx) => (
                <div key={idx} className="p-3 bg-white/5 rounded-lg">
                  <span className="font-medium text-white block">{m.name}</span>
                  <span className="text-slate-400">{m.email} • {m.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTeams;
