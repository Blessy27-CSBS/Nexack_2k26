import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, Save, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teamService, trackService } from '../services/api';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { user, isParticipant } = useAuth();

  const [team, setTeam] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Editable fields
  const [teamName, setTeamName] = useState('');
  const [trackId, setTrackId] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!user || !isParticipant) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const [teamRes, tracksRes] = await Promise.all([
          teamService.getMyTeam(),
          trackService.getPublished()
        ]);

        if (teamRes.data?.team) {
          const t = teamRes.data.team;
          setTeam(t);
          setTeamName(t.name);
          setTrackId(t.track?._id || '');
          setMembers(t.members || []);
        }

        if (tracksRes.data?.tracks) {
          setTracks(tracksRes.data.tracks);
        }
      } catch (err) {
        console.error('Failed to load team squad:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, isParticipant, navigate]);

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addMember = () => {
    if (members.length < 3) {
      setMembers(prev => [
        ...prev,
        {
          name: '',
          email: '',
          phone: '',
          college: team?.leader?.college || '',
          department: team?.leader?.department || '',
          year: '3rd Year',
          github: '',
          linkedin: ''
        }
      ]);
    }
  };

  const removeMember = (index) => {
    setMembers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await teamService.updateMyTeam({
        name: teamName,
        trackId,
        members
      });

      if (res.data?.success) {
        setTeam(res.data.team);
        setMessage({ type: 'success', text: 'Team details successfully updated!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update team details' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading Squad Roster..." />;

  const isLeader = team && String(team.leader?._id) === String(user?.id);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO DASHBOARD</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
              {team?.teamId}
            </span>
            <StatusBadge status={team?.registrationStatus} />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Manage Squad Roster
          </h1>
        </div>

        {isLeader && (
          <button
            onClick={handleSaveTeam}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs uppercase flex items-center space-x-2 shadow-neon-cyan disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveTeam} className="space-y-6">
        {/* Basic Team Settings */}
        <div className="cyber-card p-6 border border-white/10">
          <h3 className="font-heading font-bold text-lg text-white mb-4">
            Team Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!isLeader}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Selected Track
              </label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                disabled={!isLeader}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0c0e1a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 disabled:opacity-60"
              >
                {tracks.map(t => (
                  <option key={t._id} value={t._id}>
                    Track #{t.trackNumber} - {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Squad Members */}
        <div className="cyber-card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Squad Members ({members.length + 1} Total)</span>
            </h3>

            {isLeader && members.length < 3 && (
              <button
                type="button"
                onClick={addMember}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Leader (Read-only) */}
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-white text-sm">
                  {team?.leader?.name} (You - Team Leader)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  Leader
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {team?.leader?.email} • {team?.leader?.phone} • {team?.leader?.department} ({team?.leader?.college})
              </p>
            </div>

            {/* Editable Members */}
            {members.map((mem, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-purple-400">
                    Member #{idx + 1}
                  </span>
                  {isLeader && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={mem.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={mem.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={mem.phone}
                      onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamDashboard;
