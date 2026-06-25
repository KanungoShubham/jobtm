'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HiPhotograph, HiRefresh, HiExclamationCircle, HiCheckCircle, HiX,
  HiSearch, HiExternalLink,
} from 'react-icons/hi';
import { adsAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type Tab = 'pending' | 'active' | 'rejected' | 'expired';

const PAGE_SIZE = 10;

const STATUS_PILL: Record<string, string> = {
  pending_payment: 'bg-slate-100 text-slate-500',
  pending:  'bg-amber-100 text-amber-700',
  active:   'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  expired:  'bg-slate-100 text-slate-400',
};

function fmtDate(d?: string) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

function AdCard({ ad, onApprove, onReject, actioning }: {
  ad: any; onApprove: (id: string) => void; onReject: (id: string) => void; actioning: string | null;
}) {
  const isBusy = actioning === ad.id;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ad.image_url} alt={ad.title} className="w-full object-cover bg-slate-50" style={{ aspectRatio: '3 / 1' }} />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">{ad.title}</p>
            <p className="text-xs text-slate-500">
              {ad.advertiser_name ?? '—'}{ad.advertiser_mobile ? ` · ${ad.advertiser_mobile}` : ''}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_PILL[ad.status] ?? 'bg-slate-100'}`}>
            {ad.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-slate-400">Plan</span><p className="font-semibold text-slate-700">{ad.duration_days} days</p></div>
          <div><span className="text-slate-400">Paid</span><p className="font-semibold text-slate-700">₹{ad.amount_paid ?? 0}</p></div>
          <div><span className="text-slate-400">Runs</span><p className="font-semibold text-slate-700">{fmtDate(ad.starts_at)} → {fmtDate(ad.expires_at)}</p></div>
          <div><span className="text-slate-400">Payment</span><p className="font-semibold text-slate-700 truncate">{ad.payment_id ?? '—'}</p></div>
        </div>

        {ad.link_url && (
          <a href={ad.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline">
            <HiExternalLink className="w-3.5 h-3.5" /> {ad.link_url}
          </a>
        )}

        {ad.status === 'rejected' && ad.reject_note && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Rejection Note</p>
            <p className="text-xs text-red-700">{ad.reject_note}</p>
          </div>
        )}

        {ad.status === 'pending' && (
          <div className="flex gap-2 pt-1">
            <button onClick={() => onReject(ad.id)} disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition disabled:opacity-50">
              <HiX className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => onApprove(ad.id)} disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition disabled:opacity-50">
              {isBusy ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiCheckCircle className="w-4 h-4" />}
              {isBusy ? 'Approving…' : 'Approve & Go Live'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAdsPage() {
  const [tab,          setTab]          = useState<Tab>('pending');
  const [ads,          setAds]          = useState<any[]>([]);
  const [page,         setPage]         = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [error,        setError]        = useState('');
  const [actioning,    setActioning]    = useState<string | null>(null);
  const [query,        setQuery]        = useState('');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectNote,   setRejectNote]   = useState('');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const token = getAdminToken() ?? '';

  const hasMore = ads.length < total;

  // Load page 1 (resets the list)
  const loadFirst = useCallback(async () => {
    setLoading(true); setError(''); setAds([]); setPage(1); setTotal(0);
    try {
      const res = await adsAdminApi.list(token, tab, 1, PAGE_SIZE);
      setAds(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [tab, token]);

  // Append next page
  const loadNext = useCallback(async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await adsAdminApi.list(token, tab, nextPage, PAGE_SIZE);
      setAds((prev) => [...prev, ...(res.data ?? [])]);
      setTotal(res.total ?? 0);
      setPage(nextPage);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingMore(false); }
  }, [tab, token, loadingMore]);

  useEffect(() => { loadFirst(); }, [loadFirst]);

  // IntersectionObserver — fires when sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadNext(page + 1);
        }
      },
      { rootMargin: '120px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadNext, page]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      await adsAdminApi.verify(token, id, 'approve');
      setAds((prev) => prev.filter((a) => a.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) { setError(e.message); }
    finally { setActioning(null); }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActioning(rejectTarget);
    try {
      await adsAdminApi.verify(token, rejectTarget, 'reject', rejectNote);
      setAds((prev) => prev.filter((a) => a.id !== rejectTarget));
      setTotal((t) => t - 1);
      setRejectTarget(null); setRejectNote('');
    } catch (e: any) { setError(e.message); }
    finally { setActioning(null); }
  };

  const filtered = ads.filter((a) =>
    !query || a.title?.toLowerCase().includes(query.toLowerCase()) ||
    a.advertiser_name?.toLowerCase().includes(query.toLowerCase())
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: 'pending',  label: '⏳ Pending' },
    { key: 'active',   label: '✅ Active' },
    { key: 'rejected', label: '❌ Rejected' },
    { key: 'expired',  label: '⌛ Expired' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiPhotograph className="w-6 h-6 text-sky-500" /> Ad Banners
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Review paid banner ads · approve to go live in the app</p>
        </div>
        <button onClick={loadFirst} disabled={loading}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              tab === t.key ? 'text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
            style={tab === t.key ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}>
            {t.label}
          </button>
        ))}
        {total > 0 && (
          <span className="ml-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            {ads.length} / {total}
          </span>
        )}
      </div>

      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or advertiser…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 transition" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Reject Ad</h3>
            <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={3}
              placeholder="Reason for the advertiser (optional)…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-300 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectTarget(null); setRejectNote(''); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleRejectConfirm} disabled={!!actioning}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition disabled:opacity-60">
                {actioning ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiPhotograph className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No {tab} ads</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((ad) => (
              <AdCard key={ad.id} ad={ad} onApprove={handleApprove} onReject={(id) => setRejectTarget(id)} actioning={actioning} />
            ))}
          </div>

          {/* Scroll sentinel */}
          <div ref={sentinelRef} className="py-6 flex justify-center">
            {loadingMore ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Loading more…
              </div>
            ) : !hasMore && total > 0 ? (
              <p className="text-xs text-slate-300 font-medium">All {total} ads loaded</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
