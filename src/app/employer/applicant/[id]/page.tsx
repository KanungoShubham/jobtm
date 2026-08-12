'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';
import { employerApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';

export default function ApplicantProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = employerAuth.getToken();
    if (!token || !id) return;
    employerApi.getApplicant(token, id).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;
  if (!data) return <div className="p-6 text-slate-400 text-sm">Applicant not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <HiArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: COLOR }}>
            {(data.full_name ?? 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">{data.full_name}</h1>
            <p className="text-sm text-slate-400">{data.headline ?? data.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-400">Email:</span> <span className="text-slate-700">{data.email}</span></div>
          <div><span className="text-slate-400">Mobile:</span> <span className="text-slate-700">{data.mobile}</span></div>
          <div><span className="text-slate-400">Location:</span> <span className="text-slate-700">{data.location}</span></div>
        </div>
      </div>

      {data.skills?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-slate-800 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s: string) => (
              <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#EDE9FE', color: COLOR }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {data.work?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-slate-800 mb-3">Work Experience</h2>
          {data.work.map((w: any) => (
            <div key={w.id} className="mb-3 last:mb-0">
              <p className="font-semibold text-sm text-slate-800">{w.title} · {w.company}</p>
              <p className="text-xs text-slate-400">{w.start_date} – {w.end_date ?? 'Present'}</p>
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-3">Education</h2>
          {data.education.map((ed: any) => (
            <div key={ed.id} className="mb-3 last:mb-0">
              <p className="font-semibold text-sm text-slate-800">{ed.degree} · {ed.institution}</p>
              <p className="text-xs text-slate-400">{ed.start_year} – {ed.end_year ?? 'Present'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
