'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiSearch, HiX, HiUsers, HiExclamationCircle, HiCheckCircle,
  HiBan, HiEye, HiRefresh, HiPhone, HiMail, HiCalendar,
  HiOfficeBuilding, HiLocationMarker, HiGlobe, HiDocumentText,
  HiIdentification, HiBriefcase,
} from 'react-icons/hi';
import { usersApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const TABS = ['All', 'Job Seekers', 'Employers', 'Pending'];

const STATUS_PILL: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending:  'bg-amber-100  text-amber-700',
  rejected: 'bg-red-100    text-red-600',
};

function Section({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-50 bg-slate-50">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }: {
  icon?: any; label: string; value: string; href?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-50 first:border-0">
      {Icon && <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      <span className="text-xs text-slate-400 w-20 flex-shrink-0">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-sm text-blue-600 font-medium hover:underline truncate">{value}</a>
      ) : (
        <span className="text-sm text-slate-800 font-medium truncate">{value || '—'}</span>
      )}
    </div>
  );
}

function UserDetailPanel({ userId, onClose, onUpdate }: {
  userId: string | null; onClose: () => void; onUpdate: () => void;
}) {
  const [data,     setData]     = useState<any>(null);
  const [loading,  setLoading]  = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error,    setError]    = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    if (!userId) { setData(null); return; }
    setLoading(true); setError('');
    usersApi.get(getAdminToken() ?? '', userId)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const action = async (updates: object) => {
    if (!data) return;
    setUpdating(true); setError('');
    try {
      await usersApi.updateStatus(getAdminToken() ?? '', data.id, updates);
      onUpdate();
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setUpdating(false); }
  };

  if (!userId) return null;

  const u          = data;
  const isEmployer = u?.role === 'employer';
  const status     = u?.verify_status ?? 'pending';
  const isActive   = u?.is_active !== false;
  const co         = u?.company;
  const persons: any[]   = co?.authorized_persons ?? [];
  const workExp: any[]   = u?.work ?? [];
  const education: any[] = u?.education ?? [];
  const skills: string[] = u?.skills ?? [];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-extrabold text-slate-900">
            {isEmployer ? 'Employer Details' : 'Job Seeker Details'}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
            <HiX className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading details…</p>
          </div>
        ) : !u ? (
          <div className="flex flex-col items-center py-20">
            <p className="text-sm text-slate-400">Could not load user details.</p>
          </div>
        ) : (
          <div className="flex-1 p-5 space-y-4">

            {/* Avatar + status */}
            <div className={`flex items-center gap-4 rounded-2xl p-4 border ${isEmployer ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${isEmployer ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {(co?.name ?? u.full_name ?? '?').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-extrabold text-slate-900 truncate">
                  {isEmployer ? (co?.name ?? u.full_name) : u.full_name}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isEmployer       ? 'bg-blue-100 text-blue-700'
                    : u?.role === 'admin' ? 'bg-red-100 text-red-700'
                    : 'bg-sky-100 text-sky-700'
                  }`}>
                    {isEmployer ? 'Employer' : u?.role === 'admin' ? 'Admin' : 'Job Seeker'}
                  </span>
                  {!isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Suspended</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile info */}
            <Section title="Profile" icon={HiUsers}>
              <InfoRow icon={HiUsers}    label="Name"   value={u.full_name ?? '—'} />
              <InfoRow icon={HiPhone}    label="Mobile" value={u.mobile ?? '—'} />
              <InfoRow icon={HiMail}     label="Email"  value={u.email ?? '—'} />
              <InfoRow icon={HiCalendar} label="Joined" value={u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'} />
              {u.city && <InfoRow icon={HiLocationMarker} label="City" value={u.city} />}
              {u.headline && <InfoRow icon={HiBriefcase} label="Headline" value={u.headline} />}
            </Section>

            {/* Employer: company details */}
            {isEmployer && co && (
              <>
                <Section title="Company Details" icon={HiOfficeBuilding}>
                  <InfoRow icon={HiOfficeBuilding}  label="Company"  value={co.name} />
                  <InfoRow icon={HiBriefcase}       label="Industry" value={co.industry} />
                  <InfoRow icon={HiUsers}           label="Size"     value={co.size} />
                  <InfoRow icon={HiLocationMarker}  label="Address"  value={`${co.address}, ${co.city}, ${co.state}`} />
                  <InfoRow icon={HiPhone}           label="Phone"    value={co.phone} />
                  <InfoRow icon={HiMail}            label="Email"    value={co.email} />
                  {co.website && <InfoRow icon={HiGlobe} label="Website" value={co.website} href={co.website} />}
                  <InfoRow icon={HiIdentification}  label="PAN No."  value={co.pan_number} />
                  <InfoRow icon={HiDocumentText}    label="CIN"      value={co.cin_number} />
                  {co.gst_number && <InfoRow icon={HiDocumentText} label="GST" value={co.gst_number} />}
                </Section>

                {/* Documents */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company Documents</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'PAN Card',         url: co.pan_doc_url, icon: HiDocumentText },
                      { label: 'Reg. Certificate', url: co.cin_doc_url, icon: HiIdentification },
                    ].map((doc) => (
                      <div key={doc.label}
                        className={`flex items-center gap-2 rounded-xl px-3 py-3 border ${
                          doc.url ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <doc.icon className={`w-5 h-5 ${doc.url ? 'text-blue-500' : 'text-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-400">{doc.label}</p>
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                              <HiEye className="w-3 h-3" /> View Document
                            </a>
                          ) : (
                            <p className="text-xs font-semibold text-slate-400">Not uploaded</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authorized persons */}
                {persons.length > 0 && (
                  <Section title={`Authorized Persons (${persons.length})`} icon={HiUsers}>
                    {persons.map((p: any, i: number) => (
                      <div key={p.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-sm font-extrabold text-violet-700">
                          {p.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.designation} · {p.department}</p>
                        </div>
                        <span className="text-xs text-slate-400">{p.mobile}</span>
                      </div>
                    ))}
                  </Section>
                )}
              </>
            )}

            {/* Jobseeker: skills */}
            {!isEmployer && skills.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Jobseeker: work experience */}
            {!isEmployer && workExp.length > 0 && (
              <Section title={`Work Experience (${workExp.length})`} icon={HiBriefcase}>
                {workExp.map((w: any, i: number) => (
                  <div key={w.id ?? i} className={`px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    <p className="text-sm font-bold text-slate-900">{w.title}</p>
                    <p className="text-xs text-violet-600 font-semibold">{w.company}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {w.start_date} – {w.end_date ?? 'Present'}
                      {w.location ? ` · ${w.location}` : ''}
                    </p>
                  </div>
                ))}
              </Section>
            )}

            {/* Jobseeker: education */}
            {!isEmployer && education.length > 0 && (
              <Section title={`Education (${education.length})`} icon={HiBriefcase}>
                {education.map((e: any, i: number) => (
                  <div key={e.id ?? i} className={`px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    <p className="text-sm font-bold text-slate-900">{e.degree}</p>
                    <p className="text-xs text-slate-500">{e.institution}</p>
                    <p className="text-xs text-slate-400">{e.year}</p>
                  </div>
                ))}
              </Section>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl flex items-center gap-2">
                <HiExclamationCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Reject input */}
            {showRejectInput && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rejection Reason (optional)
                </label>
                <textarea
                  className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-400 resize-none"
                  rows={3}
                  placeholder="Reason for rejection…"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowRejectInput(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button onClick={() => action({ verify_status: 'rejected', rejection_note: rejectNote || undefined })}
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 disabled:opacity-60 transition">
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            {!showRejectInput && (
              <div className="space-y-2.5 sticky bottom-0 bg-white pt-3 pb-1 border-t border-slate-100 -mx-5 px-5">
                {status === 'pending' && (
                  <button disabled={updating}
                    onClick={() => action({ verify_status: 'approved' })}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-bold py-3 rounded-2xl text-sm transition">
                    {updating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiCheckCircle className="w-4 h-4" />}
                    Approve
                  </button>
                )}
                <div className="flex gap-2.5">
                  <button disabled={updating}
                    onClick={() => action({ is_active: !isActive })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold border transition ${
                      isActive
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                    }`}>
                    <HiBan className="w-4 h-4" />
                    {isActive ? 'Suspend' : 'Activate'}
                  </button>
                  {status === 'pending' && (
                    <button disabled={updating}
                      onClick={() => setShowRejectInput(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-sm font-bold bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition">
                      <HiX className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [tab, query]);

  useEffect(() => { load(); }, [load]);

  const pendingCount = users.filter((u) => u.role !== 'admin' && u.verify_status === 'pending').length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-xl">
            {users.filter((u) => u.role !== 'admin').length} total
          </span>
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
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, company…"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-300 transition" />
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
      ) : users.filter((u) => u.role !== 'admin').length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiUsers className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No users found</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {users.filter((u) => u.role !== 'admin').map((u) => {
            const isEmployer = u.role === 'employer';
            const status     = u.verify_status ?? 'pending';

            const roleLabel  = isEmployer ? 'Employer' : 'Job Seeker';
            const rolePill   = isEmployer
              ? 'bg-blue-100 text-blue-700'
              : 'bg-sky-100 text-sky-700';
            const avatarCls  = isEmployer
              ? 'bg-blue-50 text-blue-600'
              : 'bg-emerald-50 text-emerald-600';

            return (
              <div key={u.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-extrabold flex-shrink-0 ${avatarCls}`}>
                  {(u.full_name ?? '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-900 truncate">{u.full_name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{u.mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_PILL[status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {status}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rolePill}`}>
                    {roleLabel}
                  </span>
                </div>
                <button onClick={() => setSelectedId(u.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 text-slate-500 hover:text-blue-600 text-xs font-bold transition">
                  <HiEye className="w-3.5 h-3.5" /> Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      <UserDetailPanel userId={selectedId} onClose={() => setSelectedId(null)} onUpdate={load} />
    </div>
  );
}
