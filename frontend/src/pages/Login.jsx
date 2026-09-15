import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginParticipant } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginParticipant({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="cyber-card p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Ambient light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-neon-cyan mx-auto mb-4">
              <div className="w-full h-full bg-[#07080d] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
              PARTICIPANT <span className="text-gradient">LOGIN</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Access your team dashboard, payment status & project submission.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leader@college.edu"
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
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center space-y-2 text-xs text-slate-400">
            <p>
              Haven't registered your team yet?{' '}
              <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
                Register Here
              </Link>
            </p>
            <p>
              Faculty / Admin / Judge?{' '}
              <Link to="/admin/login" className="text-slate-500 hover:text-cyan-400 transition-colors">
                Switch to Admin Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
