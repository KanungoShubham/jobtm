'use client';
import { useEffect, useState } from 'react';
import { HiCalendar, HiClock, HiLocationMarker, HiPhone } from 'react-icons/hi';
import { activitiesApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    activitiesApi.myBookings(token).then((r) => setBookings(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-xl font-extrabold text-slate-900 mb-1">My Bookings</h1>
      <p className="text-sm text-slate-400 mb-6">Sessions you&apos;ve booked or paid for</p>

      {loading ? (
        <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center bg-white rounded-2xl border border-slate-100">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b: any, i: number) => {
            const activity = b.activity ?? {};
            return (
              <ScrollReveal key={b.id} animation="fade-up" delay={i * 40}>
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{activity.category}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>
                      {b.session_date ? new Date(b.session_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                    {activity.location && <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5 text-slate-300" />{activity.location}</span>}
                    {activity.time_start && <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5 text-slate-300" />{fmt12(activity.time_start)} – {fmt12(activity.time_end)}</span>}
                  </div>
                  {activity.provider?.full_name && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <HiPhone className="w-3.5 h-3.5 text-slate-300" />
                      {activity.provider.full_name} · {activity.provider.mobile}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
