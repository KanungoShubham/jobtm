'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HiViewGrid, HiCheckCircle, HiUsers, HiBriefcase,
  HiClipboardList, HiLogout, HiShieldCheck, HiMenuAlt2, HiX,
} from 'react-icons/hi';
import { getAdminToken, getAdminUser, clearAdminSession } from '@/lib/adminAuth';

const NAV = [
  { href: '/admin/dashboard',  label: 'Dashboard', icon: HiViewGrid },
  { href: '/admin/approvals',  label: 'Approvals', icon: HiCheckCircle },
  { href: '/admin/users',      label: 'Users',      icon: HiUsers },
  { href: '/admin/jobs',       label: 'Jobs',       icon: HiBriefcase },
  { href: '/admin/audit',      label: 'Audit Log',  icon: HiClipboardList },
];

function Sidebar({ user, onLogout, onClose }: {
  user: { name?: string } | null;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-slate-900 w-64 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow shadow-red-600/40">
            <HiShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-sm tracking-tight">jobstm</span>
            <span className="ml-1.5 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest">
              ADMIN
            </span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-white transition lg:hidden">
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition group ${
                active
                  ? 'bg-red-600 text-white shadow shadow-red-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center">
            <span className="text-red-400 text-xs font-bold">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'Super Admin'}</p>
            <p className="text-slate-500 text-[10px]">Administrator</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-red-400 text-sm font-semibold transition">
          <HiLogout className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready,       setReady]       = useState(false);
  const [user,        setUser]        = useState<{ name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return; }
    const token = getAdminToken();
    if (!token) { router.replace('/admin/login'); return; }
    setUser(getAdminUser());
    setReady(true);
  }, [pathname, router]);

  const logout = () => {
    clearAdminSession();
    router.replace('/admin/login');
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:flex">
        <Sidebar user={user} onLogout={logout} />
      </div>

      {/* Sidebar — mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 flex lg:hidden transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} onLogout={logout} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900 text-sm">jobstm Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
