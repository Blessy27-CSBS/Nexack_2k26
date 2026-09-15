import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Terminal, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin({ email: email.trim(), password: password.trim() });
      if (data?.user?.role === 'judge') {
        navigate('/admin/evaluations');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'Invalid admin credentials or account disabled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070b] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        <div className="cyber-card p-8 sm:p-10 border border-white/10 relative overflow-hidden bg-[#0a0c16]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-neon-cyan mx-auto mb-4">
              <div className="w-full h-full bg-[#07080d] rounded-[14px] flex items-center justify-center">
                <Terminal className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              ADMIN / JUDGE <span className="text-gradient">PORTAL</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Secure Operations & Judging Access
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Staff / Judge Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexack.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-cyan hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'ACCESS SECURE CONSOLE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-300">
              ← Return to NEXACK Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
