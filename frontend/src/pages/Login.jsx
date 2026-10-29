import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, Phone, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { loginParticipant } = useAuth();

  // Mode: 'login' | 'forgot'
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginParticipant({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await authService.resetParticipantPassword({
        email: forgotEmail,
        phone: forgotPhone,
        newPassword
      });

      if (res.data?.success) {
        setResetSuccess(res.data.message || 'Password changed successfully!');
        setEmail(forgotEmail);
        setPassword('');
        setTimeout(() => {
          setIsForgotMode(false);
          setResetSuccess('');
        }, 2200);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please check your details.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
      <div className="w-full max-w-md">
        {/* Editorial Card */}
        <div className="p-8 sm:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#07080a] rounded-3xl">
          {/* Ambient light */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 p-0.5 shadow-neon-emerald mx-auto mb-4">
              <div className="w-full h-full bg-[#07080a] rounded-[14px] flex items-center justify-center">
                <Terminal className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block mb-1">
              // PARTICIPANT PORTAL
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
              {isForgotMode ? (
                <>RESET <span className="text-gradient">PASSWORD</span></>
              ) : (
                <>CSBS <span className="text-gradient">LOGIN</span></>
              )}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              {isForgotMode
                ? 'Verify your registered credentials to establish a new password.'
                : 'Access squad telemetry, payment records & code submission portal.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2.5 font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2.5 font-sans">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {!isForgotMode ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 tracking-wider">
                  REGISTERED EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@college.edu"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                    PASSWORD ACCESS KEY
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setResetSuccess('');
                      setForgotEmail(email);
                      setIsForgotMode(true);
                    }}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'AUTHENTICATING...' : 'ENTER SQUAD DASHBOARD'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>
          ) : (
            /* --- FORGOT PASSWORD FORM --- */
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 tracking-wider">
                  REGISTERED EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="leader@college.edu"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 tracking-wider">
                  REGISTERED PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 tracking-wider">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5 tracking-wider">
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500/60 font-sans transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{resetLoading ? 'UPDATING PASSWORD...' : 'SET NEW PASSWORD'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setResetSuccess('');
                    setIsForgotMode(false);
                  }}
                  className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col items-center justify-center space-y-2 text-xs text-zinc-400 font-sans">
            <p>
              Haven't registered your squad yet?{' '}
              <Link to="/register" className="text-emerald-400 hover:underline font-semibold font-mono">
                Register Squad
              </Link>
            </p>
            <p>
              Faculty / Judge / Admin?{' '}
              <Link to="/admin/login" className="text-zinc-500 hover:text-emerald-400 transition-colors font-mono">
                Admin Console
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
