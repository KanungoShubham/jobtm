'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiPencil, HiTrash, HiLocationMarker, HiPlusCircle } from 'react-icons/hi';
import { employerApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';
const STATUSES = ['all', 'open', 'closed', 'draft'];

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setLoading(true);
    employerApi.getJobs(token, status).then((r) => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const remove = async (id: string) => {
    const token = employerAuth.getToken();
    if (!token || !confirm('Delete this job?')) return;
    await employerApi.deleteJob(token, id);
    load();
  };

  const toggleStatus = async (job: any) => {
    const token = employerAuth.getToken();
    if (!token) return;
    const next = job.status === 'open' ? 'closed' : 'open';
    await employerApi.updateJob(token, job.id, { status: next });
    load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-slate-900">My Jobs</h1>
        <Link href="/employer/post-job" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: COLOR }}>
          <HiPlusCircle className="w-4 h-4" /> Post Job
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize"
            style={status === s ? { backgroundColor: COLOR, color: '#fff' } : { backgroundColor: '#F1F5F9', color: '#64748B' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : jobs.length === 0 ? (
        <p className="text-slate-400 text-sm">No jobs found.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate">{job.title}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <HiLocationMarker className="w-3.5 h-3.5" /> {job.location} · {job.type}
                </p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                  style={{ backgroundColor: job.status === 'open' ? '#D1FAE5' : '#FEE2E2', color: job.status === 'open' ? '#059669' : '#DC2626' }}>
                  {job.status}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleStatus(job)} className="text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 text-slate-500">
                  {job.status === 'open' ? 'Close' : 'Reopen'}
                </button>
                <button onClick={() => setEditing(job)} className="p-2 rounded-lg border border-slate-200 text-slate-500"><HiPencil className="w-4 h-4" /></button>
                <button onClick={() => remove(job.id)} className="p-2 rounded-lg border border-red-200 text-red-500"><HiTrash className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditJobModal job={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}

function EditJobModal({ job, onClose, onSaved }: { job: any; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(job.title ?? '');
  const [description, setDescription] = useState(job.description ?? '');
  const [location, setLocation] = useState(job.location ?? '');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setLoading(true);
    try {
      await employerApi.updateJob(token, job.id, { title, description, location });
      onSaved();
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold text-slate-800">Edit Job</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" rows={4} placeholder="Description" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" placeholder="Location" />
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500">Cancel</button>
          <button onClick={save} disabled={loading} className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: COLOR }}>
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
