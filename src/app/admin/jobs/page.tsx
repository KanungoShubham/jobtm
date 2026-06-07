'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiSearch, HiX, HiBriefcase, HiExclamationCircle, HiLocationMarker,
  HiCash, HiClock, HiRefresh, HiFlag, HiBan, HiCheck,
} from 'react-icons/hi';
import { jobsAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type JobStatus = 'all' | 'active' | 'flagged' | 'removed';

const STATUS_PILL: Record<string, string> = {
  active:  'bg-emerald-100 text-emerald-700',
  flagged: 'bg-amber-100   text-amber-700',
  removed: 'bg-red-100     text-red-600',
};

const STATUS_LABEL: Record<string, string> = {
  active:  '✅ Active',
  flagged: '⚠️ Flagged',
  removed: '🚫 Removed',
};

export default function AdminJobsPage() {
  const [query,       setQuery]       = useState('');
  const [statusFilter,setStatusFilter]= useState<JobStatus>('all');
  const [jobs,        setJobs]        = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [updating,    setUpdating]    = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (query.trim())           params.q      = query.trim();
      const res = await jobsAdminApi.list(getAdminToken() ?? '', params);
      setJobs(res.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, query]);

  useEffect(() => { load(); }, [load]);

  const moderate = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await jobsAdminApi.moderate(getAdminToken() ?? '', id, newStatus);
      setJobs((prev) => prev.map((j) => j.id === id ? { ...j, admin_status: newStatus } : j));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Job Listings</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-xl">{jobs.length} total</span>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, companies…"
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'flagged', 'removed'] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition capitalize ${
              statusFilter === s
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {s === 'all' ? 'All Jobs' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Job list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiBriefcase className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No jobs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const adminStatus: string = job.admin_status ?? 'active';
            const companyName: string = job.companies?.name ?? job.company ?? '';
            const isUpdating          = updating === job.id;

            return (
              <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-extrabold text-violet-600">{companyName.charAt(0) || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate">{job.title}</p>
                    <p className="text-xs text-slate-500">{companyName}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_PILL[adminStatus] ?? 'bg-slate-100 text-slate-500'}`}>
                    {adminStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    job.companies?.city ?? job.location
                      ? { icon: HiLocationMarker, text: job.companies?.city ?? job.location }
                      : null,
                    job.salary_min
                      ? { icon: HiCash, text: `₹${Math.round(job.salary_min / 1000)}K–${Math.round(job.salary_max / 1000)}K` }
                      : null,
                    job.created_at
                      ? { icon: HiClock, text: new Date(job.created_at).toLocaleDateString('en-IN') }
                      : null,
                  ].filter(Boolean).map((m: any) => (
                    <div key={m.icon} className="flex items-center gap-1">
                      <m.icon className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{m.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {/* Flag / Unflag */}
                  <button
                    disabled={isUpdating}
                    onClick={() => moderate(job.id, adminStatus === 'flagged' ? 'active' : 'flagged')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition ${
                      adminStatus === 'flagged'
                        ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                        : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                    }`}>
                    {isUpdating ? (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiFlag className="w-3.5 h-3.5" />
                    )}
                    {adminStatus === 'flagged' ? 'Unflag' : 'Flag'}
                  </button>

                  {/* Remove / Restore */}
                  <button
                    disabled={isUpdating}
                    onClick={() => moderate(job.id, adminStatus === 'removed' ? 'active' : 'removed')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition ${
                      adminStatus === 'removed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                    }`}>
                    {isUpdating ? (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : adminStatus === 'removed' ? (
                      <HiCheck className="w-3.5 h-3.5" />
                    ) : (
                      <HiBan className="w-3.5 h-3.5" />
                    )}
                    {adminStatus === 'removed' ? 'Restore' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
