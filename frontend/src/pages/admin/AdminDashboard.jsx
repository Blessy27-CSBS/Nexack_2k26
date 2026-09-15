import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  CreditCard,
  FileCode,
  Trophy,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
  Building
} from 'lucide-react';
import { adminService } from '../../services/api';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader message="Compiling live hackathon analytics..." />;

  const m = data?.metrics || {};
  const charts = data?.charts || {};

  const metricCards = [
    { title: 'Total Teams', value: m.totalTeams ?? 0, icon: Shield, color: 'text-cyan-400', link: '/admin/teams' },
    { title: 'Total Participants', value: m.totalParticipants ?? 0, icon: Users, color: 'text-purple-400', link: '/admin/participants' },
    { title: 'Verified Teams', value: m.verifiedTeams ?? 0, icon: CheckCircle, color: 'text-emerald-400', link: '/admin/teams?status=Verified' },
    { title: 'Pending Payments', value: m.pendingPayments ?? 0, icon: Clock, color: 'text-amber-400', link: '/admin/payments' },
    { title: 'Verified Payments', value: m.verifiedPayments ?? 0, icon: CreditCard, color: 'text-emerald-400', link: '/admin/payments?status=Verified' },
    { title: 'Submitted Projects', value: m.submittedProjects ?? 0, icon: FileCode, color: 'text-blue-400', link: '/admin/submissions' },
    { title: 'Shortlisted Teams', value: m.shortlistedTeams ?? 0, icon: Layers, color: 'text-indigo-400', link: '/admin/submissions?status=Shortlisted' },
    { title: 'Grand Winners', value: m.winners ?? 0, icon: Trophy, color: 'text-yellow-400', link: '/admin/results' }
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Page Header */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-wider">
          Hackathon Command Center
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Real-time aggregated metrics from MongoDB
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="cyber-card p-5 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>

              <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                {card.value}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Distribution Chart */}
        <div className="cyber-card p-6 border border-white/10">
          <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Teams by Track</span>
          </h3>

          {charts.trackDistribution && charts.trackDistribution.length > 0 ? (
            <div className="space-y-3">
              {charts.trackDistribution.map((item, idx) => {
                const maxCount = Math.max(...charts.trackDistribution.map(t => t.count), 1);
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium truncate max-w-[240px]">
                        {item.trackNumber ? `T#${item.trackNumber} ` : ''}{item.name}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">{item.count} teams</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-8 text-center">No track registrations recorded yet.</p>
          )}
        </div>

        {/* Payment Status Breakdown */}
        <div className="cyber-card p-6 border border-white/10">
          <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payment Workflow Breakdown</span>
          </h3>

          <div className="space-y-3">
            {charts.paymentBreakdown && charts.paymentBreakdown.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono text-xs font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* College Distribution */}
        <div className="cyber-card p-6 border border-white/10">
          <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Building className="w-4 h-4 text-purple-400" />
            <span>Top Colleges by Representation</span>
          </h3>

          {charts.collegeDistribution && charts.collegeDistribution.length > 0 ? (
            <div className="space-y-2.5">
              {charts.collegeDistribution.map((col, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5">
                  <span className="truncate pr-4 text-slate-300">{col.name}</span>
                  <span className="font-mono font-bold text-purple-400 flex-shrink-0">{col.count} participants</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-8 text-center">No participant institution data available yet.</p>
          )}
        </div>

        {/* Quick Access Ops Links */}
        <div className="cyber-card p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider mb-2">
              Action Shortcuts
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Frequently accessed operational dashboards
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/payments" className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 text-xs font-semibold text-cyan-300 block text-center transition-colors">
                Verify Payments
              </Link>
              <Link to="/admin/submissions" className="p-3 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/10 text-xs font-semibold text-purple-300 block text-center transition-colors">
                Review Submissions
              </Link>
              <Link to="/admin/judges" className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 text-xs font-semibold text-emerald-300 block text-center transition-colors">
                Assign Judges
              </Link>
              <Link to="/admin/settings" className="p-3 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 text-xs font-semibold text-amber-300 block text-center transition-colors">
                Website Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
