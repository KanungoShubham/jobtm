'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';
import { jobsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';

const STATUS: Record<string, { bg: string; fg: string }> = {
  pending:     { bg: '#FEF3C7', fg: '#92400E' },
  applied:     { bg: '#DBEAFE', fg: '#1D4ED8' },
  viewed:      { bg: '#DBEAFE', fg: '#1D4ED8' },
  shortlisted: { bg: '#DBEAFE', fg: '#1D4ED8' },
  interview:   { bg: '#E0E7FF', fg: '#3730A3' },
  selected:    { bg: '#D1FAE5', fg: '#065F46' },
  hired:       { bg: '#D1FAE5', fg: '#065F46' },
  accepted:    { bg: '#D1FAE5', fg: '#065F46' },
  rejected:    { bg: '#FEE2E2', fg: '#991B1B' },
};

/** The API may return the job flat on the application, or nested (job / jobs) with a joined company. Read every shape. */
function describe(app: any) {
  const job = app.job ?? app.jobs ?? {};
  const company = app.company ?? app.companies ?? job.company ?? job.companies ?? {};
  const companyObj = typeof company === 'object' && company !== null ? company : {};
  return {
    jobId: app.job_id ?? job.id ?? app.id,
    title: app.job_title ?? app.title ?? app.job_name ?? job.title ?? job.job_title ?? '',
    company:
      app.company_name ?? companyObj.name ?? companyObj.company_name ?? job.company_name ??
      (typeof company === 'string' ? company : '') ?? '',
    location: app.location ?? job.location ?? job.locations?.[0] ?? companyObj.city ?? '',
    date: app.created_at ?? app.applied_at ?? app.updated_at ?? null,
    status: String(app.status ?? 'pending'),
  };
}

export default function AppliedJobsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    jobsApi.myApplications(token).then((r) => setApps(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl font-bold text-slate-900 mb-1">Applied Jobs</h1>
      <p className="text-sm text-slate-500 mb-6">Track every application and its status.</p>

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : apps.length === 0 ? (
        <p className="text-slate-400 text-sm">You haven&apos;t applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {apps.map((app, i) => {
            const d = describe(app);
            const st = STATUS[d.status.toLowerCase()] ?? STATUS.applied;
            const title = d.title || 'Job listing';
            return (
              <Link
                key={app.id ?? i}
                href={`/jobseeker/job/${d.jobId}`}
                className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-warm"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#136BAB] to-[#3b82f6] text-lg font-black text-white">
                  {(d.company || title).charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-slate-900">{title}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {[d.company, d.location].filter(Boolean).join(' · ') || '—'}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                    Applied {d.date ? new Date(d.date).toLocaleDateString('en-IN') : ''}
                  </span>
                </span>
                <span className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize" style={{ backgroundColor: st.bg, color: st.fg }}>
                  {d.status}
                </span>
                <HiChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
