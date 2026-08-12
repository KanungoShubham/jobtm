'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiArrowLeft, HiCheckCircle, HiClock, HiExclamationCircle, HiCalendar,
  HiCreditCard, HiDocumentText, HiReceiptTax,
} from 'react-icons/hi';
import { subscriptionApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';

const COLOR = '#7C3AED';
const TINT_PURPLE = '#F5F3FF';
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

interface BillingRecord {
  id: string; amount_paid: number; label: string; validity: string;
  created_at: string; expires_at: string; is_active: boolean; payment_id?: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EmployerBillingHistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setLoading(true);
    setError('');
    subscriptionApi.billingHistory(token)
      .then((r) => setRecords(r.data ?? []))
      .catch((e) => setError(e.message ?? 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openInvoice = (rec: BillingRecord) => {
    const token = employerAuth.getToken();
    window.open(`${BASE}/api/subscription/invoice/${rec.id}?auth=${token}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 flex-shrink-0">
          <HiArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">Billing History</h1>
          <p className="text-xs text-slate-400">Your subscription payments</p>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : error ? (
          <div className="flex flex-col items-center text-center gap-3 py-16">
            <HiExclamationCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm font-semibold text-slate-500">{error}</p>
            <button onClick={load} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: COLOR }}>Retry</button>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-4 py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <HiReceiptTax className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-500">No payments yet</p>
            <p className="text-sm text-slate-400 max-w-xs">Your payment history will appear here after your first subscription.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => {
              const rupees = Math.round(rec.amount_paid / 100);
              const active = rec.is_active && new Date(rec.expires_at) > new Date();
              return (
                <div key={rec.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: active ? '#C4B5FD' : '#E2E8F0' }} />
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: active ? TINT_PURPLE : '#F1F5F9' }}>
                      {active ? <HiCheckCircle className="w-5 h-5" style={{ color: COLOR }} /> : <HiClock className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-extrabold text-slate-900">{rec.label} Plan</p>
                      <p className="text-xs text-slate-400">{rec.validity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <p className="text-base font-black text-slate-900">₹{rupees}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: active ? TINT_PURPLE : '#F1F5F9', color: active ? '#6D28D9' : '#94A3B8' }}>
                        {active ? 'ACTIVE' : 'EXPIRED'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 px-4 pb-3">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><HiCalendar className="w-3 h-3" /> Paid {fmt(rec.created_at)}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><HiClock className="w-3 h-3" /> Expires {fmt(rec.expires_at)}</span>
                  </div>

                  {rec.payment_id && (
                    <div className="mx-4 mb-3 bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <HiCreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <p className="text-[11px] text-slate-400 truncate">Payment ID: <span className="font-mono text-slate-600">{rec.payment_id}</span></p>
                    </div>
                  )}

                  <button onClick={() => openInvoice(rec)}
                    className="w-full border-t border-slate-100 flex items-center justify-center gap-2 py-3 transition-colors hover:opacity-90"
                    style={{ backgroundColor: TINT_PURPLE }}>
                    <HiDocumentText className="w-4 h-4" style={{ color: COLOR }} />
                    <span className="text-xs font-bold" style={{ color: COLOR }}>View & Download Invoice</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
