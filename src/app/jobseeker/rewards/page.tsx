'use client';
import { useEffect, useState } from 'react';
import {
  HiGift, HiSparkles, HiClipboardCopy, HiCheckCircle, HiClock, HiCalendar,
  HiUserGroup, HiShare, HiCash, HiLockClosed,
} from 'react-icons/hi';
import { rewardsApi, referralApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const CATEGORIES = [
  { key: '', label: 'All', color: '#64748B' },
  { key: 'food', label: 'Food', color: '#F97316' },
  { key: 'medical', label: 'Medical', color: '#10B981' },
  { key: 'shopping', label: 'Shopping', color: '#7C3AED' },
  { key: 'travel', label: 'Travel', color: '#2563EB' },
];
const CAT_META: Record<string, { color: string; bg: string }> = {
  food: { color: '#F97316', bg: '#FFF7ED' }, medical: { color: '#10B981', bg: '#ECFDF5' },
  shopping: { color: '#7C3AED', bg: '#F5F3FF' }, travel: { color: '#2563EB', bg: '#EFF6FF' },
};

function fmtExpiry(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function isExpiring(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

function ScratchCard({ coupon, onScratched }: { coupon: any; onScratched: () => void }) {
  const meta = CAT_META[coupon.category] ?? { color: '#64748B', bg: '#F8FAFC' };
  const [code, setCode] = useState<string | null>(coupon.code ?? null);
  const [scratching, setScratching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localUsed, setLocalUsed] = useState(coupon.is_used);
  const [error, setError] = useState('');

  const expired = new Date(coupon.expires_at) <= new Date();
  const isFull = coupon.is_full && !coupon.scratched;
  const disabled = expired || isFull || scratching;
  const isRevealed = code !== null || coupon.scratched;
  const discountLabel = coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`;

  const doScratch = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || coupon.scratched || disabled) return;
    setScratching(true);
    setError('');
    try {
      const res = await rewardsApi.scratch(token, coupon.id);
      setCode(res.code);
      onScratched();
    } catch (err: any) {
      setError(err.message ?? 'Could not scratch.');
    } finally { setScratching(false); }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleUse = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || localUsed || !code) return;
    try { await rewardsApi.use(token, coupon.id); setLocalUsed(true); } catch (err: any) { setError(err.message ?? 'Error'); }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 p-4" style={{ backgroundColor: meta.bg }}>
        <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
          <HiGift className="w-4.5 h-4.5" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold truncate" style={{ color: meta.color }}>{coupon.brand}</p>
          <p className="text-[11px] text-slate-500 truncate">{coupon.title}</p>
        </div>
        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-white/90" style={{ color: meta.color }}>{discountLabel}</span>
      </div>

      <div className="p-3.5">
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 min-h-[68px] flex items-center justify-center mb-3 px-3">
          {!isRevealed ? (
            <div className="flex flex-col items-center gap-1.5 py-2">
              <HiGift className="w-6 h-6" style={{ color: meta.color }} />
              <p className="text-xs text-slate-500 font-semibold">Scratch to reveal your code</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-2 w-full">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-slate-400">COUPON CODE</span>
                {localUsed && <span className="text-[9px] font-extrabold text-white bg-emerald-500 rounded px-1.5 py-0.5 tracking-wide">USED</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black tracking-widest font-mono ${localUsed ? 'text-slate-300 line-through' : ''}`} style={!localUsed ? { color: meta.color } : undefined}>
                  {code ?? '—'}
                </span>
                {!localUsed && (
                  <button onClick={handleCopy} className="p-1.5 rounded-lg" style={{ backgroundColor: meta.bg }}>
                    {copied ? <HiCheckCircle className="w-4 h-4 text-emerald-500" /> : <HiClipboardCopy className="w-4 h-4" style={{ color: meta.color }} />}
                  </button>
                )}
              </div>
              {coupon.min_order > 0 && <p className="text-[10px] text-slate-400">Min. order ₹{(coupon.min_order / 100).toLocaleString('en-IN')}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: isExpiring(coupon.expires_at) ? '#EF4444' : '#94A3B8' }}>
              {isExpiring(coupon.expires_at) ? <HiClock className="w-3 h-3" /> : <HiCalendar className="w-3 h-3" />}
              {expired ? 'Expired' : `Valid till ${fmtExpiry(coupon.expires_at)}`}
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">{coupon.claimed_count}/{coupon.total_count} claimed</p>
          </div>
          {!isRevealed ? (
            <button onClick={doScratch} disabled={disabled}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold text-white transition disabled:opacity-70"
              style={{ backgroundColor: disabled ? '#E2E8F0' : meta.color, color: disabled ? '#94A3B8' : '#fff' }}>
              <HiSparkles className="w-3.5 h-3.5" />
              {scratching ? 'Revealing…' : expired ? 'Expired' : isFull ? 'Full' : 'Scratch!'}
            </button>
          ) : localUsed ? (
            <span className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-slate-100 text-emerald-600"><HiCheckCircle className="w-3.5 h-3.5" />Used</span>
          ) : (
            <button onClick={handleUse} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">
              <HiCheckCircle className="w-3.5 h-3.5" />Mark Used
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

function ReferEarnTab() {
  const [data, setData] = useState<{ code: string; points: number; points_redeemed: number; referrals_count: number; redeemable: number; points_to_next: number; referrals: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyCode, setApplyCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setLoading(true);
    referralApi.get(token).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const applyReferral = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || !applyCode.trim()) return;
    try {
      const res = await referralApi.apply(token, applyCode.trim());
      setMsg({ ok: true, text: res.message });
      setApplyCode('');
      load();
    } catch (err: any) {
      setMsg({ ok: false, text: err.message ?? 'Could not apply code.' });
    }
  };

  const redeem = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    try {
      const res = await referralApi.redeem(token);
      setMsg({ ok: true, text: res.message });
      load();
    } catch (err: any) {
      setMsg({ ok: false, text: err.message ?? 'Could not redeem.' });
    }
  };

  const copyCode = () => {
    if (!data?.code) return;
    navigator.clipboard?.writeText(data.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (loading) return <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>;
  if (!data) return <p className="text-sm text-slate-400 py-12 text-center">Could not load referral info.</p>;

  return (
    <div className="space-y-5 max-w-xl">
      <ScrollReveal animation="fade-up">
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ backgroundColor: '#F59E0B' }}>
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-widest font-mono">{data.code}</span>
              <button onClick={copyCode} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition">
                {copied ? <HiCheckCircle className="w-4 h-4" /> : <HiClipboardCopy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/70 mt-2">Share this code — you earn 5 points for every friend who signs up with it.</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={80}>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{data.points}</p>
            <p className="text-[11px] text-slate-400 font-medium">Points</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{data.referrals_count}</p>
            <p className="text-[11px] text-slate-400 font-medium">Referrals</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{data.redeemable}</p>
            <p className="text-[11px] text-slate-400 font-medium">Redeemable</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={140}>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-900 mb-1">Redeem Points</p>
          <p className="text-xs text-slate-400 mb-3">{data.points_to_next} more points until your next ₹20 redemption (every 500 points).</p>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-4">
            <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${Math.min(100, ((500 - data.points_to_next) / 500) * 100)}%` }} />
          </div>
          <button onClick={redeem} disabled={data.redeemable < 1}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: data.redeemable < 1 ? '#CBD5E1' : '#F59E0B' }}>
            <HiCash className="w-4 h-4" /> {data.redeemable < 1 ? 'Not enough points yet' : `Redeem ₹${data.redeemable * 20}`}
          </button>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay={200}>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-900 mb-3">Have a referral code?</p>
          <div className="flex gap-2">
            <input value={applyCode} onChange={(e) => setApplyCode(e.target.value.toUpperCase())} placeholder="Enter code"
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 outline-none focus:border-amber-300" />
            <button onClick={applyReferral} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: '#F59E0B' }}>Apply</button>
          </div>
        </div>
      </ScrollReveal>

      {msg && (
        <p className={`text-sm rounded-xl px-4 py-3 ${msg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</p>
      )}

      {data.referrals.length > 0 && (
        <ScrollReveal animation="fade-up" delay={260}>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 px-5 py-3">Your Referrals</p>
            {data.referrals.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-600"><HiUserGroup className="w-4 h-4 text-slate-400" />{r.referee_role}</span>
                <span className="text-sm font-bold text-emerald-600">+{r.points} pts</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

export default function RewardsPage() {
  const [tab, setTab] = useState<'coupons' | 'refer'>('coupons');
  const [category, setCategory] = useState('');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setLoading(true);
    rewardsApi.list(token, category || undefined).then((r) => setCoupons(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [category]);

  const scratchedCount = coupons.filter((c) => c.scratched).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Rewards</p>
          <h1 className="text-2xl font-extrabold text-slate-900">My Coupons</h1>
        </div>
        {tab === 'coupons' && (
          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-1.5">
            <HiGift className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">{scratchedCount} scratched</span>
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mb-5 rounded-2xl overflow-hidden border border-slate-200 bg-white p-1 max-w-sm">
        <button onClick={() => setTab('coupons')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition"
          style={tab === 'coupons' ? { backgroundColor: '#0EA5E9', color: '#fff' } : { color: '#64748B' }}>
          <HiGift className="w-4 h-4" /> Coupons
        </button>
        <button onClick={() => setTab('refer')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold transition"
          style={tab === 'refer' ? { backgroundColor: '#0EA5E9', color: '#fff' } : { color: '#64748B' }}>
          <HiShare className="w-4 h-4" /> Refer & Earn
        </button>
      </div>

      {tab === 'coupons' ? (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold transition"
                  style={active ? { backgroundColor: c.color, borderColor: c.color, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                  {c.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <HiGift className="w-12 h-12 text-slate-200" />
              <p className="font-bold text-slate-400">No coupons available{category ? ` in ${CATEGORIES.find((c) => c.key === category)?.label}` : ''}</p>
              <p className="text-sm text-slate-400">{category ? '' : 'Check back soon — new deals are added regularly'}</p>
              {category && <button onClick={() => setCategory('')} className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Show all categories</button>}
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 font-semibold mb-3">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} available · click a card to scratch</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c: any, i: number) => (
                  <ScrollReveal key={c.id} animation="fade-up" delay={i * 50}>
                    <ScratchCard coupon={c} onScratched={load} />
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <ReferEarnTab />
      )}
    </div>
  );
}
