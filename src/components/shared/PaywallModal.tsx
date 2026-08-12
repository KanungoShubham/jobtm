'use client';
import { useState } from 'react';
import { HiStar, HiLockClosed, HiX } from 'react-icons/hi';
import { subscriptionApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';

export interface SubPlan {
  plan_type: string;
  label: string;
  amount: number; // paise
  validity_label?: string;
  badge?: string;
}

export function PaywallModal({
  plans, source, onClose, onSuccess,
}: {
  plans: SubPlan[];
  source: 'apply' | 'rate';
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [payingPlan, setPayingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');

  const subscribe = async (plan: SubPlan) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setPayingPlan(plan.plan_type);
    setError('');
    try {
      const res = await subscriptionApi.createOrder(token, plan.plan_type);
      const paymentUrl = res?.payment_url;
      if (!paymentUrl) { setError('Payment URL not received.'); return; }

      const win = window.open(paymentUrl, '_blank', 'width=480,height=720');
      if (!win) { setError('Popup blocked — please allow popups and try again.'); return; }

      await new Promise<void>((resolve) => {
        const timer = setInterval(() => { if (win.closed) { clearInterval(timer); resolve(); } }, 700);
      });

      const status = await subscriptionApi.getStatus(token);
      if (status?.data?.status === 'subscribed') {
        onSuccess();
      } else {
        setError('Payment not confirmed yet. If the amount was deducted, it will activate shortly — try again in a moment.');
      }
    } catch (err: any) {
      setError(err.message ?? 'Could not start payment. Please try again.');
    } finally { setPayingPlan(null); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end -mt-2 -mr-2 mb-1">
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><HiX className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-col items-center gap-2 mb-5 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <HiStar className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {source === 'rate' ? 'Subscribe to Rate Jobs' : 'Unlock Unlimited Applications'}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {source === 'rate'
              ? 'Rating jobs is a subscriber-only feature. Subscribe to share your feedback.'
              : "You've used all 10 free applications. Subscribe to continue applying to jobs."}
          </p>
        </div>

        <div className="space-y-3">
          {plans.map((plan) => (
            <button key={plan.plan_type} onClick={() => subscribe(plan)} disabled={!!payingPlan}
              className="w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition disabled:opacity-60"
              style={plan.badge ? { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' } : { borderColor: '#E2E8F0' }}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900">{plan.label} Plan</span>
                  {plan.badge && <span className="text-[10px] font-bold text-white bg-sky-500 px-2 py-0.5 rounded-full">{plan.badge}</span>}
                </div>
                <p className="text-xs text-slate-500">{plan.validity_label ?? ''} · Unlimited applies</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-black text-slate-900">₹{plan.amount / 100}</p>
                <p className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                  <HiLockClosed className="w-2.5 h-2.5" /> {payingPlan === plan.plan_type ? 'Processing…' : 'Pay securely'}
                </p>
              </div>
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}

        <button onClick={onClose} className="w-full text-center text-sm text-slate-400 mt-4 py-1">Maybe Later</button>
      </div>
    </div>
  );
}
