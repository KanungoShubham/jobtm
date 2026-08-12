'use client';
import { useEffect, useState } from 'react';
import { HiBell, HiCheckCircle } from 'react-icons/hi';
import { notificationsApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    notificationsApi.list(token).then((r) => { setItems(r.data ?? []); setUnread(r.unread ?? 0); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markAllRead = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    await notificationsApi.markAllRead(token);
    load();
  };

  const markRead = async (id: string) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    await notificationsApi.markRead(token, id);
    load();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-400">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm font-semibold" style={{ color: COLOR }}>Mark all read</button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 py-12 text-center">Loading…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiBell className="w-12 h-12 text-slate-200" />
          <p className="text-sm text-slate-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {items.map((n, i) => (
            <ScrollReveal key={n.id} animation="fade-up" delay={i * 30}>
              <button onClick={() => !n.is_read && markRead(n.id)} className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-slate-50 transition">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: n.is_read ? '#F1F5F9' : '#E0F2FE' }}>
                  {n.is_read ? <HiCheckCircle className="w-4 h-4 text-slate-400" /> : <HiBell className="w-4 h-4" style={{ color: COLOR }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.is_read ? 'text-slate-500' : 'font-bold text-slate-900'}`}>{n.title ?? n.message}</p>
                  {n.title && n.message && <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>}
                  <p className="text-[11px] text-slate-300 mt-1">{n.created_at ? new Date(n.created_at).toLocaleString('en-IN') : ''}</p>
                </div>
                {!n.is_read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: COLOR }} />}
              </button>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
