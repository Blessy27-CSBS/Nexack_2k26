import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, Save, ArrowLeft, ShieldCheck, AlertCircle, Terminal } from 'lucide-react';
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
          teamService.getMyTeam().catch(() => ({ data: { team: null } })),
          trackService.getPublished().catch(() => ({ data: { tracks: [] } }))
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
        setMessage({ type: 'success', text: 'Squad roster details updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update squad roster' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Accessing Squad Roster Configuration..." />;

  const isLeader = team && String(team.leader?._id) === String(user?.id);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO SQUAD DASHBOARD</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
              SQUAD_ID: {team?.teamId}
            </span>
            <StatusBadge status={team?.registrationStatus} />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            SQUAD <span className="text-gradient">ROSTER</span>
          </h1>
        </div>

        {isLeader && (
          <button
            onClick={handleSaveTeam}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs uppercase flex items-center space-x-2 shadow-neon-emerald disabled:opacity-50 transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4 text-black" />
            <span>{saving ? 'Saving...' : 'Save Roster Changes'}</span>
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center space-x-3 font-sans ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveTeam} className="space-y-6">
        {/* Basic Team Settings */}
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl">
          <h3 className="font-heading font-bold text-lg text-white mb-4 uppercase tracking-wider">
            Squad Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Team / Squad Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!isLeader}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">
                Assigned Problem Domain / Track
              </label>
              <select
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                disabled={!isLeader}
                className="w-full px-4 py-3 rounded-xl bg-[#0e1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 disabled:opacity-60 font-sans"
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
        <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-3xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Squad Members ({members.length + 1} Total)</span>
            </h3>

            {isLeader && members.length < 3 && (
              <button
                type="button"
                onClick={addMember}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-emerald-500/20 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Leader (Read-only) */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-white text-sm">
                  {team?.leader?.name} (You - Team Leader)
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  Squad Leader
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                {team?.leader?.email} • {team?.leader?.phone} • {team?.leader?.department} ({team?.leader?.college})
              </p>
            </div>

            {/* Editable Members */}
            {members.map((mem, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    // SQUAD MEMBER #{idx + 2}
                  </span>
                  {isLeader && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={mem.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs disabled:opacity-60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={mem.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs disabled:opacity-60 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={mem.phone}
                      onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                      disabled={!isLeader}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs disabled:opacity-60 font-sans"
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
