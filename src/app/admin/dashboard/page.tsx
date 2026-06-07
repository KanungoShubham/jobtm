'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiUsers, HiBriefcase, HiDocumentText, HiExclamationCircle,
  HiCheckCircle, HiRefresh,
} from 'react-icons/hi';
import { dashboardApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  jobSeekers: number;
  employers: number;
  pendingUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  verifiedCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newUsersToday: number;
}

const QUICK_ACTIONS = [
  { href: '/admin/approvals', label: 'Approvals',  desc: 'Review pending requests', icon: HiCheckCircle, color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100' },
  { href: '/admin/users',     label: 'Users',       desc: 'Manage all user accounts', icon: HiUsers,       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { href: '/admin/jobs',      label: 'Jobs',        desc: 'Moderate job listings',    icon: HiBriefcase,   color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { href: '/admin/audit',     label: 'Audit Log',   desc: 'View admin activity log',  icon: HiDocumentText,color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100' },
];

function StatCard({ label, value, sub, icon: Icon, color, bg, border, badge }: {
  label: string; value: number | string; sub?: string;
  icon: any; color: string; bg: string; border: string; badge?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 border ${border} shadow-sm flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {badge === 'urgent' ? 'URGENT' : badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}


export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAdminToken() ?? '';
      const res   = await dashboardApi.getStats(token);
      setStats(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pendingTotal = (stats?.pendingUsers ?? 0) + (stats?.pendingCompanies ?? 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Control Panel</h1>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-3.5 py-2 rounded-xl shadow-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error} — showing cached data
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users" icon={HiUsers} color="text-blue-600" bg="bg-blue-50" border="border-blue-100"
          value={loading ? '—' : (stats?.totalUsers ?? 0)}
          sub={loading ? '' : `+${stats?.newUsersToday ?? 0} today`}
        />
        <StatCard
          label="Active Jobs" icon={HiBriefcase} color="text-violet-600" bg="bg-violet-50" border="border-violet-100"
          value={loading ? '—' : (stats?.activeJobs ?? 0)}
          sub={loading ? '' : `${stats?.totalJobs ?? 0} total`}
        />
        <StatCard
          label="Applications" icon={HiDocumentText} color="text-emerald-600" bg="bg-emerald-50" border="border-emerald-100"
          value={loading ? '—' : (stats?.totalApplications ?? 0)}
        />
        <StatCard
          label="Pending Reviews" icon={HiExclamationCircle} color="text-red-500" bg="bg-red-50" border="border-red-100"
          value={loading ? '—' : pendingTotal}
          badge={pendingTotal > 0 ? 'urgent' : undefined}
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Job Seekers',      value: stats?.jobSeekers      ?? 0, sub: 'registered' },
          { label: 'Employers',        value: stats?.employers        ?? 0, sub: 'accounts' },
          { label: 'Verified Companies', value: stats?.verifiedCompanies ?? 0, sub: `${stats?.totalCompanies ?? 0} total` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xl font-extrabold text-slate-900">{loading ? '—' : s.value.toLocaleString('en-IN')}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-extrabold text-slate-900 mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href}
                className={`flex items-center gap-3 ${a.bg} border ${a.border} rounded-2xl px-4 py-3.5 hover:shadow-sm transition group`}>
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <a.icon className={`w-4.5 h-4.5 ${a.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:underline">{a.label}</p>
                  <p className="text-[10px] text-slate-500">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-extrabold text-slate-900 mb-4">Platform Breakdown</p>
          {stats ? (
            <div className="space-y-4">
              {[
                { label: 'Job Seekers',       value: stats.jobSeekers       ?? 0, max: Math.max(stats.totalUsers, 1),     color: 'bg-blue-500' },
                { label: 'Employers',          value: stats.employers         ?? 0, max: Math.max(stats.totalUsers, 1),     color: 'bg-violet-500' },
                { label: 'Verified Companies', value: stats.verifiedCompanies ?? 0, max: Math.max(stats.totalCompanies, 1), color: 'bg-emerald-500' },
              ].map((h) => {
                const pct = Math.min(100, Math.round((h.value / h.max) * 100));
                return (
                  <div key={h.label} className="space-y-1.5">
                    <div className="flex justify-between">
                      <p className="text-xs text-slate-500">{h.label}</p>
                      <p className="text-xs font-semibold text-slate-700">{h.value.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${h.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Loading…</p>
          )}
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <p className="text-sm font-extrabold text-slate-900">Pending Reviews</p>
          <Link href="/admin/approvals" className="text-xs font-semibold text-red-500 hover:text-red-600">View all →</Link>
        </div>
        {pendingTotal > 0 ? (
          <div className="px-5 pb-5">
            <p className="text-sm text-slate-600">
              There {pendingTotal === 1 ? 'is' : 'are'}{' '}
              <span className="font-bold text-red-600">{pendingTotal}</span>{' '}
              pending {pendingTotal === 1 ? 'review' : 'reviews'} awaiting your attention.
            </p>
            <Link href="/admin/approvals"
              className="mt-3 inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
              <HiExclamationCircle className="w-4 h-4" />
              Review Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 gap-2">
            <HiCheckCircle className="w-8 h-8 text-emerald-400" />
            <p className="text-sm text-slate-400">All caught up — no pending reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
}
