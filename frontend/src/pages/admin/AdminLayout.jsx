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
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'EVENT & TEAMS',
    items: [
      { name: 'Registrations', path: '/admin/registrations', icon: Shield },
      { name: 'Squads', path: '/admin/teams', icon: Users },
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
    title: 'PORTAL CONTENT',
    items: [
      { name: 'Challenges', path: '/admin/tracks', icon: Layers },
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
    title: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings }
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
    <div className="min-h-screen bg-[#07080a] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.08] bg-[#090b10] h-screen sticky top-0 z-30">
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 p-0.5 shadow-neon-emerald">
              <div className="w-full h-full bg-[#07080a] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white tracking-wider">
                CSBS <span className="text-gradient">ADMIN</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500 block">SYSTEM CONSOLE</span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-3 text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase mb-2">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-neon-emerald'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#07080a] flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate font-sans">{user?.name || 'Admin Officer'}</p>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
              {role || 'admin'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#090b10]/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          {/* Mobile hamburger */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-black text-sm text-white">CSBS ADMIN</span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-zinc-400 font-mono">
            <span>CSBS_CODEX_PORTAL</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 uppercase font-bold">
              {location.pathname.replace('/admin', '').replace('/', '') || 'DASHBOARD'}
            </span>
          </div>

          {/* Right items */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-mono"
            >
              <span>Live Portal ↗</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold font-mono text-xs flex items-center justify-center">
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
            <div className="relative w-64 bg-[#090b10] border-r border-white/10 h-full flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-heading font-black text-base text-white">CSBS ADMIN</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {menuGroups.map((group, gIdx) => (
                  <div key={gIdx}>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">{group.title}</p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono ${
                            location.pathname === item.path
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'text-zinc-400'
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
                className="mt-4 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-mono font-semibold"
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
