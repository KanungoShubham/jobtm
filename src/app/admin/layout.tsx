'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  HiViewGrid, HiCheckCircle, HiUsers, HiBriefcase,
  HiClipboardList, HiLogout, HiShieldCheck, HiMenuAlt2, HiX,
  HiCash, HiLightningBolt, HiTicket, HiAcademicCap, HiPhotograph, HiUserGroup, HiTag,
} from 'react-icons/hi';
import { getAdminToken, getAdminUser, clearAdminSession } from '@/lib/adminAuth';

const NAV = [
  { href: '/admin/dashboard',     label: 'Dashboard',     icon: HiViewGrid      },
  { href: '/admin/approvals',     label: 'Approvals',     icon: HiCheckCircle   },
  { href: '/admin/users',         label: 'Users',         icon: HiUsers         },
  { href: '/admin/jobs',          label: 'Jobs',          icon: HiBriefcase     },
  { href: '/admin/activities',    label: 'Activities',    icon: HiAcademicCap   },
  { href: '/admin/advertisers',   label: 'Advertisers',   icon: HiUserGroup     },
  { href: '/admin/ads',           label: 'Ads',           icon: HiPhotograph    },
  { href: '/admin/ad-plans',      label: 'Ad Plans',      icon: HiTag           },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: HiCash          },
  { href: '/admin/launch-offer',  label: 'Launch Offer',  icon: HiLightningBolt },
  { href: '/admin/coupons',       label: 'Coupons',       icon: HiTicket        },
  { href: '/admin/audit',         label: 'Audit Log',     icon: HiClipboardList },
];

function Sidebar({ user, onLogout, onClose }: {
  user: { name?: string } | null;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full w-64 flex-shrink-0 bg-[#1a1f36]">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
            <HiShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-extrabold text-sm tracking-tight">jobstm</span>
            <span className="ml-1.5 bg-indigo-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-widest">
              ADMIN
            </span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white transition lg:hidden">
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
                  ? 'text-white'
                  : 'text-white/50 hover:bg-white/[0.07] hover:text-white'
              }`}
              style={active
                ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }
                : {}
              }
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white text-xs font-bold">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'Super Admin'}</p>
            <p className="text-white/35 text-[10px]">Administrator</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:bg-white/[0.07] hover:text-white text-sm font-semibold transition">
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
      <div className="flex h-screen items-center justify-center bg-[#0f1225]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#1a1f36] border-b border-white/[0.07]">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white transition">
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <HiShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">jobstm Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
