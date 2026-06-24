'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiTicket, HiRefresh, HiExclamationCircle, HiCheckCircle,
  HiPlus, HiBan, HiPencil, HiX,
} from 'react-icons/hi';
import { couponsAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

// ── Helpers ───────────────────────────────────────────────────

const CATEGORIES = [
  { key: '',          label: 'All'      },
  { key: 'food',      label: 'Food'     },
  { key: 'medical',   label: 'Medical'  },
  { key: 'shopping',  label: 'Shopping' },
  { key: 'travel',    label: 'Travel'   },
];

const CAT_COLORS: Record<string, { badge: string; text: string }> = {
  food:     { badge: 'bg-orange-100 text-orange-700',   text: 'Food' },
  medical:  { badge: 'bg-emerald-100 text-emerald-700', text: 'Medical' },
  shopping: { badge: 'bg-violet-100 text-violet-700',   text: 'Shopping' },
  travel:   { badge: 'bg-blue-100 text-blue-700',       text: 'Travel' },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpired(c: any) {
  return !c.is_active || new Date(c.expires_at) < new Date();
}

const EMPTY_FORM = {
  title: '', brand: '', category: 'food', code: '',
  discount_value: '', discount_type: 'percent',
  min_order: '0', expires_at: '', total_count: '100',
};

// ── Create / Edit Modal ────────────────────────────────────────

function CouponModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form,    setForm]    = useState(initial);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const isEdit = !!initial.id;

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.brand.trim() || !form.code.trim() || !form.expires_at) {
      setError('Title, brand, code and expiry date are required.'); return;
    }
    const discV = parseInt(form.discount_value);
    if (isNaN(discV) || discV < 1) { setError('Discount value must be a positive number.'); return; }
    if (form.discount_type === 'percent' && discV > 100) { setError('Percent discount cannot exceed 100.'); return; }
    if (new Date(form.expires_at) <= new Date()) { setError('Expiry date must be in the future.'); return; }

    setSaving(true); setError('');
    try {
      const token   = getAdminToken() ?? '';
      const payload = {
        title:          form.title.trim(),
        brand:          form.brand.trim(),
        category:       form.category,
        code:           form.code.trim().toUpperCase(),
        discount_value: discV,
        discount_type:  form.discount_type,
        min_order:      Math.max(0, parseInt(form.min_order || '0')) * 100,
        expires_at:     new Date(form.expires_at).toISOString(),
        total_count:    Math.max(1, parseInt(form.total_count || '100')),
      };

      if (isEdit) {
        await couponsAdminApi.update(token, initial.id, payload);
      } else {
        await couponsAdminApi.create(token, payload);
      }

      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">
            {isEdit ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl flex items-center gap-2">
              <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. 20% off on your next order"
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => set('brand', e.target.value)}
                placeholder="Dominos"
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="food">Food</option>
                <option value="medical">Medical</option>
                <option value="shopping">Shopping</option>
                <option value="travel">Travel</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Coupon Code</label>
              <input
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="DOM20OFF"
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Discount Value</label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => set('discount_value', e.target.value)}
                placeholder="20"
                min={1}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => set('discount_type', e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                Min. Order (₹) <span className="font-normal text-slate-400">0 = none</span>
              </label>
              <input
                type="number"
                value={form.min_order}
                onChange={(e) => set('min_order', e.target.value)}
                min={0}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Total Count</label>
              <input
                type="number"
                value={form.total_count}
                onChange={(e) => set('total_count', e.target.value)}
                min={1}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Expiry Date</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => set('expires_at', e.target.value)}
                className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition disabled:opacity-60">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function CouponsPage() {
  const [stats,   setStats]   = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('');
  const [page,    setPage]    = useState(1);
  const [modal,   setModal]   = useState<any>(null);  // null | form object

  const load = useCallback(async (cat = filter, p = page) => {
    setLoading(true); setError('');
    try {
      const token = getAdminToken() ?? '';
      const [statsRes, listRes] = await Promise.all([
        couponsAdminApi.stats(token),
        couponsAdminApi.list(token, { category: cat || undefined, page: p }),
      ]);
      setStats(statsRes.data);
      setCoupons(listRes.data ?? []);
      setTotal(listRes.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const handleFilter = (cat: string) => { setFilter(cat); setPage(1); load(cat, 1); };

  const handleToggle = async (c: any) => {
    try {
      await couponsAdminApi.update(getAdminToken() ?? '', c.id, { is_active: !c.is_active });
      load();
    } catch (e: any) { alert(e.message); }
  };

  const pageCount = Math.ceil(total / 30);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiTicket className="w-6 h-6 text-red-600" />
            Coupons &amp; Rewards
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => load()} disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-3.5 py-2 rounded-xl shadow-sm transition">
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => setModal({ ...EMPTY_FORM })}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm">
            <HiPlus className="w-4 h-4" />
            New Coupon
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Batches',  value: stats.total,          bg: 'bg-slate-50',    text: 'text-slate-600' },
            { label: 'Active',         value: stats.active,         bg: 'bg-emerald-50',  text: 'text-emerald-600' },
            { label: 'Expired',        value: stats.expired,        bg: 'bg-red-50',      text: 'text-red-600' },
            { label: 'Total Slots',    value: stats.total_slots?.toLocaleString('en-IN'),  bg: 'bg-blue-50',    text: 'text-blue-600' },
            { label: 'Claimed Slots',  value: stats.claimed_slots?.toLocaleString('en-IN'), bg: 'bg-amber-50', text: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-100 p-4 shadow-sm`}>
              <p className={`text-2xl font-extrabold ${s.text}`}>{s.value ?? '—'}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Category breakdown */}
      {stats?.by_category && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-extrabold text-slate-900 mb-3">Active by Category</p>
          <div className="grid grid-cols-4 gap-3">
            {(['food', 'medical', 'shopping', 'travel'] as const).map((cat) => {
              const cc = CAT_COLORS[cat];
              return (
                <div key={cat} className={`rounded-xl p-3 ${cc.badge.split(' ')[0]}`}>
                  <p className="text-xl font-extrabold text-slate-900">{stats.by_category[cat] ?? 0}</p>
                  <p className="text-[10px] font-semibold text-slate-700">{cc.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c.key}
            onClick={() => handleFilter(c.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
              filter === c.key
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {c.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{total.toLocaleString('en-IN')} coupon{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <th className="text-left px-5 py-3">Coupon</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-left px-4 py-3">Discount</th>
                <th className="text-left px-4 py-3">Claimed</th>
                <th className="text-left px-4 py-3">Expires</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-3.5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <HiBan className="w-8 h-8 text-slate-300" />
                      <p className="text-sm text-slate-400">No coupons found</p>
                      <button
                        onClick={() => setModal({ ...EMPTY_FORM })}
                        className="mt-1 text-xs font-semibold text-red-600 hover:underline">
                        Create the first coupon →
                      </button>
                    </div>
                  </td>
                </tr>
              ) : coupons.map((c) => {
                const expired = isExpired(c);
                const cc = CAT_COLORS[c.category] ?? { badge: 'bg-slate-100 text-slate-600', text: c.category };
                const claimedPct = c.total_count > 0 ? Math.round((c.claimed_count / c.total_count) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-slate-800">{c.title}</p>
                        <p className="text-[11px] text-slate-400">{c.brand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cc.badge}`}>
                        {cc.text}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">
                      {c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`} off
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${claimedPct >= 90 ? 'bg-red-500' : claimedPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${claimedPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{c.claimed_count}/{c.total_count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className={expired ? 'text-red-500 font-medium' : 'text-slate-500'}>
                        {fmt(c.expires_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        expired ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {expired ? 'INACTIVE' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModal({
                            id: c.id, title: c.title, brand: c.brand,
                            category: c.category, code: c.code,
                            discount_value: String(c.discount_value),
                            discount_type: c.discount_type,
                            min_order: String(Math.round((c.min_order ?? 0) / 100)),
                            total_count: String(c.total_count),
                            expires_at: c.expires_at ? c.expires_at.slice(0, 16) : '',
                          })}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
                          <HiPencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggle(c)}
                          className={`p-1.5 rounded-lg transition text-xs font-bold px-2 ${
                            c.is_active
                              ? 'bg-red-50 hover:bg-red-100 text-red-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                          }`}>
                          {c.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50">
            <p className="text-xs text-slate-400">Page {page} of {pageCount}</p>
            <div className="flex gap-2">
              <button
                onClick={() => { const p = page - 1; setPage(p); load(filter, p); }}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition">
                ← Prev
              </button>
              <button
                onClick={() => { const p = page + 1; setPage(p); load(filter, p); }}
                disabled={page >= pageCount}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <CouponModal
          initial={modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
