'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HiViewGrid, HiPlusCircle, HiBriefcase, HiClipboardList, HiOfficeBuilding,
  HiUserGroup, HiLogout, HiMenuAlt2, HiX,
} from 'react-icons/hi';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';

const NAV = [
  { href: '/employer/dashboard',  label: 'Dashboard',       icon: HiViewGrid      },
  { href: '/employer/post-job',   label: 'Post Job',        icon: HiPlusCircle    },
  { href: '/employer/jobs',       label: 'My Jobs',         icon: HiBriefcase     },
  { href: '/employer/applications', label: 'Applications',  icon: HiClipboardList },
  { href: '/employer/profile',    label: 'Company Profile', icon: HiOfficeBuilding },
  { href: '/employer/persons',    label: 'Persons',         icon: HiUserGroup     },
];

function Sidebar({ user, onLogout, onClose }: { user: { name?: string } | null; onLogout: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col h-full w-64 flex-shrink-0 bg-white border-r border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
            <Image src="/assets/jobstm-icon.png" alt="jobstm" width={36} height={36} className="rounded" />
          </div>
          <div>
            <span className="text-slate-900 font-extrabold text-sm">jobstm</span>
            <span className="ml-1.5 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded" style={{ backgroundColor: COLOR }}>EMPLOYER</span>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="lg:hidden text-slate-400"><HiX className="w-5 h-5" /></button>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={active
                ? { background: `linear-gradient(135deg, ${COLOR}, #A78BFA)`, color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }
                : { color: '#64748B' }}>
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLOR }}>
            <span className="text-white text-xs font-bold">{(user?.name ?? 'E').charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 text-xs font-semibold truncate">{user?.name ?? 'Employer'}</p>
            <p className="text-slate-400 text-[10px]">Employer Account</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors">
          <HiLogout className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/employer/login' || pathname === '/employer/register';
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthPage) { setReady(true); return; }
    const token = employerAuth.getToken();
    if (!token) { router.replace('/employer/login'); return; }
    setUser(employerAuth.getUser());
    setReady(true);
  }, [pathname, router, isAuthPage]);

  const logout = () => {
    employerAuth.clearSession();
    router.replace('/employer/login');
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: COLOR, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="hidden lg:flex"><Sidebar user={user} onLogout={logout} /></div>
      <div className={`fixed inset-y-0 left-0 z-50 flex lg:hidden transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} onLogout={logout} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500"><HiMenuAlt2 className="w-6 h-6" /></button>
          <span className="font-bold text-slate-800 text-sm">jobstm Employer</span>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
