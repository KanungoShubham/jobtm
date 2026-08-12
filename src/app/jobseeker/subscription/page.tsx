'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiStar, HiReceiptTax } from 'react-icons/hi';
import { subscriptionApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { PaywallModal, SubPlan } from '@/components/shared/PaywallModal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

export default function SubscriptionPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setLoading(true);
    subscriptionApi.getStatus(token).then((r) => setStatus(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;
  if (!status) return <div className="p-6 text-slate-400 text-sm">Could not load subscription status.</div>;

  const isSubscribed = status.status === 'subscribed';
  const sub = status.subscription;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">My Subscription</h1>
        <p className="text-sm text-slate-400">View your plan and application limits</p>
      </div>

      <ScrollReveal animation="fade-up">
        <div className="rounded-2xl p-6" style={{ backgroundColor: isSubscribed ? '#7C3AED' : COLOR }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <HiStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg">{isSubscribed ? 'Subscribed' : status.status === 'launch_offer' ? 'Launch Offer Active' : 'Free Plan'}</p>
              <p className="text-white/70 text-xs">
                {isSubscribed && sub ? `Valid until ${new Date(sub.expires_at).toLocaleDateString('en-IN')}` : `${status.apply_count}/${status.free_limit} free applications used`}
              </p>
            </div>
          </div>
          <button onClick={() => setShowPaywall(true)} className="w-full py-3 rounded-xl bg-white text-sm font-extrabold" style={{ color: isSubscribed ? '#7C3AED' : COLOR }}>
            {isSubscribed ? 'Renew / Change Plan' : 'Upgrade to Unlimited'}
          </button>
        </div>
      </ScrollReveal>

      {!isSubscribed && (
        <ScrollReveal animation="fade-up" delay={60}>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Applications used</span>
              <span className="text-sm font-bold text-slate-900">{status.apply_count}/{status.free_limit}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (status.apply_count / status.free_limit) * 100)}%`, backgroundColor: COLOR }} />
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal animation="fade-up" delay={100}>
        <Link href="/jobseeker/billing" className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 hover:shadow-warm transition">
          <HiReceiptTax className="w-5 h-5 text-slate-400" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Billing History</p>
            <p className="text-xs text-slate-400">View past payments and invoices</p>
          </div>
        </Link>
      </ScrollReveal>

      {status.plans?.length > 0 && (
        <ScrollReveal animation="fade-up" delay={140}>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-900 mb-1">Available Plans</p>
            <p className="text-xs text-slate-400 mb-3">
              {isSubscribed ? 'Buying a new plan replaces your current one and restarts the validity period.' : 'One-time payment via Razorpay — no auto-renewal, buy again when it expires.'}
            </p>
            <div className="space-y-2">
              {status.plans.map((p: any) => (
                <button key={p.plan_type} onClick={() => setShowPaywall(true)}
                  className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-4 py-3 text-left transition">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.label} {p.badge && <span className="ml-1 text-[10px] font-bold text-white bg-sky-500 px-2 py-0.5 rounded-full">{p.badge}</span>}</p>
                    <p className="text-xs text-slate-400">{p.validity_label}</p>
                  </div>
                  <span className="text-lg font-black text-slate-900">₹{p.amount / 100}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {showPaywall && (
        <PaywallModal
          plans={(status.plans ?? []) as SubPlan[]}
          source="apply"
          onClose={() => setShowPaywall(false)}
          onSuccess={() => { setShowPaywall(false); load(); }}
        />
      )}
    </div>
  );
}
