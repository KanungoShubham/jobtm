'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  HiArrowLeft, HiLocationMarker, HiCash, HiUsers, HiBookmark, HiStar,
  HiShieldCheck, HiLockClosed, HiBriefcase, HiCheckCircle,
} from 'react-icons/hi';
import { jobsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { Button, FormTextarea } from '@/components/shared/FormField';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { PaywallModal, SubPlan } from '@/components/shared/PaywallModal';

const COLOR = '#0EA5E9';

function StarRow({ value, interactive, size = 'w-6 h-6', onChange }: { value: number; interactive?: boolean; size?: string; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!interactive} onClick={() => onChange?.(n)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}>
          <HiStar className={size} style={{ color: n <= value ? '#F59E0B' : '#E2E8F0' }} />
        </button>
      ))}
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [paywallPlans, setPaywallPlans] = useState<SubPlan[]>([]);
  const [paywallSource, setPaywallSource] = useState<'apply' | 'rate'>('apply');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!id) return;
    jobsApi.get(id).then((r) => setJob(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token || !id) return;
    jobsApi.savedList(token).then((r) => setSaved((r.data ?? []).some((j: any) => (j.id ?? j.job_id) === id))).catch(() => {});
    jobsApi.myApplications(token).then((r) => setApplied((r.data ?? []).some((a: any) => a.job_id === id))).catch(() => {});
  }, [id]);

  useEffect(() => {
    const user = jobseekerAuth.getUser();
    if (job?.job_ratings && user?.userId) {
      const mine = (job.job_ratings as any[]).find((r) => r.user_id === user.userId);
      if (mine) { setUserRating(mine.rating); setRatingSubmitted(true); }
    }
  }, [job]);

  const apply = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || !id) { router.push('/jobseeker/login'); return; }
    setApplying(true);
    setMsg('');
    try {
      await jobsApi.apply(token, id, { cover_note: coverNote || undefined });
      setApplied(true);
      setMsg('Application submitted successfully!');
    } catch (err: any) {
      if (err.message?.includes('Already applied')) setApplied(true);
      else if (err.httpStatus === 402) { setPaywallPlans(err.plans ?? []); setPaywallSource('apply'); setShowPaywall(true); }
      else setMsg(err.message ?? 'Failed to apply.');
    } finally { setApplying(false); }
  };

  const toggleSave = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || !id) { router.push('/jobseeker/login'); return; }
    setSaving(true);
    try {
      const res = await jobsApi.saveJob(token, id);
      setSaved(res.saved);
    } finally { setSaving(false); }
  };

  const handleRate = async (rating: number) => {
    const token = jobseekerAuth.getToken();
    if (!token || !id || ratingSubmitted) return;
    setUserRating(rating);
    setRatingLoading(true);
    setRatingError('');
    try {
      await jobsApi.rate(token, id, rating);
      setRatingSubmitted(true);
    } catch (err: any) {
      if (err.httpStatus === 402) { setPaywallPlans(err.plans ?? []); setPaywallSource('rate'); setShowPaywall(true); setUserRating(0); }
      else if (err.httpStatus === 409) { setUserRating(err.existing_rating ?? rating); setRatingSubmitted(true); }
      else { setRatingError(err.message ?? 'Could not save your rating.'); setUserRating(0); }
    } finally { setRatingLoading(false); }
  };

  if (loading) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;
  if (!job) return <div className="p-6 text-slate-400 text-sm">Job not found.</div>;

  const company = job.companies ?? {};
  const postedBy = job.authorized_persons;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition">
        <HiArrowLeft className="w-4 h-4" /> Back
      </button>

      <ScrollReveal animation="fade-up">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
              {(company.name ?? job.title ?? '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                {company.name ?? '—'}
                {company.is_verified && <HiShieldCheck className="w-4 h-4 text-emerald-500" />}
              </p>
            </div>
            <button onClick={toggleSave} disabled={saving} className="p-2 rounded-xl border border-slate-200 hover:border-sky-300 transition flex-shrink-0">
              <HiBookmark className="w-5 h-5" style={{ color: saved ? COLOR : '#CBD5E1' }} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="flex items-center gap-1.5 text-sm text-slate-500"><HiLocationMarker className="w-4 h-4 text-slate-300" />{job.locations?.[0] ?? company.city ?? '—'}</span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500"><HiCash className="w-4 h-4 text-slate-300" />{job.salary_label ?? 'Not disclosed'}</span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500"><HiUsers className="w-4 h-4 text-slate-300" />{job.openings ?? 1} opening{(job.openings ?? 1) !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>{job.job_type ?? 'Full Time'}</span>
            {job.is_remote && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">Remote</span>}
            {job.is_urgent && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">Urgent</span>}
            {job.experience && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{job.experience}</span>}
            {job.category && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600">{job.category}</span>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <StarRow value={Math.round(job.rating ?? 0)} size="w-3.5 h-3.5" />
              <span className="text-xs text-slate-400">{job.rating ?? 0} ({job.ratingCount ?? 0})</span>
            </div>
            <span className="text-xs text-slate-400">{job.created_at ? new Date(job.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Rate this job */}
      <ScrollReveal animation="fade-up" delay={60}>
        <div className={`rounded-2xl p-4 mb-4 border ${ratingSubmitted ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-semibold ${ratingSubmitted ? 'text-emerald-800' : 'text-amber-800'}`}>Rate this Job Posting</p>
            {ratingSubmitted && (
              <span className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700">
                <HiLockClosed className="w-3 h-3" /> Rated
              </span>
            )}
          </div>
          <StarRow value={userRating} interactive={!ratingLoading && !ratingSubmitted} onChange={handleRate} />
          <p className={`text-xs mt-2 ${ratingSubmitted ? 'text-emerald-600' : 'text-amber-600'}`}>
            {ratingLoading ? 'Saving your rating…' : ratingSubmitted ? `You rated ${userRating} star${userRating !== 1 ? 's' : ''} · One rating per job` : 'Subscribers only · Click a star to rate (one time only)'}
          </p>
          {ratingError && <p className="text-xs text-red-500 mt-1">{ratingError}</p>}
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={100}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-slate-900 mb-3">Job Description</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>
      </ScrollReveal>

      {job.skills?.length > 0 && (
        <ScrollReveal animation="fade-up" delay={140}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s: string) => (
                <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>{s}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {postedBy?.name && (
        <ScrollReveal animation="fade-up" delay={180}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">Posted by</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLOR }}>
                {postedBy.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{postedBy.name}</p>
                <p className="text-xs text-slate-400">{postedBy.designation}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal animation="fade-up" delay={220}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-slate-900 mb-3">About {company.name}</h2>
          {company.about && <p className="text-sm text-slate-600 leading-relaxed mb-3">{company.about}</p>}
          <div className="space-y-2">
            {company.city && <p className="flex items-center gap-2 text-sm text-slate-500"><HiLocationMarker className="w-4 h-4 text-slate-300" />{company.city}{company.state ? `, ${company.state}` : ''}</p>}
            <p className="flex items-center gap-2 text-sm text-slate-500"><HiBriefcase className="w-4 h-4 text-slate-300" />{job.category} Industry</p>
            {company.is_verified && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600"><HiShieldCheck className="w-4 h-4" />Verified Company</p>}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={260}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-3">Apply for this job</h2>
          {applied ? (
            <p className="flex items-center gap-2 text-sm text-emerald-600 font-semibold"><HiCheckCircle className="w-4 h-4" />You have applied to this job.</p>
          ) : (
            <div className="space-y-3">
              <FormTextarea label="Cover Note (optional)" rows={4} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} />
              {msg && <p className="text-sm text-slate-600">{msg}</p>}
              <Button onClick={apply} loading={applying} color={COLOR}>Apply Now</Button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {showPaywall && (
        <PaywallModal
          plans={paywallPlans}
          source={paywallSource}
          onClose={() => setShowPaywall(false)}
          onSuccess={() => { setShowPaywall(false); if (paywallSource === 'apply') apply(); }}
        />
      )}
    </div>
  );
}
