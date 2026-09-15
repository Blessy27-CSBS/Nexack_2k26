import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  Layers,
  FileCode,
  Award,
  Trophy,
  Scale,
  Calendar,
  Image,
  MessageSquare,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Terminal,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const menuGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard }
    ]
  },
  {
    title: 'HACKATHON TEAMS & OPS',
    items: [
      { name: 'Registrations', path: '/admin/registrations', icon: Shield },
      { name: 'Teams', path: '/admin/teams', icon: Users },
      { name: 'Participants', path: '/admin/participants', icon: UserCheck },
      { name: 'Payments', path: '/admin/payments', icon: CreditCard },
      { name: 'Submissions', path: '/admin/submissions', icon: FileCode }
    ]
  },
  {
    title: 'JUDGING & SCORING',
    items: [
      { name: 'Judges', path: '/admin/judges', icon: Scale },
      { name: 'Evaluations', path: '/admin/evaluations', icon: BookOpen },
      { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
      { name: 'Results', path: '/admin/results', icon: Award }
    ]
  },
  {
    title: 'WEBSITE DYNAMIC CONTENT',
    items: [
      { name: 'Tracks', path: '/admin/tracks', icon: Layers },
      { name: 'Timeline', path: '/admin/timeline', icon: Calendar },
      { name: 'Prizes', path: '/admin/prizes', icon: Trophy },
      { name: 'Rules', path: '/admin/rules', icon: BookOpen },
      { name: 'Mentors', path: '/admin/mentors', icon: Users },
      { name: 'Faculty', path: '/admin/faculty', icon: Users },
      { name: 'Association', path: '/admin/association', icon: Users },
      { name: 'Sponsors', path: '/admin/sponsors', icon: Award },
      { name: 'Gallery', path: '/admin/gallery', icon: Image },
      { name: 'Announcements', path: '/admin/announcements', icon: Bell },
      { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
      { name: 'Messages', path: '/admin/messages', icon: MessageSquare }
    ]
  },
  {
    title: 'SYSTEM CONFIG',
    items: [
      { name: 'Site Settings', path: '/admin/settings', icon: Settings }
    ]
  }
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#090b14] h-screen sticky top-0 z-30">
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-neon-cyan">
              <div className="w-full h-full bg-[#07080d] rounded-md flex items-center justify-center">
                <Terminal className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-black text-base text-white tracking-wider">
                NEXACK <span className="text-gradient">ADMIN</span>
              </span>
              <span className="text-[9px] font-mono text-cyan-400 block">CONTROL CENTER</span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-neon-cyan'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-[#07080d]/60 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
              {role || 'admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-[#090b14]/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-black text-base text-white">NEXACK ADMIN</span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span>ADMIN CONSOLE</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-cyan-400 uppercase font-bold">
              {location.pathname.replace('/admin', '').replace('/', '') || 'DASHBOARD'}
            </span>
          </div>

          {/* Right items */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-mono"
            >
              <span>Live Site ↗</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold font-mono text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative w-64 bg-[#090b14] border-r border-white/10 h-full flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-heading font-black text-lg text-white">NEXACK CONTROL</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {menuGroups.map((group, gIdx) => (
                  <div key={gIdx}>
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">{group.title}</p>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs ${
                            location.pathname === item.path
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 w-full py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Outlet for Admin subpages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
