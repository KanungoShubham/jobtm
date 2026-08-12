'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  HiSearch, HiLocationMarker, HiCalendar, HiClock, HiUsers, HiShieldCheck,
  HiX, HiCheckCircle, HiCreditCard, HiAcademicCap, HiOutlineMusicNote, HiPlus,
} from 'react-icons/hi';
import { activitiesApi, activityPaymentsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

const CATEGORY_FILTERS = [
  { label: 'All', value: '', color: COLOR },
  { label: 'Coaching', value: 'coaching', color: '#0EA5E9' },
  { label: 'Dance', value: 'dance', color: '#EC4899' },
  { label: 'Yoga', value: 'yoga', color: '#8B5CF6' },
  { label: 'Fitness', value: 'fitness', color: '#EF4444' },
  { label: 'Music', value: 'music', color: '#F59E0B' },
  { label: 'Sports', value: 'sports', color: '#10B981' },
  { label: 'Academic', value: 'academic', color: '#6366F1' },
  { label: 'Arts', value: 'arts', color: '#F97316' },
  { label: 'Language', value: 'language', color: '#06B6D4' },
];

const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(CATEGORY_FILTERS.map((c) => [c.value, c.color]));

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`;
}

function isoToDisplay(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${MONTHS_SHORT[parseInt(m, 10) - 1]} ${y}`;
}

function getUpcomingDates(activity: any, max = 14): string[] {
  const activeDayNums = new Set((activity.days ?? []).map((d: string) => DAY_MAP[d] ?? -1).filter((n: number) => n >= 0));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = activity.start_date ? new Date(activity.start_date + 'T00:00:00') : today;
  const endDate = activity.end_date ? new Date(activity.end_date + 'T00:00:00') : new Date(today.getTime() + 90 * 86_400_000);
  const from = startDate > today ? startDate : today;
  const cur = new Date(from);
  const dates: string[] = [];
  while (cur <= endDate && dates.length < max) {
    if (activeDayNums.size === 0 || activeDayNums.has(cur.getDay())) dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export default function ActivitiesPage() {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [bookingActivity, setBookingActivity] = useState<any>(null);
  const [bookingDates, setBookingDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    activitiesApi.list({ category: category || undefined, q: query || undefined, location: selectedCity || undefined, page: 1, limit: 20 })
      .then((r) => { setActivities(r.data ?? []); setTotal(r.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, query, selectedCity]);

  const availableLocations = useMemo(() => {
    const seen = new Set<string>();
    const locs: string[] = [];
    activities.forEach((a) => {
      const loc = (a.location ?? '').trim();
      if (loc && !seen.has(loc)) { seen.add(loc); locs.push(loc); }
    });
    return locs.sort();
  }, [activities]);

  const hasFilters = !!(category || selectedCity || query);
  const clearFilters = () => { setCategory(''); setSelectedCity(''); setQuery(''); };

  const openBooking = (item: any) => {
    const hasBatches = Array.isArray(item.batches) && item.batches.length > 0;
    setSelectedBatch(null);
    setBookingDates(hasBatches ? [] : getUpcomingDates(item));
    setSelectedDates([]);
    setBookingResult(null);
    setBookingActivity(item);
  };
  const closeBooking = () => { setBookingActivity(null); setSelectedDates([]); setBookingDates([]); setSelectedBatch(null); setBookingResult(null); };

  const selectBatch = (batch: any) => {
    setSelectedBatch(batch);
    setSelectedDates([]);
    setBookingDates(getUpcomingDates({ ...bookingActivity, days: batch.days ?? bookingActivity.days }));
  };
  const toggleDate = (d: string) => setSelectedDates((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const confirmFreeBooking = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || selectedDates.length === 0) return;
    setBookingLoading(true);
    try {
      const res = await activitiesApi.book(token, bookingActivity.id, { session_dates: selectedDates, batch_id: selectedBatch?.id });
      const n = selectedDates.length;
      const skipped = res.skipped?.length ?? 0;
      setBookingResult({ ok: true, message: skipped ? `${n - skipped} session(s) booked. (${skipped} already booked were skipped.)` : `${n} session(s) booked for "${bookingActivity.title}".` });
    } catch (err: any) {
      setBookingResult({ ok: false, message: err.message ?? 'Booking failed. Please try again.' });
    } finally { setBookingLoading(false); }
  };

  const confirmPaidBooking = async () => {
    const token = jobseekerAuth.getToken();
    if (!token || selectedDates.length === 0) return;
    setBookingLoading(true);
    try {
      const n = selectedDates.length;
      const orderRes = await activityPaymentsApi.createOrder(token, {
        activity_id: bookingActivity.id, session_dates: selectedDates, seats: n, batch_id: selectedBatch?.id,
      });
      const paymentUrl = orderRes?.payment_url;
      if (!paymentUrl) { setBookingResult({ ok: false, message: 'Payment URL not received.' }); return; }

      const win = window.open(paymentUrl, '_blank', 'width=480,height=720');
      if (!win) { setBookingResult({ ok: false, message: 'Popup blocked — please allow popups and try again.' }); return; }

      await new Promise<void>((resolve) => {
        const timer = setInterval(() => { if (win.closed) { clearInterval(timer); resolve(); } }, 700);
      });

      const statusRes = await activityPaymentsApi.checkBooking(token, bookingActivity.id, selectedDates);
      if (statusRes.booked) {
        const booked = statusRes.data.length;
        const skipped = n - booked;
        setBookingResult({ ok: true, message: skipped > 0 ? `${booked} of ${n} sessions booked. (${skipped} already booked.)` : `${booked} session(s) booked for "${bookingActivity.title}". Provider notified.` });
      } else {
        setBookingResult({ ok: false, message: 'Payment not completed. No booking was created — if the amount was deducted it will reflect shortly.' });
      }
    } catch (err: any) {
      setBookingResult({ ok: false, message: err.message ?? 'Could not start payment. Please try again.' });
    } finally { setBookingLoading(false); }
  };

  const bookingColor = bookingActivity ? (CATEGORY_COLORS[bookingActivity.category] ?? COLOR) : COLOR;
  const hasBatches = Array.isArray(bookingActivity?.batches) && bookingActivity.batches.length > 0;
  const batchRequired = hasBatches && !selectedBatch;
  const noDates = selectedDates.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLOR }}>
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Extra Curricular Activities</h1>
            <p className="text-sm text-slate-400">Browse and join sessions near you</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2.5 w-full lg:w-80 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-50 transition-all">
            <HiSearch className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dance, yoga, coaching…" className="flex-1 text-sm outline-none placeholder:text-slate-400" />
          </div>
          <Link href="/jobseeker/activities/my" className="flex-shrink-0 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-sky-300 hover:text-sky-600 transition whitespace-nowrap">
            My Activities
          </Link>
          <Link href="/jobseeker/activities/create" className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold text-white transition hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: COLOR }}>
            <HiPlus className="w-4 h-4" /> Offer a Class
          </Link>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORY_FILTERS.map((f) => {
          const active = category === f.value;
          return (
            <button key={f.value} onClick={() => setCategory(f.value)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold transition-all duration-200"
              style={active ? { backgroundColor: f.color, borderColor: f.color, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Location chips */}
      {availableLocations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {availableLocations.map((loc) => {
            const active = selectedCity === loc;
            return (
              <button key={loc} onClick={() => setSelectedCity(active ? '' : loc)}
                className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full border-[1.5px] text-xs font-semibold transition-all"
                style={active ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                <HiLocationMarker className="w-3 h-3" />
                {loc}
              </button>
            );
          })}
        </div>
      )}

      {/* Results bar */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <span>{total} {total === 1 ? 'class' : 'classes'}{selectedCity ? ` in ${selectedCity}` : ''}</span>
        {hasFilters && <button onClick={clearFilters} className="text-rose-400 font-semibold hover:underline">Clear all</button>}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center">
            <HiAcademicCap className="w-7 h-7" style={{ color: COLOR }} />
          </div>
          <p className="font-bold text-slate-900">No classes found</p>
          <p className="text-sm text-slate-400 text-center max-w-xs">
            {selectedCity ? `No classes in ${selectedCity}. Try another location.` : query ? `No results for "${query}".` : 'No activities in this category yet.'}
          </p>
          {hasFilters && <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: COLOR }}>Clear all filters</button>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((item: any, i: number) => {
            const color = CATEGORY_COLORS[item.category] ?? COLOR;
            const daysText = Array.isArray(item.days) ? item.days.join(' · ') : '';
            const timeText = item.time_start ? `${fmt12(item.time_start)} – ${fmt12(item.time_end)}` : '';
            return (
              <ScrollReveal key={item.id} animation="fade-up" delay={i * 50}>
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-warm-lg hover-lift transition-all duration-300 p-5 flex flex-col gap-3 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}1A` }}>
                      <HiOutlineMusicNote className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                      {item.location && (
                        <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <HiLocationMarker className="w-3 h-3" /> {item.location}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: item.is_free ? '#D1FAE5' : `${color}1A`, color: item.is_free ? '#059669' : color }}>
                      {item.is_free ? 'Free' : `₹${item.price}`}
                    </span>
                  </div>

                  {item.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>}

                  {(daysText || timeText) && (
                    <div className="flex flex-wrap items-center gap-3 bg-slate-50 rounded-xl px-3 py-2">
                      {daysText && <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><HiCalendar className="w-3 h-3" style={{ color }} />{daysText}</span>}
                      {timeText && <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><HiClock className="w-3 h-3" style={{ color }} />{timeText}</span>}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-auto">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400"><HiUsers className="w-3 h-3" />Max {item.max_students ?? '—'}</span>
                    {!item.is_free && <span className="flex items-center gap-1 text-[11px] text-emerald-600"><HiShieldCheck className="w-3 h-3" />Secure payment</span>}
                  </div>

                  <button onClick={() => openBooking(item)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: color }}>
                    {item.is_free ? <HiCheckCircle className="w-4 h-4" /> : <HiCreditCard className="w-4 h-4" />}
                    {item.is_free ? 'Join for Free' : `Book Now · ₹${item.price}/session`}
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Booking modal */}
      {bookingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeBooking}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${bookingColor}1A` }}>
                  <HiOutlineMusicNote className="w-4 h-4" style={{ color: bookingColor }} />
                </div>
                <p className="font-extrabold text-sm text-slate-900 truncate">{bookingActivity.title}</p>
              </div>
              <button onClick={closeBooking} className="text-slate-400 hover:text-slate-600 flex-shrink-0"><HiX className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-5">
              {bookingResult ? (
                <div className={`rounded-xl px-4 py-4 text-sm font-medium ${bookingResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {bookingResult.message}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Session Price</p>
                      <p className="text-xl font-extrabold" style={{ color: bookingColor }}>{bookingActivity.is_free ? 'Free' : `₹${bookingActivity.price}`}</p>
                      {!bookingActivity.is_free && <p className="text-[11px] text-slate-400 mt-0.5">15% platform fee applies</p>}
                    </div>
                    {bookingActivity.is_free && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">No payment needed</span>}
                  </div>

                  {hasBatches && (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900">Select Batch</p>
                      {bookingActivity.batches.map((b: any) => {
                        const isActive = selectedBatch?.id === b.id;
                        const bDays = Array.isArray(b.days) ? b.days.join(', ') : '';
                        const bTime = b.time_start ? `${fmt12(b.time_start)} – ${fmt12(b.time_end)}` : '';
                        return (
                          <button key={b.id} onClick={() => selectBatch(b)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition"
                            style={isActive ? { backgroundColor: `${bookingColor}15`, borderColor: bookingColor } : { borderColor: '#E2E8F0' }}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={isActive ? { color: bookingColor } : undefined}>{b.name}</p>
                              {(bDays || bTime) && <p className="text-xs text-slate-500">{bDays}{bDays && bTime ? ' · ' : ''}{bTime}</p>}
                            </div>
                            {b.price != null && <span className="text-sm font-extrabold" style={{ color: bookingColor }}>₹{b.price}</span>}
                            {isActive && <HiCheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: bookingColor }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {(!hasBatches || selectedBatch) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">Pick Session Dates</p>
                        <span className="text-xs text-slate-400">Tap to select multiple</span>
                      </div>
                      {bookingDates.length === 0 ? (
                        <p className="text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3">No upcoming session dates available.</p>
                      ) : (
                        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                          {bookingDates.map((d) => {
                            const [y, m, day] = d.split('-');
                            const weekday = WEEKDAYS[new Date(d + 'T00:00:00').getDay()];
                            const isActive = selectedDates.includes(d);
                            return (
                              <button key={d} onClick={() => toggleDate(d)}
                                className="flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border-2 min-w-[64px] transition"
                                style={isActive ? { backgroundColor: bookingColor, borderColor: bookingColor } : { borderColor: '#E2E8F0' }}>
                                <span className={`text-[10px] font-bold ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{weekday}</span>
                                <span className={`text-lg font-extrabold ${isActive ? 'text-white' : 'text-slate-900'}`}>{parseInt(day, 10)}</span>
                                <span className={`text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{MONTHS_SHORT[parseInt(m, 10) - 1]}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedDates.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-700">{selectedDates.length} date(s) selected</p>
                        <button onClick={() => setSelectedDates([])} className="text-xs text-rose-400 font-semibold">Clear all</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDates.map((d) => (
                          <span key={d} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${bookingColor}18`, color: bookingColor }}>
                            {isoToDisplay(d)}
                            <button onClick={() => toggleDate(d)}><HiX className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      {!bookingActivity.is_free && (
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800">
                          Total: ₹{(bookingActivity.price ?? 0) * selectedDates.length}
                          <span className="text-xs font-normal text-slate-400">({selectedDates.length} × ₹{bookingActivity.price})</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={bookingActivity.is_free ? confirmFreeBooking : confirmPaidBooking}
                    disabled={bookingLoading || noDates || batchRequired}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-extrabold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: bookingLoading || noDates || batchRequired ? '#CBD5E1' : bookingActivity.is_free ? '#10B981' : bookingColor }}
                  >
                    {bookingLoading ? 'Processing…' : batchRequired ? 'Select a batch above' : noDates ? 'Pick dates above'
                      : bookingActivity.is_free ? `Confirm ${selectedDates.length} Session(s) — Free`
                      : `Pay ₹${(bookingActivity.price ?? 0) * selectedDates.length} · ${selectedDates.length} Session(s)`}
                  </button>

                  {!bookingActivity.is_free && (
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <HiShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secured by Razorpay · UPI, Cards, Netbanking accepted
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
