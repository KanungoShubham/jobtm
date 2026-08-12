'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { employerApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';
const STATUSES = ['all', 'applied', 'shortlisted', 'rejected', 'hired'];

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setLoading(true);
    employerApi.getAllApplications(token, status).then((r) => setApps(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const updateStatus = async (id: string, newStatus: string) => {
    const token = employerAuth.getToken();
    if (!token) return;
    await employerApi.updateAppStatus(token, id, newStatus);
    load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-extrabold text-slate-900 mb-4">Applications</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
            style={status === s ? { backgroundColor: COLOR, color: '#fff' } : { backgroundColor: '#F1F5F9', color: '#64748B' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : apps.length === 0 ? (
        <p className="text-slate-400 text-sm">No applications found.</p>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Link href={`/employer/applicant/${app.jobseeker_id ?? app.applicant_id ?? app.user_id}`} className="font-bold text-slate-800 hover:underline">
                  {app.full_name ?? app.applicant_name ?? 'Applicant'}
                </Link>
                <p className="text-xs text-slate-400 truncate">{app.job_title ?? app.title} · Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}</p>
              </div>
              <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}
                className="text-xs font-semibold border border-slate-200 rounded-lg px-2 py-1.5 capitalize flex-shrink-0">
                {['applied', 'shortlisted', 'rejected', 'hired'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
