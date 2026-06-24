'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiSearch, HiX, HiBriefcase, HiExclamationCircle, HiLocationMarker,
  HiCash, HiClock, HiRefresh, HiFlag, HiBan, HiCheck, HiChevronDown,
  HiChevronUp, HiUsers, HiAcademicCap, HiCalendar, HiLightningBolt,
} from 'react-icons/hi';
import { jobsAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type JobStatus = 'all' | 'active' | 'draft' | 'flagged' | 'removed';

const STATUS_PILL: Record<string, string> = {
  active:  'bg-emerald-100 text-emerald-700',
  draft:   'bg-slate-100   text-slate-500',
  flagged: 'bg-amber-100   text-amber-700',
  removed: 'bg-red-100     text-red-600',
};

const STATUS_LABEL: Record<string, string> = {
  active:  '✅ Active',
  draft:   '📝 Draft',
  flagged: '⚠️ Flagged',
  removed: '🚫 Removed',
};

const SALARY_PERIOD_LABEL: Record<string, string> = {
  per_day: '/day', per_week: '/week', per_month: '/mo',
  per_6months: '/6mo', per_year: '/yr',
};

const WORK_MODE_ICON: Record<string, string> = {
  onsite: '🏢', remote: '🌐', hybrid: '🔀',
};

function JobCard({ job, onModerate }: { job: any; onModerate: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const adminStatus: string = job.admin_status ?? (job.status === 'draft' ? 'draft' : 'active');
  const companyName: string = job.companies?.name ?? job.company ?? '';
  const skills: string[]    = job.skills ?? [];

  const salaryText = () => {
    if (job.salary_label) {
      const period = SALARY_PERIOD_LABEL[job.salary_period] ?? '';
      return `${job.salary_label}${period}`;
    }
    if (!job.salary_min && !job.salary_max) return null;
    const period = SALARY_PERIOD_LABEL[job.salary_period] ?? '';
    const min = Number(job.salary_min).toLocaleString('en-IN');
    const max = Number(job.salary_max).toLocaleString('en-IN');
    if (job.salary_min && job.salary_max) return `₹${min}–₹${max}${period}`;
    return `₹${min || max}+${period}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-extrabold text-violet-600">{companyName.charAt(0) || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">{job.title}</p>
            <p className="text-xs text-slate-500">
              {companyName}
              {(job.companies?.city ?? job.location) && ` · ${job.companies?.city ?? job.location}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[adminStatus] ?? 'bg-slate-100 text-slate-500'}`}>
              {adminStatus}
            </span>
            {expanded ? <HiChevronUp className="w-4 h-4 text-slate-400" /> : <HiChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Quick badges */}
        <div className="flex flex-wrap gap-1.5">
          {job.job_type && (
            <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {job.job_type}
            </span>
          )}
          {job.work_mode && (
            <span className="bg-violet-50 text-violet-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {WORK_MODE_ICON[job.work_mode] ?? ''} {job.work_mode}
            </span>
          )}
          {job.is_urgent && (
            <span className="bg-red-50 text-red-500 text-[11px] font-semibold px-2.5 py-1 rounded-full">⚡ Urgent</span>
          )}
          {job.is_hindi && (
            <span className="bg-orange-50 text-orange-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">🗣 Hindi</span>
          )}
          {salaryText() && (
            <span className="bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {salaryText()}
            </span>
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 space-y-3">
          <div className="flex flex-wrap gap-4 pt-3">
            {[
              { icon: HiUsers,     text: job.openings ? `${job.openings} opening${job.openings !== 1 ? 's' : ''}` : null },
              { icon: HiAcademicCap, text: job.experience ?? null },
              { icon: HiCalendar,  text: job.last_apply_date ? `Apply by: ${job.last_apply_date}` : null },
              { icon: HiClock,     text: job.created_at ? `Posted: ${new Date(job.created_at).toLocaleDateString('en-IN')}` : null },
            ].filter((m) => m.text).map((m, i) => (
              <div key={i} className="flex items-center gap-1">
                <m.icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{m.text}</span>
              </div>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-6">{job.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        {adminStatus === 'draft' && (
          <button onClick={() => onModerate(job.id, 'active')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition">
            <HiCheck className="w-3.5 h-3.5" /> Activate
          </button>
        )}
        <button onClick={() => onModerate(job.id, adminStatus === 'flagged' ? 'active' : 'flagged')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition ${
            adminStatus === 'flagged'
              ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
              : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
          }`}>
          <HiFlag className="w-3.5 h-3.5" />
          {adminStatus === 'flagged' ? 'Unflag' : 'Flag'}
        </button>
        <button onClick={() => onModerate(job.id, adminStatus === 'removed' ? 'active' : 'removed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition ${
            adminStatus === 'removed'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
              : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          }`}>
          {adminStatus === 'removed' ? <HiCheck className="w-3.5 h-3.5" /> : <HiBan className="w-3.5 h-3.5" />}
          {adminStatus === 'removed' ? 'Restore' : 'Remove'}
        </button>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  const [query,        setQuery]        = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus>('all');
  const [jobs,         setJobs]         = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [updating,     setUpdating]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (query.trim())           params.q      = query.trim();
      const res = await jobsAdminApi.list(getAdminToken() ?? '', params);
      setJobs(res.data ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [statusFilter, query]);

  useEffect(() => { load(); }, [load]);

  const moderate = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await jobsAdminApi.moderate(getAdminToken() ?? '', id, newStatus);
      setJobs((prev) => prev.map((j) =>
        j.id === id ? { ...j, admin_status: newStatus, status: newStatus === 'active' ? 'active' : j.status } : j
      ));
    } catch (e: any) { setError(e.message); }
    finally { setUpdating(null); }
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
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs, companies…"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 transition" />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'draft', 'flagged', 'removed'] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              statusFilter === s
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {s === 'all' ? 'All Jobs' : STATUS_LABEL[s] ?? s}
          </button>
        ))}
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
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiBriefcase className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No jobs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onModerate={moderate} />
          ))}
        </div>
      )}
    </div>
  );
}
