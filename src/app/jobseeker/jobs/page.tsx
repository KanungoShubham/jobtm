'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  HiSearch, HiLocationMarker, HiBriefcase, HiUsers, HiStar, HiLightningBolt, HiBookmark,
} from 'react-icons/hi';
import { jobsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';
const PAGE_SIZE = 10;

function timeAgo(iso: string) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback((pageNum: number, append = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (append) setLoadingMore(true); else setLoading(true);
    jobsApi.list({ q: q || undefined, location: location || undefined, page: pageNum, limit: PAGE_SIZE })
      .then((r) => {
        setTotal(r.total ?? 0);
        setJobs((prev) => (append ? [...prev, ...(r.data ?? [])] : r.data ?? []));
        setPage(pageNum);
      })
      .catch(() => {})
      .finally(() => { loadingRef.current = false; setLoading(false); setLoadingMore(false); });
  }, [q, location]);

  useEffect(() => { fetchPage(1); }, [q, location, fetchPage]);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    jobsApi.savedList(token).then((r) => setSavedIds((r.data ?? []).map((j: any) => j.id ?? j.job_id))).catch(() => {});
  }, []);

  const hasMore = jobs.length < total;

  // Infinite scroll — load next 10 jobs when sentinel enters view
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) fetchPage(page + 1, true);
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, page, fetchPage]);

  const toggleSave = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const token = jobseekerAuth.getToken();
    if (!token) return;
    const isSaved = savedIds.includes(id);
    setSavedIds((prev) => (isSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    try { await jobsApi.saveJob(token, id); } catch { setSavedIds((prev) => (isSaved ? [...prev, id] : prev.filter((x) => x !== id))); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6 animate-fade-in-up">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, company, skill…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50 transition" />
        </div>
        <div className="relative flex-1">
          <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="All locations — filter by city"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50 transition" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">{loading ? 'Loading…' : `${total} job${total !== 1 ? 's' : ''}`}</p>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm py-12 text-center">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">No jobs found.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job: any, i: number) => {
              const company = job.companies ?? {};
              const isSaved = savedIds.includes(job.id);
              return (
                <ScrollReveal key={job.id} animation="fade-up" delay={(i % PAGE_SIZE) * 40}>
                  <Link href={`/jobseeker/job/${job.id}`} className="block h-full rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-warm-lg hover-lift transition-all duration-300 p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
                          {(company.name ?? job.title ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">{job.title}</p>
                          <p className="text-xs text-slate-400 truncate">{company.name ?? '—'}</p>
                        </div>
                      </div>
                      <button onClick={(e) => toggleSave(e, job.id)} className="flex-shrink-0 p-1">
                        <HiBookmark className="w-5 h-5" style={{ color: isSaved ? COLOR : '#CBD5E1' }} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                        <HiLocationMarker className="w-3 h-3" /> {job.locations?.[0] ?? company.city ?? '—'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                        <HiBriefcase className="w-3 h-3" /> {job.job_type ?? 'Full Time'}
                      </span>
                      {job.is_urgent && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                          <HiLightningBolt className="w-3 h-3" /> Urgent
                        </span>
                      )}
                      {job.ratingCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                          <HiStar className="w-3 h-3" /> {job.rating}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Salary</p>
                        <p className="text-sm font-bold text-slate-900">{job.salary_label ?? 'Not disclosed'}</p>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600 justify-end">
                          <HiUsers className="w-3 h-3" /> {job.openings ?? 1} opening{(job.openings ?? 1) !== 1 ? 's' : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">{timeAgo(job.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />
          {loadingMore && <p className="text-center text-sm text-slate-400 py-6">Loading more jobs…</p>}
          {!hasMore && jobs.length > 0 && <p className="text-center text-xs text-slate-300 py-6">You've reached the end.</p>}
        </>
      )}
    </div>
  );
}
