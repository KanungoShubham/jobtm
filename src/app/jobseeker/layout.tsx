'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { HiHome, HiBriefcase, HiClipboardList, HiBookmark, HiUser, HiLogout, HiMenuAlt2, HiX, HiAcademicCap, HiGift, HiViewGrid } from 'react-icons/hi';
import Image from 'next/image';
import { jobseekerAuth } from '@/lib/roleAuth';

const COLOR = '#0EA5E9';

const NAV = [
  { href: '/jobseeker/home',       label: 'Home',        icon: HiHome          },
  { href: '/jobseeker/jobs',       label: 'Browse Jobs', icon: HiBriefcase     },
  { href: '/jobseeker/applied',    label: 'Applied',     icon: HiClipboardList },
  { href: '/jobseeker/saved',      label: 'Saved',       icon: HiBookmark      },
  { href: '/jobseeker/activities', label: 'Activities',  icon: HiAcademicCap   },
  { href: '/jobseeker/rewards',    label: 'Rewards',     icon: HiGift          },
  { href: '/jobseeker/profile',    label: 'Profile',     icon: HiUser          },
  { href: '/jobseeker/account',    label: 'Account',     icon: HiViewGrid      },
];

function Sidebar({ user, onLogout, onClose }: { user: { name?: string } | null; onLogout: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col h-full w-64 flex-shrink-0 bg-white border-r border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Image src="/assets/jobstm-icon.png" alt="jobstm" width={44} height={44} className="rounded-xl" priority />
          <div>
            <span className="text-slate-900 font-extrabold text-sm">jobstm</span>
            <span className="ml-1.5 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded" style={{ backgroundColor: COLOR }}>SEEKER</span>
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
                ? { backgroundColor: COLOR, color: '#fff', boxShadow: '0 4px 12px rgba(14,165,233,0.25)' }
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
            <span className="text-white text-xs font-bold">{(user?.name ?? 'J').charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 text-xs font-semibold truncate">{user?.name ?? 'Job Seeker'}</p>
            <p className="text-slate-400 text-[10px]">Job Seeker Account</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-sm font-semibold transition-colors">
          <HiLogout className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}

export default function JobseekerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/jobseeker/login' || pathname === '/jobseeker/register';
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthPage) { setReady(true); return; }
    const token = jobseekerAuth.getToken();
    if (!token) { router.replace('/jobseeker/login'); return; }
    setUser(jobseekerAuth.getUser());
    setReady(true);
  }, [pathname, router, isAuthPage]);

  const logout = () => {
    jobseekerAuth.clearSession();
    router.replace('/jobseeker/login');
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: COLOR, borderTopColor: 'transparent' }} />
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
          <Image src="/assets/jobstm-icon.png" alt="jobstm" width={36} height={36} className="rounded-lg" />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
