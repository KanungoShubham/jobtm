'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HiCash, HiRefresh, HiExclamationCircle, HiCheckCircle,
  HiBan, HiUsers, HiCurrencyRupee, HiCalendar, HiPencil,
} from 'react-icons/hi';
import { subscriptionsApi, planSettingsApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const PAGE_SIZE = 10;

const TOP_TABS = [
  { key: 'list',  label: 'Subscriptions' },
  { key: 'plans', label: 'Plan Pricing' },
];

const FILTERS = [
  { key: '',            label: 'All' },
  { key: 'active',      label: 'Active' },
  { key: 'expired',     label: 'Expired' },
  { key: 'monthly',     label: 'Monthly' },
  { key: 'quarterly',   label: 'Quarterly' },
  { key: 'half_yearly', label: 'Half Yearly' },
  { key: 'yearly',      label: 'Yearly' },
];

const ROLE_FILTERS = [
  { key: '',           label: 'All Roles' },
  { key: 'jobseeker',  label: 'Jobseeker' },
  { key: 'employer',   label: 'Employer' },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(sub: any) {
  return !sub.is_active || new Date(sub.expires_at) < new Date();
}

const PLAN_COLORS: Record<string, string> = {
  monthly:     'bg-blue-100 text-blue-700',
  quarterly:   'bg-violet-100 text-violet-700',
  half_yearly: 'bg-emerald-100 text-emerald-700',
  yearly:      'bg-amber-100 text-amber-700',
};

// ── Plan Pricing Tab ──────────────────────────────────────────

function PlanPricingTab() {
  const [plans,   setPlans]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [editId,  setEditId]  = useState<string | null>(null);
  const [editAmt, setEditAmt] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await planSettingsApi.list(getAdminToken() ?? '');
      setPlans(res.data ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (plan: any) => { setEditId(plan.id); setEditAmt(String(Math.round(plan.amount / 100))); setSuccess(''); };
  const cancelEdit = () => { setEditId(null); setEditAmt(''); };

  const saveAmount = async (id: string) => {
    const inr = parseFloat(editAmt);
    if (isNaN(inr) || inr < 1) { setError('Enter a valid amount.'); return; }
    setSaving(true); setError('');
    try {
      await planSettingsApi.update(getAdminToken() ?? '', id, Math.round(inr * 100));
      setSuccess('Price updated.');
      setTimeout(() => setSuccess(''), 3000);
      setEditId(null);
      load();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const jobseekerPlans = plans.filter((p) => p.role === 'jobseeker');
  const employerPlans  = plans.filter((p) => p.role === 'employer');

  const PlanCard = ({ plan }: { plan: any }) => {
    const isEditing = editId === plan.id;
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLORS[plan.plan_type] ?? 'bg-slate-100 text-slate-600'}`}>
              {plan.label}
            </span>
            {plan.badge && (
              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full tracking-widest">
                {plan.badge.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{plan.description}</p>
          <p className="text-xs text-slate-400 mt-0.5">{plan.validity_label}</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-700">₹</span>
              <input type="number" value={editAmt} onChange={(e) => setEditAmt(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-24 border-2 border-indigo-400 bg-white rounded-xl px-3 py-2 text-base font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400" autoFocus />
              <button onClick={() => saveAmount(plan.id)} disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-60">
                {saving ? '…' : 'Save'}
              </button>
              <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-slate-900">₹{(plan.amount / 100).toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-400">{plan.validity_label}</p>
              </div>
              <button onClick={() => startEdit(plan)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                <HiPencil className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiCheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Changes take effect immediately for new subscriptions. Existing subscriptions keep their original pricing.
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-sm font-extrabold text-slate-900">Jobseeker Plans</p>
              <span className="text-[10px] text-slate-400 font-semibold">· applies to mobile app job applications</span>
            </div>
            <div className="space-y-3">{jobseekerPlans.map((p) => <PlanCard key={p.id} plan={p} />)}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <p className="text-sm font-extrabold text-slate-900">Employer Plans</p>
              <span className="text-[10px] text-slate-400 font-semibold">· applies to employer job posting</span>
            </div>
            <div className="space-y-3">{employerPlans.map((p) => <PlanCard key={p.id} plan={p} />)}</div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Subscriptions list tab ────────────────────────────────────

function SubscriptionsListTab() {
  const [stats,       setStats]       = useState<any>(null);
  const [subs,        setSubs]        = useState<any[]>([]);
  const [page,        setPage]        = useState(1);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState('');
  const [filter,      setFilter]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const token = getAdminToken() ?? '';
  const hasMore = subs.length < total;

  const buildApiParams = useCallback((p: number) => {
    const planType = ['monthly', 'quarterly', 'half_yearly', 'yearly'].includes(filter) ? filter : undefined;
    const active   = filter === 'active' ? 'true' : filter === 'expired' ? 'false' : undefined;
    return { plan_type: planType, active, page: p, limit: PAGE_SIZE };
  }, [filter]);

  const loadFirst = useCallback(async () => {
    setLoading(true); setError(''); setSubs([]); setPage(1); setTotal(0);
    try {
      const [statsRes, listRes] = await Promise.all([
        subscriptionsApi.stats(token),
        subscriptionsApi.list(token, buildApiParams(1)),
      ]);
      setStats(statsRes.data);
      setSubs(listRes.data ?? []);
      setTotal(listRes.total ?? 0);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [token, buildApiParams]);

  const loadNext = useCallback(async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await subscriptionsApi.list(token, buildApiParams(nextPage));
      setSubs((prev) => [...prev, ...(res.data ?? [])]);
      setTotal(res.total ?? 0);
      setPage(nextPage);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingMore(false); }
  }, [token, buildApiParams, loadingMore]);

  useEffect(() => { loadFirst(); }, [loadFirst]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) loadNext(page + 1);
      },
      { rootMargin: '120px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadNext, page]);

  // role filter is client-side — applied at render time
  const visibleSubs = roleFilter ? subs.filter((s) => (s.role ?? 'jobseeker') === roleFilter) : subs;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total',           value: stats.total,     icon: HiUsers,         color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-100' },
            { label: 'Active',          value: stats.active,    icon: HiCheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Monthly Plans',   value: stats.monthly,   icon: HiCalendar,      color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
            { label: 'Quarterly Plans', value: stats.quarterly, icon: HiCalendar,      color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100' },
            { label: 'Total Revenue',   value: `₹${((stats.total_revenue ?? 0) / 100).toLocaleString('en-IN')}`,
              icon: HiCurrencyRupee, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4 shadow-sm`}>
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <p className="text-xl font-extrabold text-slate-900">
                {typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {ROLE_FILTERS.map((r) => (
          <button key={r.key} onClick={() => setRoleFilter(r.key)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition border ${
              roleFilter === r.key
                ? 'text-white border-transparent'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={roleFilter === r.key ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
            {r.label}
          </button>
        ))}
        <div className="w-px h-5 bg-slate-200" />
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition border ${
              filter === f.key
                ? 'text-white border-transparent'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={filter === f.key ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
            {f.label}
          </button>
        ))}
        {total > 0 && (
          <span className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {subs.length} / {total}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Started</th>
                <th className="text-left px-4 py-3">Expires</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + (i + j) * 7}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : visibleSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <HiBan className="w-8 h-8 text-slate-300" />
                      <p className="text-sm text-slate-400">No subscriptions found</p>
                    </div>
                  </td>
                </tr>
              ) : visibleSubs.map((sub) => {
                const expired = isExpired(sub);
                const user    = sub.profiles ?? {};
                const role    = sub.role ?? 'jobseeker';
                return (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-slate-800">{user.full_name ?? '—'}</p>
                        <p className="text-[11px] text-slate-400">{user.mobile ?? '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        role === 'employer' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {role === 'employer' ? 'Employer' : 'Jobseeker'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PLAN_COLORS[sub.plan_type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {sub.plan_type.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      ₹{(sub.amount_paid / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{fmt(sub.starts_at)}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">
                      <span className={expired ? 'text-red-500 font-medium' : ''}>{fmt(sub.expires_at)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        expired ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {expired ? 'EXPIRED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div ref={sentinelRef} className="py-4 flex justify-center border-t border-slate-50">
          {loadingMore ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Loading more…
            </div>
          ) : !hasMore && total > 0 ? (
            <p className="text-xs text-slate-300 font-medium">All {total} subscriptions loaded</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiCash className="w-6 h-6 text-emerald-600" /> Subscriptions
          </h1>
        </div>
        <button onClick={() => { }} className="hidden" />
      </div>

      <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
        {TOP_TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              activeTab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'list'  && <SubscriptionsListTab />}
      {activeTab === 'plans' && <PlanPricingTab />}
    </div>
  );
}
