import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LayoutDashboard, Terminal, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'ABOUT', path: '/about' },
  { name: 'CHALLENGES', path: '/tracks' },
  { name: 'TIMELINE', path: '/timeline' },
  { name: 'PRIZES', path: '/prizes' },
  { name: 'FAQ', path: '/faq' },
  { name: 'CONTACT', path: '/contact' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { user, role, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getDashboardLink = () => {
    if (role === 'admin' || role === 'superadmin') return '/admin';
    if (role === 'judge') return '/admin/evaluations';
    return '/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#07080a]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 p-0.5 shadow-neon-emerald transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#07080a] rounded-[10px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-heading text-lg sm:text-xl font-black tracking-wider text-white">
              CSBS <span className="text-gradient">NEXACK</span>
            </span>
            <span className="hidden sm:block text-[9px] tracking-widest text-zinc-400 uppercase font-mono">
              2K26 | NEXORA × CODEX
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-white/[0.03] px-4 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                  isActive
                    ? 'text-emerald-300 font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-full shadow-sm"
                    transition={{ type: 'spring', duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wider transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>DASHBOARD</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-xs font-heading font-black tracking-wider bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-black shadow-neon-emerald btn-glow transition-all uppercase"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0c10] border-b border-white/10 px-4 pt-4 pb-6 space-y-3 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-mono font-semibold ${
                    location.pathname === link.path
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="w-full py-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-center font-mono font-bold text-xs border border-emerald-500/40"
                  >
                    MY DASHBOARD
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 text-center font-mono text-xs"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-amber-500 text-black text-center font-heading font-black text-xs uppercase shadow-neon-emerald"
                  >
                    REGISTER NOW
                  </Link>
                  <Link
                    to="/login"
                    className="w-full py-2.5 rounded-lg border border-white/10 text-zinc-300 text-center font-mono text-xs"
                  >
                    LOGIN
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
