'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiUsers, HiBriefcase, HiDocumentText, HiExclamationCircle,
  HiCheckCircle, HiRefresh, HiCash, HiLightningBolt, HiTicket,
  HiAcademicCap, HiLockClosed,
} from 'react-icons/hi';
import { dashboardApi, subscriptionsApi, couponsAdminApi, activitiesAdminApi } from '@/lib/api';
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
  { href: '/admin/approvals',     label: 'Approvals',     desc: 'Review pending requests',    icon: HiCheckCircle,   gradient: 'from-rose-500 to-red-500'      },
  { href: '/admin/users',         label: 'Users',         desc: 'Manage all user accounts',   icon: HiUsers,         gradient: 'from-blue-500 to-indigo-600'   },
  { href: '/admin/jobs',          label: 'Jobs',          desc: 'Moderate job listings',      icon: HiBriefcase,     gradient: 'from-violet-500 to-purple-600' },
  { href: '/admin/subscriptions', label: 'Subscriptions', desc: 'Manage user subscriptions',  icon: HiCash,          gradient: 'from-emerald-500 to-teal-600'  },
  { href: '/admin/activities',    label: 'Activities',    desc: 'Classes, payments & payouts', icon: HiAcademicCap,  gradient: 'from-sky-500 to-cyan-600'      },
  { href: '/admin/launch-offer',  label: 'Launch Offer',  desc: 'Configure free offer',       icon: HiLightningBolt, gradient: 'from-amber-500 to-orange-500'  },
  { href: '/admin/coupons',       label: 'Coupons',       desc: 'Manage reward coupons',      icon: HiTicket,        gradient: 'from-pink-500 to-rose-500'     },
  { href: '/admin/audit',         label: 'Audit Log',     desc: 'View admin activity log',    icon: HiDocumentText,  gradient: 'from-slate-500 to-slate-600'   },
];

function StatCard({ label, value, sub, icon: Icon, gradient, badge }: {
  label: string; value: number | string; sub?: string;
  icon: any; gradient: string; badge?: string;
}) {
  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white relative overflow-hidden shadow-lg`}>
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute right-2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white tracking-wide">
              {badge === 'urgent' ? 'URGENT' : badge}
            </span>
          )}
        </div>
        <p className="text-2xl font-extrabold">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
        <p className="text-xs text-white/75 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-white/55">{sub}</p>}
      </div>
    </div>
  );
}

function MiniCard({ label, value, sub, icon: Icon, iconBg, iconColor }: {
  label: string; value: string | number; sub?: string;
  icon: any; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-2`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <p className="text-xl font-extrabold text-slate-900">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
      <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,       setStats]       = useState<Stats | null>(null);
  const [subStats,    setSubStats]    = useState<any>(null);
  const [couponStats, setCouponStats] = useState<any>(null);
  const [actPayments, setActPayments] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAdminToken() ?? '';
      const [statsRes, subRes, couponRes, actRes] = await Promise.all([
        dashboardApi.getStats(token),
        subscriptionsApi.stats(token).catch(() => null),
        couponsAdminApi.stats(token).catch(() => null),
        activitiesAdminApi.getPayments(token).catch(() => null),
      ]);
      setStats(statsRes.data);
      if (subRes) setSubStats(subRes.data);
      if (couponRes) setCouponStats(couponRes.data);
      if (actRes) setActPayments(actRes.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pendingTotal = (stats?.pendingUsers ?? 0) + (stats?.pendingCompanies ?? 0);

  const actCollected = actPayments.reduce((s, p) => s + Number(p.amount_paid ?? 0), 0);
  const actHeld      = actPayments.filter((p) => p.payout_status === 'held')
    .reduce((s, p) => s + Math.round(Number(p.amount_paid ?? 0) * 0.85), 0);
  const actPlatform  = actPayments.reduce((s, p) => s + Math.round(Number(p.amount_paid ?? 0) * 0.15), 0);
  const recentActPayments = actPayments.slice(0, 6);
  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 uppercase tracking-widest font-bold mb-0.5">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Control Panel</h1>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition">
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

      {/* Main Stat Cards — gradient */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users" icon={HiUsers} gradient="from-blue-500 to-indigo-600"
          value={loading ? '—' : (stats?.totalUsers ?? 0)}
          sub={loading ? '' : `+${stats?.newUsersToday ?? 0} today`}
        />
        <StatCard
          label="Active Jobs" icon={HiBriefcase} gradient="from-violet-500 to-purple-600"
          value={loading ? '—' : (stats?.activeJobs ?? 0)}
          sub={loading ? '' : `${stats?.totalJobs ?? 0} total`}
        />
        <StatCard
          label="Applications" icon={HiDocumentText} gradient="from-emerald-500 to-teal-600"
          value={loading ? '—' : (stats?.totalApplications ?? 0)}
        />
        <StatCard
          label="Pending Reviews" icon={HiExclamationCircle} gradient="from-orange-500 to-red-500"
          value={loading ? '—' : pendingTotal}
          badge={pendingTotal > 0 ? 'urgent' : undefined}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Job Seekers',        value: stats?.jobSeekers      ?? 0, sub: 'registered',              iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',   icon: HiUsers       },
          { label: 'Employers',          value: stats?.employers        ?? 0, sub: 'accounts',                iconBg: 'bg-indigo-50',  iconColor: 'text-indigo-600', icon: HiBriefcase   },
          { label: 'Verified Companies', value: stats?.verifiedCompanies ?? 0, sub: `${stats?.totalCompanies ?? 0} total`, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', icon: HiCheckCircle },
        ].map((s) => (
          <MiniCard key={s.label} label={s.label} value={loading ? '—' : s.value} sub={s.sub}
            icon={s.icon} iconBg={s.iconBg} iconColor={s.iconColor} />
        ))}
      </div>

      {/* Subscription + Launch Offer */}
      {subStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard label="Active Subscriptions" value={loading ? '—' : subStats.active}
            icon={HiCash} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <MiniCard label="Launch Offer" value={loading ? '—' : (subStats.launch_offer_active ? 'Active' : 'Closed')}
            icon={HiLightningBolt} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <MiniCard label="Total Subscriptions" value={loading ? '—' : subStats.total}
            icon={HiDocumentText} iconBg="bg-slate-50" iconColor="text-slate-500" />
          <MiniCard label="Total Revenue"
            value={loading ? '—' : `₹${((subStats.total_revenue ?? 0) / 100).toLocaleString('en-IN')}`}
            icon={HiUsers} iconBg="bg-violet-50" iconColor="text-violet-600" />
        </div>
      )}

      {/* Coupon stats */}
      {couponStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard label="Active Coupon Batches" value={couponStats.active}
            icon={HiTicket} iconBg="bg-red-50" iconColor="text-red-600" />
          <MiniCard label="Total Coupon Batches" value={couponStats.total}
            icon={HiTicket} iconBg="bg-orange-50" iconColor="text-orange-500" />
          <MiniCard label="Total Coupon Slots" value={(couponStats.total_slots ?? 0).toLocaleString('en-IN')}
            icon={HiDocumentText} iconBg="bg-slate-50" iconColor="text-slate-500" />
          <MiniCard label="Coupons Claimed" value={(couponStats.claimed_slots ?? 0).toLocaleString('en-IN')}
            icon={HiCheckCircle} iconBg="bg-amber-50" iconColor="text-amber-600" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm font-extrabold text-slate-900 mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl px-4 py-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <a.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{a.label}</p>
                  <p className="text-[10px] text-slate-400">{a.desc}</p>
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
                { label: 'Job Seekers',       value: stats.jobSeekers       ?? 0, max: Math.max(stats.totalUsers, 1),     color: 'bg-blue-500'   },
                { label: 'Employers',          value: stats.employers         ?? 0, max: Math.max(stats.totalUsers, 1),     color: 'bg-indigo-500' },
                { label: 'Verified Companies', value: stats.verifiedCompanies ?? 0, max: Math.max(stats.totalCompanies, 1), color: 'bg-violet-500' },
              ].map((h) => {
                const pct = Math.min(100, Math.round((h.value / h.max) * 100));
                return (
                  <div key={h.label} className="space-y-1.5">
                    <div className="flex justify-between">
                      <p className="text-xs text-slate-500">{h.label}</p>
                      <p className="text-xs font-semibold text-slate-700">{h.value.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${h.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
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

      {/* Activity payments summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Activity Bookings" value={loading ? '—' : actPayments.length}
          icon={HiAcademicCap} iconBg="bg-sky-50" iconColor="text-sky-600" />
        <MiniCard label="Total Collected" value={loading ? '—' : `₹${actCollected.toLocaleString('en-IN')}`}
          icon={HiCash} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <MiniCard label="Held (pending payout)" value={loading ? '—' : `₹${actHeld.toLocaleString('en-IN')}`}
          icon={HiLockClosed} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <MiniCard label="Platform Earnings (15%)" value={loading ? '—' : `₹${actPlatform.toLocaleString('en-IN')}`}
          icon={HiCash} iconBg="bg-indigo-50" iconColor="text-indigo-600" />
      </div>

      {/* Recent Activity Transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <p className="text-sm font-extrabold text-slate-900">Recent Activity Transactions</p>
          <Link href="/admin/activities" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">View all →</Link>
        </div>
        {recentActPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="px-5 py-2.5 font-semibold">Activity</th>
                  <th className="px-3 py-2.5 font-semibold">Student</th>
                  <th className="px-3 py-2.5 font-semibold">Provider</th>
                  <th className="px-3 py-2.5 font-semibold">Session</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Amount</th>
                  <th className="px-5 py-2.5 font-semibold text-right">Payout</th>
                </tr>
              </thead>
              <tbody>
                {recentActPayments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-2.5 font-semibold text-slate-800 max-w-[160px] truncate">{p.activity_title ?? 'Activity'}</td>
                    <td className="px-3 py-2.5 text-slate-600">{p.booked_by_name ?? '—'}</td>
                    <td className="px-3 py-2.5 text-slate-600">{p.provider_name ?? '—'}</td>
                    <td className="px-3 py-2.5 text-slate-500">{fmtDate(p.session_date)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">₹{p.amount_paid ?? 0}</td>
                    <td className="px-5 py-2.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.payout_status === 'released' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.payout_status === 'released' ? 'Released' : 'Held'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 gap-2">
            <HiAcademicCap className="w-8 h-8 text-slate-300" />
            <p className="text-sm text-slate-400">{loading ? 'Loading…' : 'No activity transactions yet.'}</p>
          </div>
        )}
      </div>

      {/* Pending Reviews */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <p className="text-sm font-extrabold text-slate-900">Pending Reviews</p>
          <Link href="/admin/approvals" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">View all →</Link>
        </div>
        {pendingTotal > 0 ? (
          <div className="px-5 pb-5">
            <p className="text-sm text-slate-600">
              There {pendingTotal === 1 ? 'is' : 'are'}{' '}
              <span className="font-bold text-indigo-600">{pendingTotal}</span>{' '}
              pending {pendingTotal === 1 ? 'review' : 'reviews'} awaiting your attention.
            </p>
            <Link href="/admin/approvals"
              className="mt-3 inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
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
