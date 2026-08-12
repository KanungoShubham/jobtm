'use client';
import { useEffect, useState } from 'react';
import { HiCheckCircle, HiXCircle, HiExternalLink } from 'react-icons/hi';
import { subscriptionApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

export default function BillingHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    subscriptionApi.billingHistory(token).then((r) => setHistory(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-xl font-extrabold text-slate-900 mb-1">Billing History</h1>
      <p className="text-sm text-slate-400 mb-6">Payments and invoices</p>

      {loading ? (
        <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center bg-white rounded-2xl border border-slate-100">No billing history yet.</p>
      ) : (
        <div className="space-y-3">
          {history.map((row, i) => (
            <ScrollReveal key={row.id} animation="fade-up" delay={i * 40}>
              <div className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: row.is_active ? '#D1FAE5' : '#F1F5F9' }}>
                  {row.is_active ? <HiCheckCircle className="w-5 h-5 text-emerald-500" /> : <HiXCircle className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{row.label} Plan</p>
                  <p className="text-xs text-slate-400">
                    {row.starts_at ? new Date(row.starts_at).toLocaleDateString('en-IN') : ''} – {row.expires_at ? new Date(row.expires_at).toLocaleDateString('en-IN') : ''} · {row.validity}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">₹{(row.amount_paid ?? 0) / 100}</p>
                  <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/invoice/${row.id}?auth=${jobseekerAuth.getToken()}`}
                    target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-semibold justify-end" style={{ color: COLOR }}>
                    Invoice <HiExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
