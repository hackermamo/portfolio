"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutDashboard, 
  User, 
  Code, 
  Briefcase, 
  Layers, 
  GraduationCap, 
  Award, 
  Share2, 
  Settings, 
  Palette, 
  Mail, 
  BarChart3, 
  Eye, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, href, active, collapsed, onClick }) => (
  <a 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-200 group ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
    } ${collapsed ? 'justify-center' : ''}`}
  >
    <Icon size={22} className={active ? 'text-white' : 'group-hover:text-blue-400'} />
    {!collapsed && <span className="font-semibold">{label}</span>}
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
  </a>
);

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return children;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: User, label: 'Hero Section', href: '/admin/hero' },
    { icon: Code, label: 'Skills', href: '/admin/skills' },
    { icon: Layers, label: 'Projects', href: '/admin/projects' },
    { icon: Briefcase, label: 'Experience', href: '/admin/experience' },
    { icon: GraduationCap, label: 'Education', href: '/admin/education' },
    { icon: Award, label: 'Certifications', href: '/admin/certifications' },
    { icon: Share2, label: 'Social Links', href: '/admin/socials' },
    { icon: Settings, label: 'Site Settings', href: '/admin/settings' },
    { icon: Palette, label: 'Appearance', href: '/admin/appearance' },
    { icon: Mail, label: 'Contact Messages', href: '/admin/messages' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-slate-950 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 border-r border-slate-900 ${
        collapsed ? 'w-20' : 'w-72'
      } ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-900">
           {!collapsed && (
             <div>
                <h1 className="text-xl font-black text-blue-500 tracking-tighter">MAMAN <span className="text-white">DAS</span></h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Portfolio Admin</p>
             </div>
           )}
           <div className="flex items-center gap-1">
             <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block p-1.5 hover:bg-slate-900 rounded-lg text-slate-400">
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
             <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5 hover:bg-slate-900 rounded-lg text-slate-400">
                <ChevronLeft size={20} />
             </button>
           </div>
        </div>

        <nav className="flex-grow overflow-y-auto py-4 custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.label} 
              {...item} 
              active={pathname === item.href} 
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          
          <div className="mt-8 pt-4 border-t border-slate-900 px-2">
            <a 
              href="/" 
              target="_blank"
              className={`flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-blue-400 transition-colors rounded-xl ${collapsed ? 'justify-center' : ''}`}
            >
              <Eye size={20} />
              {!collapsed && <span className="font-semibold text-sm">Preview Website</span>}
            </a>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors rounded-xl ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={20} />
              {!collapsed && <span className="font-semibold text-sm">Logout</span>}
            </button>
          </div>
        </nav>

        {/* User Info */}
        {!collapsed && user && (
          <div className="p-4 sm:p-6 bg-slate-900/50 flex items-center gap-3 border-t border-slate-900">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black flex-shrink-0">
                {user.name.charAt(0)}
             </div>
             <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Admin Online</span>
                </div>
             </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 min-w-0 ${collapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-72'}`}>
        {/* Header */}
        <header className="h-16 sm:h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors">
           <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex-shrink-0"
                aria-label="Open mobile navigation menu"
              >
                 <Menu size={22} />
              </button>
              <div className="min-w-0">
                 <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white capitalize truncate">
                   {pathname.split('/').pop() || 'Dashboard'}
                 </h2>
                 <p className="text-[11px] sm:text-xs font-medium text-slate-400 hidden sm:block">Manage your portfolio website content</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center"
              >
                {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
              </button>

              <a 
                href="/" 
                target="_blank" 
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-blue-900/60 transition border border-blue-100 dark:border-blue-900/50 whitespace-nowrap"
              >
                 <span className="hidden sm:inline">View Live Site</span>
                 <span className="sm:hidden">Live</span>
                 <Eye size={15} />
              </a>

              <div className="w-px h-6 sm:h-8 bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2 hidden xs:block"></div>
              
              <div className="flex items-center gap-2.5 sm:gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">{user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
                 </div>
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                    {user?.name?.charAt(0) || 'A'}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
           {children}
        </div>
      </main>
    </div>
  );
}
