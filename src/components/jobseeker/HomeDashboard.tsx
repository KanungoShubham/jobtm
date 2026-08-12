'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HiBriefcase, HiBookmark, HiCheckCircle, HiSpeakerphone, HiUsers, HiCash,
  HiTrendingUp, HiHome, HiTruck, HiShieldCheck, HiAcademicCap, HiArrowRight,
  HiSearch, HiLocationMarker, HiSparkles, HiStar, HiLightningBolt,
} from 'react-icons/hi';
import { jobsApi, profileApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

const CATEGORIES = [
  { key: 'marketing', label: 'Marketing', icon: HiSpeakerphone },
  { key: 'hr',        label: 'HR',        icon: HiUsers        },
  { key: 'finance',   label: 'Finance',   icon: HiCash         },
  { key: 'sales',     label: 'Sales',     icon: HiTrendingUp   },
  { key: 'hotels',    label: 'Hotels',    icon: HiHome         },
  { key: 'driving',   label: 'Driving',   icon: HiTruck        },
  { key: 'security',  label: 'Security',  icon: HiShieldCheck  },
  { key: 'graduate',  label: 'Graduate',  icon: HiAcademicCap  },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function timeAgo(iso: string) {
  if (!iso) return '';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function JobseekerHomeDashboard() {
  const [user] = useState(() => jobseekerAuth.getUser());
  const [q, setQ] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [milestone, setMilestone] = useState<{ total_completed: number; unique_companies: number; active_milestone: { jobs: number; label: string; progress: number; pct: number } } | null>(null);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    jobsApi.list({ page: 1, limit: 10, sort: 'latest' }).then((r) => { setJobs(r.data ?? []); setJobsTotal(r.total ?? 0); }).catch(() => {});
    jobsApi.savedList(token).then((r) => setSavedIds((r.data ?? []).map((j: any) => j.id ?? j.job_id))).catch(() => {});
    jobsApi.myApplications(token).then((r) => setAppliedCount((r.data ?? []).length)).catch(() => {});
    profileApi.milestones(token).then((r) => setMilestone(r.data)).catch(() => {});
  }, []);

  const toggleSave = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const token = jobseekerAuth.getToken();
    if (!token) return;
    const isSaved = savedIds.includes(id);
    setSavedIds((prev) => (isSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    try { await jobsApi.saveJob(token, id); } catch { setSavedIds((prev) => (isSaved ? [...prev, id] : prev.filter((x) => x !== id))); }
  };

  const STATS = [
    { label: 'Open Jobs', value: jobsTotal, icon: HiBriefcase, fg: '#2563EB', href: '/jobseeker/jobs' },
    { label: 'Saved', value: savedIds.length, icon: HiBookmark, fg: '#7C3AED', href: '/jobseeker/saved' },
    { label: 'Applied', value: appliedCount, icon: HiCheckCircle, fg: '#10B981', href: '/jobseeker/applied' },
  ];

  const nextGoal = milestone?.active_milestone;
  const toNext = nextGoal ? Math.max(0, nextGoal.jobs - milestone!.total_completed) : 10;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top bar: greeting + search — desktop toolbar pattern, not a mobile hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <p className="text-sm text-slate-400">{greeting()}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.name || 'Job Seeker'}</h1>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); window.location.href = `/jobseeker/jobs?q=${encodeURIComponent(q)}`; }}
          className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2.5 w-full lg:w-96 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-50 transition-all"
        >
          <HiSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search job title, company, skill…"
            className="flex-1 text-sm outline-none placeholder:text-slate-400"
          />
          <button type="submit" className="text-xs font-bold px-3 py-1.5 rounded-xl text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
            Search
          </button>
        </form>
      </div>

      {/* Dashboard grid: main column + right rail — a web layout, not a stacked mobile feed */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="min-w-0 order-2 lg:order-1">
          {/* Category filter chips — horizontal scroll bar, not an icon grid */}
          <ScrollReveal animation="fade-up">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <Link key={c.key} href={`/jobseeker/jobs?category=${c.key}`}
                    className="flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                    <Icon className="w-3.5 h-3.5" />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <HiSparkles className="w-5 h-5" style={{ color: COLOR }} />
              Jobs for You
            </h2>
            <Link href="/jobseeker/jobs" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: COLOR }}>
              Browse all <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Job cards — same design language as Browse Jobs, latest 10 */}
          {jobs.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center bg-white rounded-2xl border border-slate-100">No jobs available right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {jobs.map((j: any, i: number) => {
                const company = j.companies ?? {};
                const isSaved = savedIds.includes(j.id);
                return (
                  <ScrollReveal key={j.id} animation="fade-up" delay={i * 40}>
                    <Link href={`/jobseeker/job/${j.id}`} className="block h-full rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-warm-lg hover-lift transition-all duration-300 p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
                            {(company.name ?? j.title ?? '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{j.title}</p>
                            <p className="text-xs text-slate-400 truncate">{company.name ?? '—'}</p>
                          </div>
                        </div>
                        <button onClick={(e) => toggleSave(e, j.id)} className="flex-shrink-0 p-1">
                          <HiBookmark className="w-5 h-5" style={{ color: isSaved ? COLOR : '#CBD5E1' }} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                          <HiLocationMarker className="w-3 h-3" /> {j.locations?.[0] ?? company.city ?? '—'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                          <HiBriefcase className="w-3 h-3" /> {j.job_type ?? 'Full Time'}
                        </span>
                        {j.is_urgent && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                            <HiLightningBolt className="w-3 h-3" /> Urgent
                          </span>
                        )}
                        {j.ratingCount > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <HiStar className="w-3 h-3" /> {j.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Salary</p>
                          <p className="text-sm font-bold text-slate-900">{j.salary_label ?? 'Not disclosed'}</p>
                        </div>
                        <div className="text-right">
                          <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600 justify-end">
                            <HiUsers className="w-3 h-3" /> {j.openings ?? 1} opening{(j.openings ?? 1) !== 1 ? 's' : ''}
                          </p>
                          <p className="text-[11px] text-slate-400">{timeAgo(j.created_at)}</p>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="min-w-0 order-1 lg:order-2 space-y-4">
          {/* Compact stat row */}
          <ScrollReveal animation="fade-left">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link key={s.label} href={s.href} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ color: s.fg }} />
                    <span className="text-sm font-medium text-slate-600 flex-1">{s.label}</span>
                    <span className="text-lg font-extrabold text-slate-900">{s.value}</span>
                  </Link>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Job Level card */}
          <ScrollReveal animation="fade-left" delay={80}>
            <div className="relative rounded-2xl p-5 text-white overflow-hidden shadow-warm-lg" style={{ backgroundColor: '#0F172A' }}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Job Level</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10">Starter</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="rounded-lg bg-white/5 py-2.5 text-center">
                    <div className="text-base font-bold text-emerald-400">{milestone?.total_completed ?? 0}</div>
                    <div className="text-[10px] text-white/40">Done</div>
                  </div>
                  <div className="rounded-lg bg-white/5 py-2.5 text-center">
                    <div className="text-base font-bold text-sky-400">{milestone?.unique_companies ?? 0}</div>
                    <div className="text-[10px] text-white/40">Companies</div>
                  </div>
                  <div className="rounded-lg bg-white/5 py-2.5 text-center">
                    <div className="text-base font-bold text-white">{toNext}</div>
                    <div className="text-[10px] text-white/40">To Bronze</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${milestone?.active_milestone.pct ?? 0}%`, backgroundColor: COLOR }} />
                </div>
                <p className="text-[11px] text-white/30">{toNext} more jobs to level up</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Activities promo */}
          <ScrollReveal animation="fade-left" delay={160}>
            <Link href="/jobseeker/activities" className="block relative rounded-2xl p-5 text-white overflow-hidden shadow-warm-lg hover-lift transition-transform duration-300" style={{ backgroundColor: '#1E3A8A' }}>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <HiAcademicCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm">Extra Curricular</p>
                  <p className="text-xs text-white/60">Dance · Yoga · Music · Sports · Fitness</p>
                </div>
                <HiArrowRight className="w-4 h-4 ml-auto flex-shrink-0 text-white/60" />
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
