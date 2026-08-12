'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiCheckCircle, HiBriefcase, HiUserGroup, HiStar, HiChevronRight,
  HiLocationMarker, HiPhone, HiCalendar, HiLogout, HiPencil,
  HiCreditCard, HiDocumentText,
} from 'react-icons/hi';
import { employerApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormTextarea } from '@/components/shared/FormField';

const COLOR = '#7C3AED';
const TINT  = '#EDE9FE';

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CompanyProfilePage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = employerAuth.getToken();
    if (!token) return;
    Promise.all([
      employerApi.getCompany(token),
      employerApi.getStats(token).catch(() => null),
    ]).then(([companyRes, statsRes]) => {
      setCompany(companyRes.data);
      setForm(companyRes.data ?? {});
      setStats(statsRes?.data ?? null);
    }).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setSaving(true);
    setMsg('');
    try {
      const res = await employerApi.updateCompany(token, form);
      setCompany(res.data);
      setMsg('Saved successfully.');
    } catch (err: any) {
      setMsg(err.message ?? 'Failed to save.');
    } finally { setSaving(false); }
  };

  const logout = () => {
    employerAuth.clearSession();
    router.replace('/employer/login');
  };

  if (loading) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;

  const isVerified = company?.verify_status === 'approved' || company?.is_verified;

  const statCards = [
    { label: 'Jobs',       value: stats?.totalJobs ?? 0,         icon: HiBriefcase,   accent: '#7C3AED', tint: '#EDE9FE' },
    { label: 'Applicants', value: stats?.totalApplications ?? 0, icon: HiUserGroup,   accent: '#2563EB', tint: '#DBEAFE' },
    { label: 'Hired',      value: stats?.hired ?? 0,              icon: HiCheckCircle, accent: '#059669', tint: '#D1FAE5' },
    { label: 'Rating',     value: '–',                            icon: HiStar,        accent: '#D97706', tint: '#FEF3C7' },
  ];

  const settingsLinks = [
    { href: '/employer/persons', label: 'Authorized Persons', desc: 'Manage who can post jobs', icon: HiUserGroup, accent: COLOR,      tint: TINT      },
    { href: '/employer/profile', label: 'Verification Status', desc: company?.verify_status === 'rejected' ? 'Registration rejected' : isVerified ? 'Company is verified' : 'Pending admin approval', icon: HiCheckCircle, accent: '#059669', tint: '#D1FAE5', noNav: true },
    { href: '/employer/subscription',    label: 'Billing & Plan',    desc: 'View plan & upgrade',    icon: HiCreditCard,   accent: COLOR,     tint: TINT },
    { href: '/employer/billing-history', label: 'Billing History',   desc: 'Payments & invoices',     icon: HiDocumentText, accent: '#D97706', tint: '#FEF3C7' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Company Profile</h1>
          <p className="text-sm text-slate-400">Manage your company details</p>
        </div>
        <button onClick={() => setEditing((v) => !v)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ backgroundColor: editing ? COLOR : TINT, color: editing ? '#fff' : COLOR }}>
          <HiPencil className="w-4 h-4" />
        </button>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: TINT }}>
          <span className="text-2xl font-extrabold" style={{ color: COLOR }}>{(company?.name ?? 'C').charAt(0).toUpperCase()}</span>
        </div>
        <p className="font-extrabold text-slate-900">{company?.name || 'Your Company'}</p>
        <p className="text-sm text-slate-400">{company?.industry}</p>

        {company?.verify_status && (
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
            style={{
              backgroundColor: isVerified ? '#D1FAE5' : company.verify_status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
              color: isVerified ? '#059669' : company.verify_status === 'rejected' ? '#DC2626' : '#D97706',
            }}>
            <HiCheckCircle className="w-3.5 h-3.5" /> {isVerified ? 'Verified' : company.verify_status}
          </span>
        )}

        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 flex-wrap justify-center">
          {(company?.city || company?.state) && (
            <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" /> {[company?.city, company?.state].filter(Boolean).join(', ')}</span>
          )}
          {company?.size && <span className="flex items-center gap-1"><HiUserGroup className="w-3.5 h-3.5" /> {company.size} employees</span>}
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400 flex-wrap justify-center">
          {company?.phone && <span className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5" /> {company.phone}</span>}
          {company?.registered_at && <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> Joined {formatDate(company.registered_at)}</span>}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: s.tint }}>
              <s.icon className="w-4 h-4" style={{ color: s.accent }} />
            </div>
            <p className="font-extrabold text-slate-800">{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
        <p className="px-4 pt-3.5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Settings</p>
        {settingsLinks.map((s) =>
          s.noNav ? (
            <div key={s.label} className="flex items-center gap-3 px-4 py-3.5 border-t border-slate-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.tint }}>
                <s.icon className="w-4.5 h-4.5" style={{ color: s.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
          ) : (
            <Link key={s.href} href={s.href} className="flex items-center gap-3 px-4 py-3.5 border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.tint }}>
                <s.icon className="w-4.5 h-4.5" style={{ color: s.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
              <HiChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </Link>
          )
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 mb-4">
          <p className="text-sm font-bold text-slate-900">Edit Details</p>
          <FormInput label="Company Name" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          <FormInput label="Industry" value={form.industry ?? ''} onChange={(e) => set('industry', e.target.value)} />
          <FormInput label="Company Size" value={form.size ?? ''} onChange={(e) => set('size', e.target.value)} />
          <FormTextarea label="Address" value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} rows={2} />
          <div className="grid grid-cols-3 gap-3">
            <FormInput label="City" value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} />
            <FormInput label="State" value={form.state ?? ''} onChange={(e) => set('state', e.target.value)} />
            <FormInput label="Pincode" value={form.pincode ?? ''} onChange={(e) => set('pincode', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Phone" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
            <FormInput label="Email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </div>
          <FormInput label="Website" value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} />

          {msg && <p className="text-sm text-slate-600">{msg}</p>}
          <Button onClick={save} loading={saving} color={COLOR}>Save Changes</Button>
        </div>
      )}

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
        <HiLogout className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}
