'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft, HiCheckCircle, HiBriefcase, HiStar, HiShieldCheck, HiCreditCard, HiRefresh } from 'react-icons/hi';
import { subscriptionApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';
const TINT  = '#EDE9FE';

const PLAN_ICONS: Record<string, any> = {
  half_yearly: HiBriefcase,
  yearly: HiStar,
};

export default function EmployerSubscriptionPage() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = employerAuth.getToken();
    if (!token) return;
    subscriptionApi.getEmployerStatus(token)
      .then((r) => setStatus(r.data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  const activeSub = status?.subscription;
  const plans: any[] = status?.plans ?? [];

  const subscribe = async (planType: string) => {
    const token = employerAuth.getToken();
    if (!token) return;
    setSubscribing(planType);
    setError('');
    try {
      const res = await subscriptionApi.createOrder(token, planType);
      if (res.payment_url) window.location.href = res.payment_url;
    } catch (err: any) {
      setError(err.message ?? 'Subscription failed.');
      setSubscribing(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 flex-shrink-0">
          <HiArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">Subscription</h1>
          <p className="text-xs text-slate-400">Manage your plan</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : (
          <>
            {activeSub && (
              <div className="rounded-2xl p-5 space-y-1.5" style={{ backgroundColor: COLOR }}>
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-5 h-5 text-white" />
                  <p className="text-white font-extrabold text-base">Subscribed</p>
                </div>
                <p className="text-white/80 text-sm capitalize">{String(activeSub.plan_type ?? '').replace('_', ' ')} plan active</p>
                <p className="text-white/60 text-xs">
                  Expires {new Date(activeSub.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}

            {plans.length > 0 && (
              <>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Available Plans</p>
                {plans.map((plan: any, i: number) => {
                  const rupees = Math.round(plan.amount / 100);
                  const isPopular = i === plans.length - 1;
                  const Icon = PLAN_ICONS[plan.plan_type] ?? HiBriefcase;
                  const isBusy = subscribing === plan.plan_type;
                  return (
                    <div key={plan.plan_type} className="bg-white rounded-2xl border overflow-hidden"
                      style={{ borderColor: isPopular ? COLOR : '#F1F5F9', borderWidth: isPopular ? 2 : 1 }}>
                      {isPopular && (
                        <div className="py-1.5 text-center" style={{ backgroundColor: COLOR }}>
                          <span className="text-[11px] font-extrabold text-white tracking-wider">BEST VALUE</span>
                        </div>
                      )}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isPopular ? TINT : '#F1F5F9' }}>
                            <Icon className="w-5 h-5" style={{ color: isPopular ? COLOR : '#64748B' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-extrabold text-slate-900">{plan.label}</p>
                            <p className="text-xs text-slate-400">{plan.validity_label}</p>
                          </div>
                          <p className="text-xl font-black flex-shrink-0" style={{ color: isPopular ? COLOR : '#0F172A' }}>₹{rupees}</p>
                        </div>
                        {plan.description && <p className="text-xs text-slate-500">{plan.description}</p>}
                        <button onClick={() => subscribe(plan.plan_type)} disabled={!!subscribing}
                          className="w-full py-3 rounded-xl text-sm font-bold text-center disabled:opacity-60 transition-opacity"
                          style={isPopular ? { backgroundColor: COLOR, color: '#fff' } : { backgroundColor: '#F1F5F9', color: '#334155' }}>
                          {isBusy ? 'Redirecting…' : `Subscribe for ₹${rupees}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>}

            <div className="flex items-center justify-center gap-8 pt-2">
              {[
                { icon: HiShieldCheck, text: '100% Secure' },
                { icon: HiCreditCard,  text: 'Razorpay' },
                { icon: HiRefresh,     text: 'No Auto-Renew' },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1">
                  <b.icon className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] text-slate-400">{b.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
