'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiLocationMarker, HiBriefcase } from 'react-icons/hi';
import { jobsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    jobsApi.savedList(token).then((r) => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-extrabold text-slate-900 mb-4">Saved Jobs</h1>
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : jobs.length === 0 ? (
        <p className="text-slate-400 text-sm">No saved jobs yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobseeker/job/${job.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition">
              <p className="font-bold text-slate-800 mb-1">{job.title}</p>
              <p className="text-xs text-slate-400 mb-2">{job.company_name ?? job.company}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1"><HiBriefcase className="w-3.5 h-3.5" /> {job.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
