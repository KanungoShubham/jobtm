'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HiArrowLeft, HiPlus, HiTrash, HiUsers, HiCalendar, HiClock,
  HiInformationCircle, HiExclamationCircle, HiClock as HiHourglass, HiOutlineMusicNote,
} from 'react-icons/hi';
import { activitiesApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  pending:  { bg: '#FEF3C7', fg: '#D97706', label: 'Pending' },
  active:   { bg: '#D1FAE5', fg: '#059669', label: 'Active'  },
  rejected: { bg: '#FEE2E2', fg: '#DC2626', label: 'Rejected' },
};

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function MyActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsFor, setBookingsFor] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setLoading(true);
    activitiesApi.myList(token).then((r) => setActivities(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, title: string) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    if (!confirm(`Remove "${title}"? This cannot be undone.`)) return;
    await activitiesApi.delete(token, id);
    load();
  };

  const openBookings = async (item: any) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setBookingsFor(item);
    setBookingsLoading(true);
    try {
      const r = await activitiesApi.bookings(token, item.id);
      setBookings(r.data ?? []);
    } catch { setBookings([]); } finally { setBookingsLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/jobseeker/activities" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <HiArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">My Activities</h1>
            <p className="text-xs text-slate-400">Coaching & classes you offer</p>
          </div>
        </div>
        <Link href="/jobseeker/activities/create" className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: COLOR }}>
          <HiPlus className="w-4 h-4" /> New
        </Link>
      </div>

      <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 mb-6">
        <HiInformationCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-sky-700 leading-relaxed">
          List your coaching, classes or workshops. Students book directly. For paid sessions, you receive{' '}
          <strong>85% of the price</strong> — admin holds payment until session completes.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center">
            <HiOutlineMusicNote className="w-8 h-8" style={{ color: COLOR }} />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900">No activities yet</p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">Share your skills — create your first coaching class or workshop.</p>
          </div>
          <Link href="/jobseeker/activities/create" className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: COLOR }}>
            <HiPlus className="w-4 h-4" /> Create Activity
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((item: any, i: number) => {
            const status = STATUS_STYLE[item.status ?? 'pending'];
            const daysText = Array.isArray(item.days) ? item.days.join(', ') : '';
            const timeText = item.time_start ? `${fmt12(item.time_start)} – ${fmt12(item.time_end)}` : '';
            return (
              <ScrollReveal key={item.id} animation="fade-up" delay={i * 40}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E0F2FE' }}>
                      <HiOutlineMusicNote className="w-5 h-5" style={{ color: COLOR }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: status.bg, color: status.fg }}>{status.label}</span>
                  </div>

                  {(daysText || timeText) && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                      {daysText && <span className="flex items-center gap-1.5 text-xs text-slate-500"><HiCalendar className="w-3.5 h-3.5 text-slate-400" />{daysText}</span>}
                      {timeText && <span className="flex items-center gap-1.5 text-xs text-slate-500"><HiClock className="w-3.5 h-3.5 text-slate-400" />{timeText}</span>}
                    </div>
                  )}

                  {Array.isArray(item.batches) && item.batches.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Batches</p>
                      {item.batches.map((b: any) => (
                        <div key={b.id} className="flex items-center gap-2 bg-sky-50 rounded-xl px-3 py-2 text-xs">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>{b.sort_order + 1}</span>
                          <span className="font-bold flex-shrink-0" style={{ color: COLOR }}>{b.name}</span>
                          <span className="text-slate-500 truncate flex-1">{Array.isArray(b.days) ? b.days.join(', ') : ''}{b.time_start ? ` · ${fmt12(b.time_start)}–${fmt12(b.time_end)}` : ''}</span>
                          <span className="text-slate-400 flex-shrink-0">{b.max_students}👥</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-sm font-bold" style={{ color: item.is_free ? '#059669' : COLOR }}>
                      {item.is_free ? 'Free' : `₹${item.price}/session`}
                      {!item.is_free && <span className="text-xs font-normal text-slate-400 ml-1">· you get ₹{Math.round((item.price ?? 0) * 0.85)}</span>}
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(item.id, item.title)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition">
                        <HiTrash className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {item.status === 'active' && (
                    <button onClick={() => openBookings(item)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-sky-200 bg-sky-50 text-sm font-bold hover:bg-sky-100 transition" style={{ color: COLOR }}>
                      <HiUsers className="w-4 h-4" /> View Booked Students
                    </button>
                  )}
                  {item.status === 'pending' && (
                    <p className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-2 text-xs text-amber-700">
                      <HiHourglass className="w-3.5 h-3.5" /> Under review · Admin will verify your Aadhar and approve
                    </p>
                  )}
                  {item.status === 'rejected' && item.reject_note && (
                    <p className="flex items-start gap-1.5 bg-red-50 rounded-xl px-3 py-2 text-xs text-red-700">
                      <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {item.reject_note}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Bookings modal */}
      {bookingsFor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setBookingsFor(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <p className="font-extrabold text-sm text-slate-900 truncate">{bookingsFor.title} — Bookings</p>
              <button onClick={() => setBookingsFor(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5">
              {bookingsLoading ? (
                <p className="text-sm text-slate-400 text-center py-6">Loading…</p>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No bookings yet.</p>
              ) : (
                <div className="space-y-2">
                  {bookings.map((b: any) => (
                    <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{b.name ?? b.full_name ?? 'Student'}</p>
                        <p className="text-xs text-slate-400">{b.mobile}</p>
                      </div>
                      <span className="text-xs text-slate-500">{b.session_date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
