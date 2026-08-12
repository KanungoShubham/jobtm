'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiSpeakerphone, HiLogout, HiClock, HiXCircle, HiCheckCircle, HiPhotograph,
  HiRefresh, HiTrash, HiCreditCard,
} from 'react-icons/hi';
import { adsApi, uploadApi } from '@/lib/api';
import { advertiserAuth } from '@/lib/roleAuth';
import { FormInput } from '@/components/shared/FormField';

const COLOR = '#F59E0B';
const TINT  = '#FEF3C7';

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pending_payment: { bg: '#FEF3C7', text: '#92400E', label: 'Payment pending' },
  pending:         { bg: '#E0F2FE', text: '#0369A1', label: 'Under review' },
  active:          { bg: '#D1FAE5', text: '#047857', label: 'Live' },
  rejected:        { bg: '#FEE2E2', text: '#B91C1C', label: 'Rejected' },
  expired:         { bg: '#F1F5F9', text: '#64748B', label: 'Expired' },
};

function fmtDate(d?: string) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default function AdCenterPage() {
  const router = useRouter();
  const [advertiser, setAdvertiser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const load = () => {
    const token = advertiserAuth.getToken();
    if (!token) return;
    setLoading(true);
    adsApi.getAdvertiser(token).then((r) => setAdvertiser(r.data)).catch(() => setAdvertiser(null)).finally(() => setLoading(false));
  };

  useEffect(() => {
    setName(advertiserAuth.getUser()?.name ?? '');
    load();
  }, []);

  const logout = () => {
    advertiserAuth.clearSession();
    router.replace('/advertiser/login');
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TINT }}>
          <HiSpeakerphone className="w-5 h-5" style={{ color: COLOR }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-extrabold text-slate-900">AD Center</p>
          <p className="text-xs text-slate-400 truncate">{name ? `${name} · Advertiser` : 'Advertiser'}</p>
        </div>
        <button onClick={logout} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
          <HiLogout className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : !advertiser || advertiser.status === 'pending' ? (
          <PendingCard advertiser={advertiser} />
        ) : advertiser.status === 'rejected' ? (
          <RejectedCard advertiser={advertiser} />
        ) : (
          <AdCreation />
        )}
      </div>
    </div>
  );
}

function PendingCard({ advertiser }: { advertiser: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0F2FE' }}>
        <HiClock className="w-7 h-7" style={{ color: '#0EA5E9' }} />
      </div>
      <p className="text-lg font-extrabold text-slate-900">Under Review</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        Your advertiser profile{advertiser?.business_name ? <> <span className="font-bold">{advertiser.business_name}</span></> : null} is being reviewed by our team.
        You'll be notified once it's approved — then you can buy a plan and upload your banner.
      </p>
      {(advertiser?.contact_name || advertiser?.mobile || advertiser?.email) && (
        <div className="w-full bg-slate-50 rounded-xl px-4 py-3 space-y-1 text-left">
          <p className="text-xs text-slate-400">Submitted as</p>
          {(advertiser?.contact_name || advertiser?.mobile) && (
            <p className="text-sm font-semibold text-slate-700">{[advertiser?.contact_name, advertiser?.mobile].filter(Boolean).join(' · ')}</p>
          )}
          {advertiser?.email && <p className="text-xs text-slate-500">{advertiser.email}</p>}
        </div>
      )}
    </div>
  );
}

function RejectedCard({ advertiser }: { advertiser: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50">
        <HiXCircle className="w-7 h-7 text-red-500" />
      </div>
      <p className="text-lg font-extrabold text-slate-900">Profile Not Approved</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        Your advertiser profile{advertiser?.business_name ? <> <span className="font-bold">{advertiser.business_name}</span></> : null} could not be approved.
      </p>
      {advertiser?.reject_note && (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1 text-left">
          <p className="text-xs font-bold text-red-700">Reason</p>
          <p className="text-xs text-red-600">{advertiser.reject_note}</p>
        </div>
      )}
      <p className="text-xs text-slate-400">Please contact support to update your details and request another review.</p>
    </div>
  );
}

function AdCreation() {
  const [title, setTitle]       = useState('');
  const [linkUrl, setLinkUrl]   = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [imgUrl, setImgUrl]     = useState('');
  const [planKey, setPlanKey]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [myAds, setMyAds] = useState<any[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPlans = () => adsApi.plans().then((r) => setPlans(r.data ?? [])).catch(() => {});
  const loadAds = () => {
    const token = advertiserAuth.getToken();
    if (!token) return;
    adsApi.myAds(token).then((r) => setMyAds(r.data ?? [])).catch(() => {});
  };

  useEffect(() => { loadPlans(); loadAds(); }, []);

  const selectedPlan = plans.find((p) => p.key === planKey);

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mime = file.type.toLowerCase();
    if (!['image/png', 'image/webp', 'image/jpeg'].includes(mime)) {
      setError('Banner must be a PNG, WebP, or JPEG image.');
      return;
    }
    setError('');
    setImgPreview(URL.createObjectURL(file));
    setUploading(true);
    const token = advertiserAuth.getToken();
    if (!token) return;
    try {
      const res = await uploadApi.adImage(token, file);
      setImgUrl(res.url);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed.');
      setImgPreview('');
    } finally { setUploading(false); }
  };

  const submit = async () => {
    setError('');
    if (!title.trim())  { setError('Give your ad a title.'); return; }
    if (!imgUrl)         { setError('Upload one banner image.'); return; }
    if (!planKey)         { setError('Select how long the ad runs.'); return; }
    const token = advertiserAuth.getToken();
    if (!token) return;
    setSubmitting(true);
    try {
      const createRes = await adsApi.create(token, { title: title.trim(), image_url: imgUrl, link_url: linkUrl.trim() || undefined, plan_key: planKey });
      const adId = createRes.data.id;
      const orderRes = await adsApi.createOrder(token, adId);
      if (!orderRes.payment_url) throw new Error('Could not start payment.');
      window.location.href = orderRes.payment_url;
    } catch (err: any) {
      setError(err.message ?? 'Could not submit ad.');
      setSubmitting(false);
    }
  };

  const payDraft = async (ad: any) => {
    const token = advertiserAuth.getToken();
    if (!token) return;
    try {
      const orderRes = await adsApi.createOrder(token, ad.id);
      if (!orderRes.payment_url) throw new Error('Could not start payment.');
      window.location.href = orderRes.payment_url;
    } catch (err: any) {
      setError(err.message ?? 'Try again.');
    }
  };

  const deleteAd = async (ad: any) => {
    const token = advertiserAuth.getToken();
    if (!token || !confirm(`Remove "${ad.title}"?`)) return;
    try {
      await adsApi.remove(token, ad.id);
      loadAds();
    } catch (err: any) {
      setError(err.message ?? 'Could not delete.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 rounded-2xl px-4 py-3 bg-emerald-50 border border-emerald-200">
        <HiCheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">Advertiser approved — create your ad below</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <p className="text-sm font-bold text-slate-900">Banner Image</p>
        <p className="text-xs text-slate-400">One PNG, WebP, or JPEG image only · ratio 3:1 (e.g. 1200×400)</p>
        <label className="relative block rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer" style={{ aspectRatio: '3/1' }}>
          <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg" onChange={pickImage} className="hidden" />
          {imgPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgPreview} alt="Banner preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 h-full">
              <HiPhotograph className="w-8 h-8 text-slate-400" />
              <p className="text-sm text-slate-400">Click to upload banner</p>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </label>
        {imgUrl && (
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLOR }}>
            <HiRefresh className="w-3.5 h-3.5" /> Change image
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <p className="text-sm font-bold text-slate-900">Details</p>
        <FormInput label="Title" placeholder="e.g. Summer Dance Camp – 20% off" color={COLOR} value={title} onChange={(e) => setTitle(e.target.value)} />
        <FormInput label="Link URL (optional)" placeholder="https://…" color={COLOR} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <p className="text-sm font-bold text-slate-900">Duration Plan</p>
        <div className="flex flex-wrap gap-2">
          {plans.map((p) => {
            const active = planKey === p.key;
            return (
              <button key={p.key} type="button" onClick={() => setPlanKey(p.key)}
                className="px-3.5 py-2.5 rounded-2xl border-2 text-left transition-colors"
                style={active ? { borderColor: COLOR, backgroundColor: TINT } : { borderColor: '#E2E8F0', backgroundColor: '#fff' }}>
                <p className="text-[13px] font-bold" style={{ color: active ? COLOR : '#334155' }}>{p.label}</p>
                <p className="text-xs" style={{ color: active ? COLOR : '#94A3B8' }}>₹{p.amount}</p>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>}

      <button onClick={submit} disabled={submitting || uploading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-extrabold text-sm disabled:opacity-60 transition-opacity"
        style={{ backgroundColor: COLOR }}>
        {submitting ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <HiSpeakerphone className="w-4.5 h-4.5" />
            {selectedPlan ? `Pay ₹${selectedPlan.amount} & Submit` : 'Submit Ad'}
          </>
        )}
      </button>
      <p className="text-xs text-slate-400 text-center -mt-2">Secured by Razorpay · Goes live after admin approval</p>

      {myAds.length > 0 && (
        <div className="space-y-2 mt-2">
          <p className="text-sm font-bold text-slate-900">My Ads</p>
          {myAds.map((ad) => {
            const st = STATUS_STYLE[ad.status] ?? STATUS_STYLE.pending;
            return (
              <div key={ad.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 space-y-2.5">
                <div className="flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.image_url} alt={ad.title} className="w-21 h-7 rounded object-cover flex-shrink-0" style={{ width: 84, height: 28 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{ad.title}</p>
                    <p className="text-xs text-slate-400">{ad.duration_days}d · ₹{ad.amount_paid || '—'}{ad.expires_at ? ` · until ${fmtDate(ad.expires_at)}` : ''}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: st.bg, color: st.text }}>{st.label}</span>
                </div>
                {ad.status === 'rejected' && ad.reject_note && <p className="text-xs text-red-500">{ad.reject_note}</p>}
                <div className="flex gap-2">
                  {ad.status === 'pending_payment' && (
                    <button onClick={() => payDraft(ad)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold" style={{ backgroundColor: COLOR }}>
                      <HiCreditCard className="w-3.5 h-3.5" /> Pay now
                    </button>
                  )}
                  <button onClick={() => deleteAd(ad)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold">
                    <HiTrash className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
