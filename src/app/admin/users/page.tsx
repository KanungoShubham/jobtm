'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiSearch, HiX, HiUsers, HiExclamationCircle, HiCheckCircle,
  HiBan, HiEye, HiRefresh, HiPhone, HiMail, HiCalendar, HiOfficeBuilding,
} from 'react-icons/hi';
import { usersApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const TABS = ['All', 'Job Seekers', 'Employers', 'Pending'];

const STATUS_PILL: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending:  'bg-amber-100  text-amber-700',
  rejected: 'bg-red-100    text-red-600',
};

function UserDetailPanel({ user: u, onClose, onUpdate }: {
  user: any; onClose: () => void; onUpdate: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState('');

  const action = async (updates: { verify_status?: string; is_active?: boolean }) => {
    setUpdating(true); setError('');
    try {
      await usersApi.updateStatus(getAdminToken() ?? '', u.id, updates);
      onUpdate();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const isEmployer = u.role === 'employer';
  const status     = u.verify_status ?? 'pending';
  const isActive   = u.is_active !== false;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">
            {isEmployer ? 'Employer Details' : 'Job Seeker Details'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <HiX className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-4">
          {/* Avatar + name */}
          <div className={`flex items-center gap-4 rounded-2xl p-4 border ${isEmployer ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${isEmployer ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {(u.company?.name ?? u.full_name ?? '?').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-slate-900 truncate">
                {isEmployer ? (u.company?.name ?? u.full_name) : u.full_name}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[status] ?? 'bg-slate-100 text-slate-500'}`}>
                  {status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEmployer ? 'bg-blue-100 text-blue-700' : 'bg-sky-100 text-sky-700'}`}>
                  {isEmployer ? 'Employer' : 'Job Seeker'}
                </span>
                {u.aadhar_verified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Aadhar ✓</span>
                )}
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
            {[
              { icon: HiUsers,    label: 'Name',   value: u.full_name ?? '—' },
              { icon: HiPhone,    label: 'Mobile', value: u.mobile ?? '—' },
              { icon: HiMail,     label: 'Email',  value: u.email  ?? '—' },
              { icon: HiCalendar, label: 'Joined', value: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3">
                <row.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-400 w-14 flex-shrink-0">{row.label}</span>
                <span className="text-sm text-slate-800 font-medium truncate">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Company details (employer only) */}
          {isEmployer && u.company && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-50 bg-slate-50">
                <HiOfficeBuilding className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Details</p>
              </div>
              {[
                { label: 'Company', value: u.company.name },
                { label: 'City',    value: u.company.city },
                { label: 'PAN',     value: u.company.pan_number ?? '—' },
                { label: 'CIN',     value: u.company.cin_number ?? '—' },
              ].map((row, i) => (
                <div key={row.label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                  <span className="text-xs text-slate-400 w-16 flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-slate-800 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl flex items-center gap-2">
              <HiExclamationCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            {status === 'pending' && (
              <button
                disabled={updating}
                onClick={() => action({ verify_status: 'approved' })}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold py-3 rounded-2xl text-sm transition">
                {updating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiCheckCircle className="w-4 h-4" />}
                Approve
              </button>
            )}
            <div className="flex gap-2.5">
              <button
                disabled={updating}
                onClick={() => action({ is_active: !isActive })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold border transition ${
                  isActive ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                }`}>
                <HiBan className="w-4 h-4" />
                {isActive ? 'Suspend' : 'Activate'}
              </button>
              {status === 'pending' && (
                <button
                  disabled={updating}
                  onClick={() => action({ verify_status: 'rejected' })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition">
                  <HiX className="w-4 h-4" />
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [query,    setQuery]    = useState('');
  const [tab,      setTab]      = useState('All');
  const [users,    setUsers]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: any = {};
      if (tab === 'Job Seekers') params.role   = 'jobseeker';
      if (tab === 'Employers')   params.role   = 'employer';
      if (tab === 'Pending')     params.status = 'pending';
      if (query.trim())          params.q      = query.trim();

      const res = await usersApi.list(getAdminToken() ?? '', params);
      setUsers(res.data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tab, query]);

  useEffect(() => { load(); }, [load]);

  const pendingCount = users.filter((u) => u.verify_status === 'pending').length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-xl">{users.length} total</span>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-xl text-sm transition">
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, company…"
          className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white transition"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-semibold transition ${
              tab === t ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}>
            {t}
            {t === 'Pending' && pendingCount > 0 && (
              <span className={`text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ${tab === t ? 'bg-white/25 text-white' : 'bg-red-500 text-white'}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiUsers className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No users found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {users.map((u) => {
            const isEmployer = u.role === 'employer';
            const status     = u.verify_status ?? 'pending';
            const isActive   = u.is_active !== false;

            return (
              <div key={u.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-extrabold flex-shrink-0 ${isEmployer ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {(u.company?.name ?? u.full_name ?? '?').charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-900 truncate">
                    {isEmployer ? (u.company?.name ?? u.full_name) : u.full_name}
                  </p>
                  <p className="text-xs text-slate-500">{u.mobile}</p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isEmployer ? 'bg-blue-100 text-blue-700' : 'bg-sky-100 text-sky-700'}`}>
                    {isEmployer ? 'Employer' : 'Job Seeker'}
                  </span>
                </div>

                <button onClick={() => setSelected(u)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-500 hover:text-blue-600 text-xs font-bold transition">
                  <HiEye className="w-3.5 h-3.5" />
                  Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <UserDetailPanel
          user={selected}
          onClose={() => setSelected(null)}
          onUpdate={load}
        />
      )}
    </div>
  );
}
