'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiAcademicCap, HiRefresh, HiExclamationCircle, HiLocationMarker,
  HiClock, HiUsers, HiCash, HiCheck, HiX, HiChevronDown, HiChevronUp,
  HiCalendar, HiSearch, HiLockClosed, HiCheckCircle, HiPhotograph,
} from 'react-icons/hi';
import { activitiesAdminApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

type Tab = 'pending' | 'active' | 'rejected' | 'payments';

const CATEGORY_EMOJI: Record<string, string> = {
  dance: '💃', coaching: '🎓', yoga: '🧘', music: '🎵', sports: '⚽',
  arts: '🎨', language: '🌐', fitness: '🏋️', academic: '📚', other: '✨',
};

const STATUS_PILL: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  active:   'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  paused:   'bg-slate-100 text-slate-500',
};

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  return `${h % 12 || 12}:${mStr} ${h >= 12 ? 'PM' : 'AM'}`;
}

// ── Activity Card ─────────────────────────────────────────────

function ActivityCard({
  item,
  onApprove,
  onReject,
  actioning,
}: {
  item: any;
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
  actioning: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [aadharOpen, setAadharOpen] = useState(false);
  const days  = Array.isArray(item.days) ? item.days.join(', ') : '—';
  const time  = item.time_start ? `${fmt12(item.time_start)} – ${fmt12(item.time_end)}` : '—';
  const isBusy = actioning === item.id;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 text-xl">
            {CATEGORY_EMOJI[item.category] ?? '✨'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">{item.title}</p>
            <p className="text-xs text-slate-500">
              {item.provider_name ?? '—'}
              {item.provider_mobile ? ` · ${item.provider_mobile}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[item.status] ?? 'bg-slate-100 text-slate-400'}`}>
              {item.status}
            </span>
            {expanded ? <HiChevronUp className="w-4 h-4 text-slate-400" /> : <HiChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Quick badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-sky-50 text-sky-600 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize">
            {item.category}
          </span>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <HiCalendar className="w-3 h-3" /> {days}
          </span>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <HiClock className="w-3 h-3" /> {time}
          </span>
          {item.is_free ? (
            <span className="bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              🆓 Free
            </span>
          ) : (
            <span className="bg-violet-50 text-violet-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              ₹{item.price}/session
            </span>
          )}
          {!item.aadhar_image_url && (
            <span className="bg-red-50 text-red-500 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <HiLockClosed className="w-3 h-3" /> No Aadhar
            </span>
          )}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 space-y-4 pt-3">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: HiLocationMarker, label: 'Location',    value: item.location ?? '—' },
              { icon: HiUsers,          label: 'Max Students', value: `${item.max_students ?? '—'} per batch` },
              { icon: HiCash,           label: 'Payout (85%)',
                value: item.is_free ? 'Free' : `₹${Math.round((item.price ?? 0) * 0.85)} per session` },
              { icon: HiCalendar,       label: 'Submitted',
                value: item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN') : '—' },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-2">
                <row.icon className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400">{row.label}</p>
                  <p className="text-xs font-semibold text-slate-700">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Address */}
          {item.address && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Address</p>
              <p className="text-xs text-slate-600">{item.address}</p>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{item.description}</p>
            </div>
          )}

          {/* Skills */}
          {Array.isArray(item.skills) && item.skills.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills Taught</p>
              <div className="flex flex-wrap gap-1.5">
                {(item.skills as string[]).map((s: string) => (
                  <span key={s} className="bg-sky-50 text-sky-600 text-[11px] font-medium px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Activity image */}
          {item.activity_image_url && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <HiPhotograph className="w-3.5 h-3.5" /> Activity Photo
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.activity_image_url}
                alt="Activity"
                className="w-full max-h-48 object-cover rounded-xl border border-slate-100"
              />
            </div>
          )}

          {/* Aadhar card */}
          <div>
            <button
              onClick={() => setAadharOpen(!aadharOpen)}
              className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 hover:text-slate-700 transition">
              <HiLockClosed className="w-3.5 h-3.5 text-violet-500" />
              Aadhar Card (ID Verification)
              {aadharOpen ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
            </button>
            {aadharOpen && (
              item.aadhar_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.aadhar_image_url}
                  alt="Aadhar Card"
                  className="w-full max-h-52 object-contain rounded-xl border-2 border-violet-200 bg-slate-50"
                />
              ) : (
                <div className="h-16 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center">
                  <p className="text-xs font-semibold text-red-500">⚠️ Aadhar card not uploaded</p>
                </div>
              )
            )}
          </div>

          {/* Reject note if rejected */}
          {item.status === 'rejected' && item.reject_note && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-0.5">Rejection Note</p>
              <p className="text-xs text-red-700">{item.reject_note}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions — only for pending */}
      {item.status === 'pending' && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => onReject(item.id)}
            disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-300 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition disabled:opacity-50">
            <HiX className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => onApprove(item.id)}
            disabled={isBusy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition disabled:opacity-50">
            {isBusy
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <HiCheckCircle className="w-4 h-4" />}
            {isBusy ? 'Approving…' : 'Approve & Go Live'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Payment Row (compact) ──────────────────────────────────────

function PaymentRow({ booking, onView }: {
  booking: any;
  onView: (b: any) => void;
}) {
  const sessDate = booking.session_date ? new Date(booking.session_date) : null;
  const isHeld   = booking.payout_status === 'held';

  return (
    <button
      onClick={() => onView(booking)}
      className="w-full text-left bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2.5 flex items-center gap-3 hover:border-slate-300 hover:shadow transition">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isHeld ? 'bg-amber-50' : 'bg-emerald-50'}`}>
        {isHeld
          ? <HiLockClosed className="w-4 h-4 text-amber-500" />
          : <HiCheckCircle className="w-4 h-4 text-emerald-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-900 truncate">{booking.booked_by_name ?? 'Student'}</p>
        <p className="text-[11px] text-slate-500 truncate">
          {booking.booked_by_mobile ?? '—'}
          {sessDate ? ` · ${sessDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-extrabold text-slate-900">₹{booking.amount_paid ?? 0}</p>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
          isHeld ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {booking.payout_status}
        </span>
      </div>
      <HiChevronDown className="w-4 h-4 text-slate-300 -rotate-90 flex-shrink-0" />
    </button>
  );
}

// ── Payment Detail Modal ───────────────────────────────────────

function PaymentDetailModal({ booking, onClose, onRelease, actioning }: {
  booking: any;
  onClose: () => void;
  onRelease: (id: string) => void;
  actioning: string | null;
}) {
  if (!booking) return null;
  const pct15      = Math.round((booking.amount_paid ?? 0) * 0.15);
  const pct85      = Math.round((booking.amount_paid ?? 0) * 0.85);
  const sessDate   = booking.session_date ? new Date(booking.session_date) : null;
  const isPast     = sessDate ? sessDate < new Date() : false;
  const isHeld     = booking.payout_status === 'held';
  const canRelease = isHeld && isPast;
  const isBusy     = actioning === booking.id;

  const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div className="flex justify-between gap-3 py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-xs font-semibold text-slate-700 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHeld ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              {isHeld ? <HiLockClosed className="w-5 h-5 text-amber-500" /> : <HiCheckCircle className="w-5 h-5 text-emerald-500" />}
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">{booking.activity_title ?? 'Activity Session'}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHeld ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {booking.payout_status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <HiX className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* People */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student</p>
            <Row label="Name"   value={booking.booked_by_name ?? '—'} />
            <Row label="Mobile" value={booking.booked_by_mobile ?? '—'} mono />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Provider / Instructor</p>
            <Row label="Name"   value={booking.provider_name ?? '—'} />
            <Row label="Mobile" value={booking.provider_mobile ?? '—'} mono />
          </div>

          {/* Session */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session</p>
            <Row label="Date"     value={sessDate ? sessDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
            <Row label="Status"   value={booking.status ?? '—'} />
            <Row label="Category" value={booking.activity_category ?? '—'} />
          </div>

          {/* Payment breakdown */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Collected</span>
              <span className="font-bold text-slate-900">₹{booking.amount_paid ?? 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Platform Fee ({booking.platform_fee_pct ?? 15}%)</span>
              <span className="font-semibold text-red-500">−₹{pct15}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Provider Payout (85%)</span>
              <span className="font-extrabold text-emerald-600">₹{pct85}</span>
            </div>
          </div>

          {/* Payment meta */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment</p>
            <Row label="Method"  value={booking.payment_method ?? '—'} />
            <Row label="Ref ID"  value={booking.payment_id ?? '—'} mono />
            <Row label="Booked"  value={booking.booked_at ? new Date(booking.booked_at).toLocaleString('en-IN') : '—'} />
            {booking.payout_date && (
              <Row label="Payout released" value={new Date(booking.payout_date).toLocaleDateString('en-IN')} />
            )}
          </div>

          {/* Release action */}
          {canRelease ? (
            <button
              onClick={() => onRelease(booking.id)}
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition disabled:opacity-60">
              {isBusy
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <HiCash className="w-4 h-4" />}
              {isBusy ? 'Releasing…' : `Release ₹${pct85} to Provider`}
            </button>
          ) : isHeld ? (
            <div className="flex items-center justify-center gap-2 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl">
              <HiClock className="w-4 h-4" /> Waiting for session date to pass before payout
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl">
              <HiCheckCircle className="w-4 h-4" />
              Payout released {booking.payout_date ? `on ${new Date(booking.payout_date).toLocaleDateString('en-IN')}` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function AdminActivitiesPage() {
  const [tab,        setTab]       = useState<Tab>('pending');
  const [activities, setActivities] = useState<any[]>([]);
  const [payments,   setPayments]  = useState<any[]>([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState('');
  const [actioning,  setActioning] = useState<string | null>(null);
  const [query,      setQuery]     = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [detailBooking, setDetailBooking] = useState<any>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const token = getAdminToken() ?? '';

  const loadActivities = useCallback(async () => {
    if (tab === 'payments') return;
    setLoading(true); setError('');
    try {
      const res = await activitiesAdminApi.list(token, { status: tab });
      setActivities(res.data ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [tab, token]);

  const loadPayments = useCallback(async () => {
    if (tab !== 'payments') return;
    setLoading(true); setError('');
    try {
      const res = await activitiesAdminApi.getPayments(token);
      setPayments(res.data ?? []);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [tab, token]);

  useEffect(() => {
    if (tab === 'payments') loadPayments();
    else loadActivities();
  }, [tab, loadActivities, loadPayments]);

  const handleApprove = async (id: string) => {
    setActioning(id);
    try {
      await activitiesAdminApi.verify(token, id, 'approve');
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) { setError(e.message); }
    finally { setActioning(null); }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActioning(rejectTarget);
    try {
      await activitiesAdminApi.verify(token, rejectTarget, 'reject', rejectNote);
      setActivities((prev) => prev.filter((a) => a.id !== rejectTarget));
      setRejectTarget(null); setRejectNote('');
    } catch (e: any) { setError(e.message); }
    finally { setActioning(null); }
  };

  const handleRelease = async (bookingId: string) => {
    setActioning(bookingId);
    try {
      await activitiesAdminApi.releasePayout(token, bookingId);
      const patch = { payout_status: 'released', payout_date: new Date().toISOString() };
      setPayments((prev) =>
        prev.map((p) => p.id === bookingId ? { ...p, ...patch } : p)
      );
      setDetailBooking((prev: any) => prev && prev.id === bookingId ? { ...prev, ...patch } : prev);
    } catch (e: any) { setError(e.message); }
    finally { setActioning(null); }
  };

  const filteredActivities = activities.filter((a) =>
    !query || a.title?.toLowerCase().includes(query.toLowerCase()) ||
    a.provider_name?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPayments = payments.filter((p) =>
    !query || p.activity_title?.toLowerCase().includes(query.toLowerCase()) ||
    p.provider_name?.toLowerCase().includes(query.toLowerCase()) ||
    p.booked_by_name?.toLowerCase().includes(query.toLowerCase())
  );

  // Summary stats for payments tab
  const totalHeld     = payments.filter((p) => p.payout_status === 'held').reduce((s, p) => s + Math.round((p.amount_paid ?? 0) * 0.85), 0);
  const totalReleased = payments.filter((p) => p.payout_status === 'released').reduce((s, p) => s + Math.round((p.amount_paid ?? 0) * 0.85), 0);
  const platformEarn  = payments.reduce((s, p) => s + Math.round((p.amount_paid ?? 0) * 0.15), 0);

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'pending',  label: '⏳ Pending',  count: tab === 'pending'  ? filteredActivities.length : undefined },
    { key: 'active',   label: '✅ Active',   count: tab === 'active'   ? filteredActivities.length : undefined },
    { key: 'rejected', label: '❌ Rejected', count: tab === 'rejected' ? filteredActivities.length : undefined },
    { key: 'payments', label: '💰 Payments', count: tab === 'payments' ? payments.length : undefined },
  ];

  // Group payments by activity
  const paymentGroups = (() => {
    const map = new Map<string, { activity_id: string; title: string; category: string; provider: string; rows: any[]; total: number }>();
    for (const p of filteredPayments) {
      const key = p.activity_id;
      if (!map.has(key)) {
        map.set(key, {
          activity_id: key,
          title:       p.activity_title ?? 'Activity',
          category:    p.activity_category ?? 'other',
          provider:    p.provider_name ?? '—',
          rows:        [],
          total:       0,
        });
      }
      const g = map.get(key)!;
      g.rows.push(p);
      g.total += Number(p.amount_paid ?? 0);
    }
    return Array.from(map.values());
  })();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiAcademicCap className="w-6 h-6 text-sky-500" />
            Extra Curricular Activities
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Verify providers · approve Aadhar · manage session payouts
          </p>
        </div>
        <button
          onClick={() => { if (tab === 'payments') loadPayments(); else loadActivities(); }}
          disabled={loading}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Payments summary cards */}
      {tab === 'payments' && payments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Held (pending release)', value: `₹${totalHeld.toLocaleString('en-IN')}`, color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { label: 'Released to providers',  value: `₹${totalReleased.toLocaleString('en-IN')}`, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            { label: 'Platform earnings (15%)', value: `₹${platformEarn.toLocaleString('en-IN')}`, color: 'bg-red-50 border-red-200 text-red-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border px-4 py-3 ${s.color}`}>
              <p className="text-xl font-extrabold">{s.value}</p>
              <p className="text-[11px] font-semibold opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              tab === t.key
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {t.label}
            {t.count !== undefined && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === 'payments' ? 'Search by activity, provider, student…' : 'Search by title or provider…'}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Reject Activity</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Reason / Note for Provider (optional)
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g. Aadhar image unclear, please resubmit with a sharper photo…"
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-300 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectTarget(null); setRejectNote(''); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!!actioning}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition disabled:opacity-60">
                {actioning ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'payments' ? (
        filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <HiCash className="w-12 h-12 text-slate-300" />
            <p className="text-base font-semibold text-slate-400">No payment records</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentGroups.map((g) => {
              const isCollapsed = collapsed.has(g.activity_id);
              return (
              <div key={g.activity_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Activity header — click to collapse/expand */}
                <button
                  onClick={() => toggleCollapse(g.activity_id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 border-b border-slate-100 transition text-left">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-lg flex-shrink-0">
                    {CATEGORY_EMOJI[g.category] ?? '✨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate">{g.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {g.provider} · {g.rows.length} booking{g.rows.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-slate-400">Collected</p>
                    <p className="text-sm font-extrabold text-slate-900">₹{g.total.toLocaleString('en-IN')}</p>
                  </div>
                  {isCollapsed
                    ? <HiChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    : <HiChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                {/* Bookings inside this activity */}
                {!isCollapsed && (
                  <div className="p-2.5 space-y-2">
                    {g.rows.map((p) => (
                      <PaymentRow key={p.id} booking={p} onView={setDetailBooking} />
                    ))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )
      ) : filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiAcademicCap className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">
            No {tab} activities
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((item) => (
            <ActivityCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={(id) => setRejectTarget(id)}
              actioning={actioning}
            />
          ))}
        </div>
      )}

      {/* Payment detail popup */}
      {detailBooking && (
        <PaymentDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onRelease={handleRelease}
          actioning={actioning}
        />
      )}
    </div>
  );
}
