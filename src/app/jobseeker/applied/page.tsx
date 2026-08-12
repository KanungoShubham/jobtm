'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';

const COLOR = '#0EA5E9';

export default function AppliedJobsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    jobsApi.myApplications(token).then((r) => setApps(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-extrabold text-slate-900 mb-4">Applied Jobs</h1>
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : apps.length === 0 ? (
        <p className="text-slate-400 text-sm">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <Link key={app.id} href={`/jobseeker/job/${app.job_id}`} className="block bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{app.job_title ?? app.title}</p>
                  <p className="text-xs text-slate-400">{app.company_name ?? app.company} · Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>{app.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
