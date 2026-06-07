'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiCheckCircle, HiX, HiExclamationCircle, HiBriefcase,
  HiOfficeBuilding, HiIdentification, HiFlag, HiPhone,
  HiDocumentText, HiRefresh,
} from 'react-icons/hi';
import { companiesApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type ApprovalType = 'job' | 'employer' | 'aadhar' | 'complaint';

interface CompanyItem {
  id: string; name: string; industry: string; size: string; city: string;
  pan_number: string; cin_number: string; verify_status: string;
  registered_at: string; profiles?: { full_name: string; mobile: string };
}

interface GenericItem {
  id: string; type: ApprovalType; title: string;
  subtitle: string; detail: string; time: string;
}

const TYPE_CFG: Record<ApprovalType, { icon: any; color: string; bg: string; label: string }> = {
  job:       { icon: HiBriefcase,     color: 'text-violet-600', bg: 'bg-violet-50',  label: 'Job' },
  employer:  { icon: HiOfficeBuilding,color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'Employer' },
  aadhar:    { icon: HiIdentification,color: 'text-emerald-600',bg: 'bg-emerald-50', label: 'Aadhar' },
  complaint: { icon: HiFlag,          color: 'text-red-500',    bg: 'bg-red-50',     label: 'Report' },
};


const FILTERS = ['All', 'Employer', 'Job', 'Aadhar', 'Report'];

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
          Rejection note (optional)
        </label>
        <textarea
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-red-400 resize-none"
          rows={3}
          placeholder="Reason for rejection…"
          value={note}
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

export default function AdminApprovalsPage() {
  const [companies,  setCompanies]  = useState<CompanyItem[]>([]);
  const [items,      setItems]      = useState<GenericItem[]>([]);
  const [dismissed,  setDismissed]  = useState<Set<string>>(new Set());
  const [filter,     setFilter]     = useState('All');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [rejectTarget, setRejectTarget] = useState<CompanyItem | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const token = getAdminToken() ?? '';
      const res   = await companiesApi.list(token, 'pending');
      setCompanies(res.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const approveCompany = async (id: string) => {
    setProcessing(id);
    try {
      await companiesApi.verify(getAdminToken() ?? '', id, 'approve');
      setCompanies((p) => p.filter((c) => c.id !== id));
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(null); }
  };

  const rejectCompany = async (id: string, note: string) => {
    setProcessing(id);
    setRejectTarget(null);
    try {
      await companiesApi.verify(getAdminToken() ?? '', id, 'reject', note || undefined);
      setCompanies((p) => p.filter((c) => c.id !== id));
    } catch (e: any) { setError(e.message); }
    finally { setProcessing(null); }
  };

  const dismissItem = (id: string) => setDismissed((p) => new Set([...p, id]));
  const approveItem = (id: string) => setDismissed((p) => new Set([...p, id]));

  const pendingCompanies = companies;
  const visibleItems = items
    .filter((i) => !dismissed.has(i.id))
    .filter((i) => filter === 'All' || TYPE_CFG[i.type].label === filter);

  const totalPending = pendingCompanies.length + visibleItems.length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Review Queue</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Approvals</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow shadow-red-600/30">
            <span className="text-sm font-extrabold text-white">{totalPending}</span>
          </div>
          <button onClick={load} disabled={loading}
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

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              filter === f
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Company Registrations */}
      {(filter === 'All' || filter === 'Employer') && (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pendingCompanies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider">
                  COMPANY VERIFY
                </span>
                <span className="text-xs font-semibold text-slate-500">{pendingCompanies.length} pending</span>
              </div>

              {pendingCompanies.map((co) => (
                <div key={co.id} className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden">
                  <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-center gap-2">
                    <HiOfficeBuilding className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 flex-1">New Company Registration</span>
                    <span className="text-xs text-slate-400">
                      {new Date(co.registered_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <span className="text-xl font-extrabold text-blue-600">{co.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-slate-900">{co.name}</p>
                        <p className="text-xs text-slate-500">{co.industry} · {co.city} · {co.size} employees</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Documents</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'PAN Card', value: co.pan_number, icon: HiDocumentText },
                          { label: 'CIN',      value: co.cin_number, icon: HiIdentification },
                        ].map((doc) => (
                          <div key={doc.label}
                            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                            <doc.icon className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-[10px] text-slate-400">{doc.label}</p>
                              <p className="text-xs font-bold text-slate-800">{doc.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {co.profiles && (
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                        <HiPhone className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">Admin: </span>
                        <span className="text-xs font-bold text-slate-900">{co.profiles.mobile}</span>
                        <span className="text-xs text-slate-500 ml-1">({co.profiles.full_name})</span>
                      </div>
                    )}

                    <div className="flex gap-2.5">
                      <button
                        disabled={processing === co.id}
                        onClick={() => approveCompany(co.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold py-3 rounded-2xl text-sm transition">
                        {processing === co.id
                          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <HiCheckCircle className="w-4 h-4" />}
                        Approve Company
                      </button>
                      <button
                        disabled={processing === co.id}
                        onClick={() => setRejectTarget(co)}
                        className="w-12 flex items-center justify-center bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white rounded-2xl transition">
                        <HiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Generic approval items */}
      {visibleItems.length > 0 && (
        <div className="space-y-3">
          {visibleItems.map((item) => {
            const cfg = TYPE_CFG[item.type];
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {cfg.label}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
                <div className="mx-4 mb-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-slate-600">{item.detail}</p>
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  <button onClick={() => approveItem(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition">
                    <HiCheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => dismissItem(item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition">
                    <HiX className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && totalPending === 0 && (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <HiCheckCircle className="w-9 h-9 text-emerald-500" />
          </div>
          <p className="text-base font-semibold text-slate-500">All caught up!</p>
          <p className="text-sm text-slate-400">No pending reviews.</p>
        </div>
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
