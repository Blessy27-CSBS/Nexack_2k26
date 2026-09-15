import React, { useState, useEffect } from 'react';
import { Trophy, Award, ToggleLeft, ToggleRight, Sparkles, RefreshCw } from 'lucide-react';
import { leaderboardService, settingsService } from '../../services/api';
import Loader from '../../components/Loader';

const AdminLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const [boardRes, setRes] = await Promise.all([
        leaderboardService.getLeaderboard(),
        settingsService.getPublicSettings()
      ]);

      if (boardRes.data?.leaderboard) {
        setLeaderboard(boardRes.data.leaderboard);
      }
      if (setRes.data?.settings) {
        setSettings(setRes.data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const handleTogglePublic = async () => {
    if (!settings) return;
    setUpdating(true);
    const newStatus = !settings.isPublicLeaderboardEnabled;

    try {
      const formData = new FormData();
      formData.append('isPublicLeaderboardEnabled', newStatus ? 'true' : 'false');
      await settingsService.updateSettings(formData);
      setSettings(prev => ({ ...prev, isPublicLeaderboardEnabled: newStatus }));
    } catch (err) {
      alert('Failed to toggle public leaderboard');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader message="Calculating live weighted leaderboard..." />;

  const isPublic = Boolean(settings?.isPublicLeaderboardEnabled);

  return (
    <div className="space-y-6 text-white">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
            Live Hackathon Leaderboard
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Automatically compiled from judge evaluations with consistent tie-breaking
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={fetchLeaderboardData}
            title="Refresh Leaderboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePublic}
            disabled={updating}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 border transition-all ${
              isPublic
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-neon-glow'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {isPublic ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
            <span>{isPublic ? 'Public Visibility: ENABLED' : 'Public Visibility: DISABLED'}</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="cyber-card border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Evaluations</th>
                <th className="py-3 px-4 text-right">Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 italic">
                    No evaluations completed yet. Leaderboard will dynamically update as judges enter scores.
                  </td>
                </tr>
              ) : (
                leaderboard.map((item) => {
                  const isTop3 = item.rank <= 3;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        item.rank === 1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-black text-sm whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                            item.rank === 1 ? 'bg-amber-400 text-black shadow-neon-glow' :
                            item.rank === 2 ? 'bg-slate-300 text-black' :
                            item.rank === 3 ? 'bg-amber-700 text-white' :
                            'bg-white/5 text-slate-400'
                          }`}>
                            #{item.rank}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{item.teamName}</div>
                        <span className="font-mono text-[11px] text-cyan-400">{item.teamId}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {item.projectTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.trackName || 'General'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {item.evaluationCount} judge panels
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-base text-amber-400">
                        {item.averageScore.toFixed(2)} / 100
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
