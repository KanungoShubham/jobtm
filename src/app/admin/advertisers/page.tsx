'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiUserGroup, HiRefresh, HiExclamationCircle, HiX, HiCheckCircle,
  HiSearch, HiExternalLink, HiPhone, HiMail, HiOfficeBuilding,
} from 'react-icons/hi';
import { adsAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type Tab = 'pending' | 'approved' | 'rejected';

const PILL: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

function Row({ label, value, icon: Icon, link }: { label: string; value?: string; icon?: any; link?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />}
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>
        {link ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-600 hover:underline break-all">{value}</a>
        ) : (
          <p className="text-xs font-semibold text-slate-700 break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

function AdvertiserCard({ a, onApprove, onReject, actioning }: {
  a: any; onApprove: (id: string) => void; onReject: (id: string) => void; actioning: string | null;
}) {
  const isBusy = actioning === a.id;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900 truncate">{a.business_name}</p>
          <p className="text-xs text-slate-500">{a.contact_name} · {a.user_role}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${PILL[a.status] ?? 'bg-slate-100'}`}>{a.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3">
        <Row label="Mobile"  value={a.mobile} icon={HiPhone} />
        <Row label="Email"   value={a.email} icon={HiMail} />
        <Row label="Company" value={a.company_name} icon={HiOfficeBuilding} />
        <Row label="Reg. No." value={a.business_reg_number} />
        <Row label="Website" value={a.website} icon={HiExternalLink} link />
        <Row label="Address" value={a.company_address} />
      </div>

      {a.status === 'rejected' && a.reject_note && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Rejection Note</p>
          <p className="text-xs text-red-700">{a.reject_note}</p>
        </div>
      )}

      {a.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => onReject(a.id)} disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition disabled:opacity-50">
            <HiX className="w-4 h-4" /> Reject
          </button>
          <button onClick={() => onApprove(a.id)} disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition disabled:opacity-50">
            {isBusy ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiCheckCircle className="w-4 h-4" />}
            {isBusy ? 'Approving…' : 'Approve'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminAdvertisersPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioning, setActioning] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const token = getAdminToken() ?? '';

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await adsAdminApi.listAdvertisers(token, tab); setList(res.data ?? []); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [tab, token]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try { await adsAdminApi.verifyAdvertiser(token, id, 'approve'); setList((p) => p.filter((x) => x.id !== id)); }
    catch (e: any) { setError(e.message); } finally { setActioning(null); }
  };
  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActioning(rejectTarget);
    try {
      await adsAdminApi.verifyAdvertiser(token, rejectTarget, 'reject', rejectNote);
      setList((p) => p.filter((x) => x.id !== rejectTarget));
      setRejectTarget(null); setRejectNote('');
    } catch (e: any) { setError(e.message); } finally { setActioning(null); }
  };

  const filtered = list.filter((a) => !query ||
    a.business_name?.toLowerCase().includes(query.toLowerCase()) ||
    a.contact_name?.toLowerCase().includes(query.toLowerCase()) ||
    a.mobile?.includes(query));

  const TABS: { key: Tab; label: string }[] = [
    { key: 'pending',  label: '⏳ Pending' },
    { key: 'approved', label: '✅ Approved' },
    { key: 'rejected', label: '❌ Rejected' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiUserGroup className="w-6 h-6 text-sky-500" /> Advertisers
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Approve advertiser business profiles before they can run ads</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${tab === t.key ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
            {t.label}{tab === t.key && filtered.length > 0 ? ` (${filtered.length})` : ''}
          </button>
        ))}
      </div>

      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by business, name or mobile…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 transition" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Reject Advertiser</h3>
            <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} rows={3}
              placeholder="Reason (optional)…"
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
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiUserGroup className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No {tab} advertisers</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <AdvertiserCard key={a.id} a={a} onApprove={handleApprove} onReject={(id) => setRejectTarget(id)} actioning={actioning} />
          ))}
        </div>
      )}
    </div>
  );
}
