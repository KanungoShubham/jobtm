'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiPlus, HiTrash, HiArrowLeft, HiUserGroup, HiUser, HiBriefcase, HiMail } from 'react-icons/hi';
import { employerApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormSelect } from '@/components/shared/FormField';

const COLOR = '#7C3AED';
const TINT  = '#EDE9FE';

const DEPARTMENTS = ['HR', 'Recruitment', 'Operations', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Admin', 'Management', 'Other'];

export default function PersonsPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    const token = employerAuth.getToken();
    if (!token) return;
    setLoading(true);
    employerApi.getPersons(token).then((r) => setPersons(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => { setName(''); setDesignation(''); setDepartment(''); setMobile(''); setEmail(''); setError(''); };

  const addPerson = async () => {
    const token = employerAuth.getToken();
    if (!token) return;
    if (!name.trim() || !designation.trim() || !department || !mobile.replace(/\D/g, '').match(/^\d{10}$/) || !email.trim()) {
      setError('Please fill in all required fields with a valid 10-digit mobile number.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await employerApi.addPerson(token, {
        name: name.trim(),
        designation: designation.trim(),
        department,
        mobile: `+91${mobile.replace(/\D/g, '')}`,
        email: email.trim(),
      });
      setShowAdd(false);
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message ?? 'Failed to add person.');
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    const token = employerAuth.getToken();
    if (!token || !confirm('Remove this person?')) return;
    await employerApi.deletePerson(token, id);
    load();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900">Authorized Persons</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: COLOR }}>
          <HiPlus className="w-4 h-4" /> Add
        </button>
      </div>
      <p className="text-sm text-slate-400 mb-6 ml-8">People who can post jobs on your behalf</p>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : persons.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: TINT }}>
            <HiUserGroup className="w-8 h-8" style={{ color: COLOR }} />
          </div>
          <p className="font-bold text-slate-500">No authorized persons yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {persons.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TINT }}>
                <span className="text-sm font-extrabold" style={{ color: COLOR }}>{(p.name ?? '?').charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-400 truncate">{p.designation} · {p.department}</p>
                <p className="text-xs text-slate-400 truncate">{p.mobile} · {p.email}</p>
              </div>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg border border-red-200 text-red-500 flex-shrink-0"><HiTrash className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => { setShowAdd(false); resetForm(); }}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-slate-900 text-lg">Add Authorized Person</h2>

            <FormInput label="Full Name *" icon={<HiUser className="w-4 h-4" />} color={COLOR}
              placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput label="Designation *" icon={<HiBriefcase className="w-4 h-4" />} color={COLOR}
              placeholder="e.g. HR Manager" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <FormSelect label="Department *" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </FormSelect>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mobile Number *</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 flex-shrink-0">+91</span>
                <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} maxLength={10}
                  placeholder="98765 43210" className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none" />
              </div>
            </div>
            <FormInput label="Email *" type="email" icon={<HiMail className="w-4 h-4" />} color={COLOR}
              placeholder="person@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button onClick={addPerson} loading={saving} color={COLOR} fullWidth>Add Person</Button>
          </div>
        </div>
      )}
    </div>
  );
}
