'use client';
import { useCallback, useEffect, useState } from 'react';
import { HiClipboardList, HiRefresh, HiExclamationCircle, HiUser, HiClock } from 'react-icons/hi';
import { auditApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

export default function AdminAuditPage() {
  const [logs,    setLogs]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await auditApi.list(getAdminToken() ?? '');
      setLogs(res.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Audit Log</h1>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiClipboardList className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No audit entries yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
          {logs.map((log, i) => (
            <div key={log.id ?? i} className="flex items-start gap-3 px-5 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <HiUser className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  <span className="font-bold">{log.action}</span>
                  {log.target_type && <span className="text-slate-400"> on {log.target_type}</span>}
                </p>
                {log.note && <p className="text-xs text-slate-500 mt-0.5">{log.note}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <HiClock className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-400">
                  {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
