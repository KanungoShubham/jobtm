'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HiCheckCircle, HiX, HiExclamationCircle, HiOfficeBuilding,
  HiPhone, HiDocumentText, HiRefresh, HiMail, HiGlobe,
  HiLocationMarker, HiIdentification, HiEye,
} from 'react-icons/hi';
import { companiesApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type Tab = 'Pending' | 'Approved' | 'Rejected';
const TAB_STATUS: Record<Tab, string> = { Pending: 'pending', Approved: 'approved', Rejected: 'rejected' };
const TAB_GRADIENT: Record<Tab, string> = {
  Pending:  'linear-gradient(135deg,#f59e0b,#d97706)',
  Approved: 'linear-gradient(135deg,#10b981,#059669)',
  Rejected: 'linear-gradient(135deg,#ef4444,#dc2626)',
};

const PAGE_SIZE = 10;

interface CompanyItem {
  id: string; name: string; industry: string; size: string;
  city: string; state: string; address: string; phone: string; email: string; website?: string;
  pan_number: string; cin_number: string; gst_number?: string;
  pan_doc_url?: string; cin_doc_url?: string;
  verify_status: string; rejection_note?: string; registered_at: string;
  profiles?: { full_name: string; mobile: string };
}

function RejectModal({ companyName, onConfirm, onCancel }: {
  companyName: string; onConfirm: (note: string) => void; onCancel: () => void;
}) {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-base font-extrabold text-slate-900 mb-1">Reject Company</h2>
        <p className="text-sm text-slate-500 mb-4">{companyName}</p>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
          Rejection Reason (optional)
        </label>
        <textarea
          className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-red-400 resize-none"
          rows={3} placeholder="Reason for rejection…" value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={() => onConfirm(note)}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyCard({ co, tab, processing, onApprove, onRejectClick }: {
  co: CompanyItem; tab: Tab; processing: string | null;
  onApprove: (id: string) => void; onRejectClick: (co: CompanyItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isProcessing = processing === co.id;

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden">
      <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-center gap-2">
        <HiOfficeBuilding className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-700 flex-1">
          {tab === 'Pending' ? 'New Company Registration' : tab === 'Approved' ? 'Approved Company' : 'Rejected Company'}
        </span>
        <span className="text-xs text-slate-400">{new Date(co.registered_at).toLocaleDateString('en-IN')}</span>
      </div>

      <div className="p-5 space-y-4">
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-extrabold text-blue-600">{co.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-extrabold text-slate-900">{co.name}</p>
            <p className="text-xs text-slate-500">{co.industry} · {co.city} · {co.size}</p>
          </div>
          <span className="text-slate-400 text-xs">{expanded ? '▲ less' : '▼ more'}</span>
        </button>

        {expanded && (
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            {[
              { icon: HiMail,           label: 'Email',   value: co.email },
              { icon: HiPhone,          label: 'Phone',   value: co.phone },
              { icon: HiGlobe,          label: 'Website', value: co.website ?? '—', href: co.website },
              { icon: HiLocationMarker, label: 'Address', value: `${co.address}, ${co.city}, ${co.state}` },
              { icon: HiIdentification, label: 'PAN No.', value: co.pan_number },
              { icon: HiDocumentText,   label: 'CIN',     value: co.cin_number },
              ...(co.gst_number ? [{ icon: HiDocumentText, label: 'GST', value: co.gst_number }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-2 text-sm">
                <row.icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 w-16 flex-shrink-0 text-xs">{row.label}</span>
                {(row as any).href ? (
                  <a href={(row as any).href} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs font-medium">{row.value}</a>
                ) : (
                  <span className="text-slate-700 font-medium text-xs">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Documents</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'PAN Card',         url: co.pan_doc_url, icon: HiDocumentText },
              { label: 'Reg. Certificate', url: co.cin_doc_url, icon: HiIdentification },
            ].map((doc) => (
              <div key={doc.label}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${doc.url ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <doc.icon className={`w-4 h-4 ${doc.url ? 'text-blue-500' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400">{doc.label}</p>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      <HiEye className="w-3 h-3" /> View Document
                    </a>
                  ) : (
                    <p className="text-xs font-semibold text-slate-400">Not uploaded</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {co.profiles && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <HiPhone className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Owner:</span>
            <span className="text-xs font-bold text-slate-900">{co.profiles.full_name}</span>
            <span className="text-xs text-slate-500">· {co.profiles.mobile}</span>
          </div>
        )}

        {tab === 'Rejected' && co.rejection_note && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Rejection Reason</p>
            <p className="text-xs text-red-700">{co.rejection_note}</p>
          </div>
        )}

        {tab === 'Pending' && (
          <div className="flex gap-2.5">
            <button disabled={isProcessing} onClick={() => onApprove(co.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold py-3 rounded-2xl text-sm transition">
              {isProcessing
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <HiCheckCircle className="w-4 h-4" />}
              Approve Company
            </button>
            <button disabled={isProcessing} onClick={() => onRejectClick(co)}
              className="w-12 flex items-center justify-center bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white rounded-2xl transition">
              <HiX className="w-5 h-5" />
            </button>
          </div>
        )}
        {tab === 'Approved' && (
          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
            <HiCheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-emerald-700 font-semibold">Verified & Approved</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminApprovalsPage() {
  const [tab,          setTab]          = useState<Tab>('Pending');
  const [companies,    setCompanies]    = useState<CompanyItem[]>([]);
  const [page,         setPage]         = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [error,        setError]        = useState('');
  const [rejectTarget, setRejectTarget] = useState<CompanyItem | null>(null);
  const [processing,   setProcessing]   = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = companies.length < total;

  const loadFirst = useCallback(async () => {
    setLoading(true); setError(''); setCompanies([]); setPage(1); setTotal(0);
    try {
      const token = getAdminToken() ?? '';
      const res   = await companiesApi.list(token, TAB_STATUS[tab], 1, PAGE_SIZE);
      setCompanies(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [tab]);

  const loadNext = useCallback(async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const token = getAdminToken() ?? '';
      const res   = await companiesApi.list(token, TAB_STATUS[tab], nextPage, PAGE_SIZE);
      setCompanies((prev) => [...prev, ...(res.data ?? [])]);
      setTotal(res.total ?? 0);
      setPage(nextPage);
    } catch (e: any) { setError(e.message); }
    finally { setLoadingMore(false); }
  }, [tab, loadingMore]);

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

  const approveCompany = async (id: string) => {
    setProcessing(id);
    try {
      await companiesApi.verify(getAdminToken() ?? '', id, 'approve');
      setCompanies((p) => p.filter((c) => c.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(null); }
  };

  const rejectCompany = async (id: string, note: string) => {
    setProcessing(id);
    setRejectTarget(null);
    try {
      await companiesApi.verify(getAdminToken() ?? '', id, 'reject', note || undefined);
      setCompanies((p) => p.filter((c) => c.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(null); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Review Queue</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Approvals</h1>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {companies.length} / {total}
            </span>
          )}
          <button onClick={loadFirst} disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="flex gap-2">
        {(['Pending', 'Approved', 'Rejected'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition ${
              tab === t ? 'text-white border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
            style={tab === t ? { background: TAB_GRADIENT[t] } : {}}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <HiCheckCircle className="w-9 h-9 text-emerald-500" />
          </div>
          <p className="text-base font-semibold text-slate-500">
            {tab === 'Pending' ? 'No pending reviews' : `No ${tab.toLowerCase()} companies`}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {companies.map((co) => (
              <CompanyCard
                key={co.id} co={co} tab={tab} processing={processing}
                onApprove={approveCompany}
                onRejectClick={setRejectTarget}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="py-4 flex justify-center">
            {loadingMore ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Loading more…
              </div>
            ) : !hasMore && total > 0 ? (
              <p className="text-xs text-slate-300 font-medium">All {total} companies loaded</p>
            ) : null}
          </div>
        </>
      )}

      {rejectTarget && (
        <RejectModal
          companyName={rejectTarget.name}
          onConfirm={(note) => rejectCompany(rejectTarget.id, note)}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
