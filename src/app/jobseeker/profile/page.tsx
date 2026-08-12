'use client';
import { useEffect, useState } from 'react';
import {
  HiPlusCircle, HiTrash, HiCheckCircle, HiShieldCheck, HiDocumentText, HiExternalLink, HiMail, HiPhone, HiLocationMarker,
} from 'react-icons/hi';
import { profileApi, uploadApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormSelect } from '@/components/shared/FormField';
import { LocationSelect } from '@/components/shared/LocationSelect';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

function Card({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-warm hover:border-sky-100 transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-800">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 text-xs font-bold hover:gap-1.5 transition-all" style={{ color: COLOR }}>
            <HiPlusCircle className="w-4 h-4" /> Add
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function JobseekerProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [skillsInput, setSkillsInput] = useState('');
  const [resumeUploading, setResumeUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setLoading(true);
    profileApi.get(token).then((r) => { setData(r.data); setSkillsInput((r.data?.skills ?? []).join(', ')); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const saveSkills = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    await profileApi.updateSkills(token, skills);
    setMsg('Skills saved.');
    load();
  };

  const uploadResume = async (file: File) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setResumeUploading(true);
    try {
      await uploadApi.resume(token, file);
      load();
    } catch (err: any) {
      setMsg(err.message ?? 'Resume upload failed.');
    } finally { setResumeUploading(false); }
  };

  const deleteResource = async (kind: 'work' | 'edu' | 'project' | 'cert' | 'lang', id: string) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    const fn = { work: profileApi.deleteWork, edu: profileApi.deleteEdu, project: profileApi.deleteProject, cert: profileApi.deleteCert, lang: profileApi.deleteLang }[kind];
    await fn(token, id);
    load();
  };

  if (loading) return <div className="p-6 text-slate-400 text-sm">Loading…</div>;

  const profile     = data?.profile ?? {};
  const skills      = data?.skills ?? [];
  const experiences = data?.work ?? [];
  const education   = data?.education ?? [];
  const projects    = data?.projects ?? [];
  const certs       = data?.certs ?? [];
  const langs       = data?.languages ?? [];
  const prefs       = data?.prefs ?? {};
  const personal    = data?.personal ?? {};
  const resume      = (data?.resumes ?? [])[0] ?? null;

  const profileScore = Math.min(100,
    15 + (resume ? 20 : 0) + (experiences.length > 0 ? 15 : 0) +
    (education.length > 0 ? 10 : 0) + (skills.length > 3 ? 10 : 0) +
    (projects.length > 0 ? 10 : 0) + (certs.length > 0 ? 10 : 0) +
    (prefs?.preferred_locations?.length > 0 ? 5 : 0) + 5,
  );
  const scoreColor = profileScore >= 80 ? '#10B981' : profileScore >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {msg && <p className="text-sm text-slate-600 mb-4">{msg}</p>}

      {/* Two-column web layout: sticky summary rail + main content */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left rail — sticky profile summary */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <ScrollReveal animation="fade-right">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-warm-lg overflow-hidden">
              <div className="h-20" style={{ backgroundColor: COLOR }} />
              <div className="px-5 pb-5 -mt-8">
                <div className="flex items-end justify-between mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-warm flex items-center justify-center text-xl font-black text-slate-300">
                    {(profile.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full mt-6" style={{ backgroundColor: `${scoreColor}22`, border: `2px solid ${scoreColor}55` }}>
                    <span className="text-sm font-black" style={{ color: scoreColor }}>{profileScore}</span>
                    <span className="text-[7px] font-bold" style={{ color: scoreColor }}>SCORE</span>
                  </div>
                </div>
                <h1 className="text-lg font-extrabold text-slate-900">{profile.full_name || '—'}</h1>
                <p className="text-xs text-slate-500 mb-3">{profile.headline || 'Job Seeker'}</p>

                <div className="space-y-1.5 mb-3">
                  {profile.location && <p className="flex items-center gap-2 text-xs text-slate-400"><HiLocationMarker className="w-3.5 h-3.5 flex-shrink-0" />{profile.location}</p>}
                  {profile.email && <p className="flex items-center gap-2 text-xs text-slate-400 truncate"><HiMail className="w-3.5 h-3.5 flex-shrink-0" />{profile.email}</p>}
                  {profile.mobile && <p className="flex items-center gap-2 text-xs text-slate-400"><HiPhone className="w-3.5 h-3.5 flex-shrink-0" />{profile.mobile}</p>}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.mobile && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
                      <HiCheckCircle className="w-3 h-3" /> Mobile Verified
                    </span>
                  )}
                  {profile.aadhar_verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
                      <HiShieldCheck className="w-3 h-3" /> Aadhar Verified
                    </span>
                  )}
                </div>

                {profileScore < 80 && (
                  <div className="rounded-xl p-3" style={{ backgroundColor: `${scoreColor}0D`, border: `1px solid ${scoreColor}30` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">Completeness</span>
                      <span className="text-xs font-extrabold" style={{ color: scoreColor }}>{profileScore}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${profileScore}%`, backgroundColor: scoreColor }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-right" delay={60}>
            <Card title="Resume">
              {resume ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <HiDocumentText className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{resume.file_name ?? 'Resume.pdf'}</p>
                    <p className="text-[10px] text-slate-400">{resume.format ?? 'PDF'}{resume.uploaded_at ? ` · ${new Date(resume.uploaded_at).toLocaleDateString('en-IN')}` : ''}</p>
                  </div>
                  {resume.file_url && (
                    <a href={resume.file_url} target="_blank" rel="noreferrer" className="flex-shrink-0" style={{ color: COLOR }}>
                      <HiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 mb-2">No resume uploaded yet.</p>
              )}
              <label className="inline-block mt-3 w-full">
                <span className="block text-center text-xs font-bold px-3 py-2 rounded-xl border cursor-pointer transition hover:bg-sky-50" style={{ borderColor: COLOR, color: COLOR }}>
                  {resumeUploading ? 'Uploading…' : resume ? 'Replace Resume' : 'Upload Resume'}
                </span>
                <input type="file" accept=".pdf" className="hidden" disabled={resumeUploading}
                  onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])} />
              </label>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="fade-right" delay={100}>
            <Card title="Skills">
              <FormInput value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, Node.js, SQL" />
              <div className="mt-3"><Button onClick={saveSkills} color={COLOR} fullWidth>Save Skills</Button></div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skills.map((s: string) => (
                    <span key={s} className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>{s}</span>
                  ))}
                </div>
              )}
            </Card>
          </ScrollReveal>
        </div>

        {/* Main column */}
        <div className="space-y-4 min-w-0">
          <div className="grid md:grid-cols-2 gap-4">
            <ListCard title="Work Experience" items={experiences} kind="work"
              render={(w) => <><p className="font-semibold text-sm text-slate-800">{w.title} · {w.company}</p><p className="text-xs text-slate-400">{w.start_date} – {w.end_date ?? 'Present'}</p></>}
              onDelete={(id) => deleteResource('work', id)} onReload={load} />

            <ListCard title="Education" items={education} kind="edu"
              render={(e) => <><p className="font-semibold text-sm text-slate-800">{e.degree} · {e.institution}</p><p className="text-xs text-slate-400">{e.start_year} – {e.end_year ?? 'Present'}</p></>}
              onDelete={(id) => deleteResource('edu', id)} onReload={load} />

            <ListCard title="Projects" items={projects} kind="project"
              render={(p) => <><p className="font-semibold text-sm text-slate-800">{p.title}</p><p className="text-xs text-slate-400">{p.description}</p></>}
              onDelete={(id) => deleteResource('project', id)} onReload={load} />

            <ListCard title="Certifications" items={certs} kind="cert"
              render={(c) => <><p className="font-semibold text-sm text-slate-800">{c.title ?? c.name}</p><p className="text-xs text-slate-400">{c.issuer}</p></>}
              onDelete={(id) => deleteResource('cert', id)} onReload={load} />
          </div>

          <ListCard title="Languages" items={langs} kind="lang"
            render={(l) => <p className="font-semibold text-sm text-slate-800">{l.name} — {l.proficiency}</p>}
            onDelete={(id) => deleteResource('lang', id)} onReload={load} grid />

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <PreferredLocationsSection prefs={prefs} onReload={load} />
            <PreferencesSection prefs={prefs} onReload={load} />
          </div>

          <PersonalDetailsSection personal={personal} onReload={load} />
        </div>
      </div>
    </div>
  );
}

function ListCard({ title, items, kind, render, onDelete, onReload, grid }: {
  title: string; items: any[]; kind: 'work' | 'edu' | 'project' | 'cert' | 'lang';
  render: (item: any) => React.ReactNode; onDelete: (id: string) => void; onReload: () => void; grid?: boolean;
}) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <ScrollReveal animation="fade-up">
      <Card title={title} onAdd={() => setShowAdd(true)}>
        {items.length === 0 ? <p className="text-xs text-slate-400">None added yet.</p> : (
          <div className={grid ? 'grid sm:grid-cols-2 gap-3' : 'space-y-3'}>
            {items.map((item) => (
              <div key={item.id} className={grid ? 'flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2.5' : 'flex items-start justify-between gap-3 border-b border-slate-50 last:border-0 pb-3 last:pb-0'}>
                <div>{render(item)}</div>
                <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 flex-shrink-0 hover:bg-red-50 transition"><HiTrash className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        {showAdd && <AddItemModal kind={kind} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); onReload(); }} />}
      </Card>
    </ScrollReveal>
  );
}

function AddItemModal({ kind, onClose, onSaved }: { kind: 'work' | 'edu' | 'project' | 'cert' | 'lang'; onClose: () => void; onSaved: () => void }) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }));

  const configs: Record<string, { key: string; label: string }[]> = {
    work: [{ key: 'title', label: 'Job Title' }, { key: 'company', label: 'Company' }, { key: 'start_date', label: 'Start Date' }, { key: 'end_date', label: 'End Date' }],
    edu: [{ key: 'degree', label: 'Degree' }, { key: 'institution', label: 'Institution' }, { key: 'start_year', label: 'Start Year' }, { key: 'end_year', label: 'End Year' }],
    project: [{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description' }, { key: 'link', label: 'Link' }],
    cert: [{ key: 'title', label: 'Title' }, { key: 'issuer', label: 'Issuer' }, { key: 'date', label: 'Date' }],
    lang: [{ key: 'name', label: 'Language' }, { key: 'proficiency', label: 'Proficiency (basic/fluent/native)' }],
  };

  const save = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setSaving(true);
    try {
      const fn = { work: profileApi.addWork, edu: profileApi.addEdu, project: profileApi.addProject, cert: profileApi.addCert, lang: profileApi.addLang }[kind];
      await fn(token, fields);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold text-slate-800">Add {kind}</h2>
        {configs[kind].map((f) => (
          <FormInput key={f.key} label={f.label} value={fields[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
        ))}
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500">Cancel</button>
          <Button onClick={save} loading={saving} color={COLOR} className="flex-1">Save</Button>
        </div>
      </div>
    </div>
  );
}

function PreferredLocationsSection({ prefs, onReload }: { prefs: any; onReload: () => void }) {
  const [locations, setLocations] = useState<string[]>(prefs?.preferred_locations ?? []);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setLocations(prefs?.preferred_locations ?? []); }, [prefs]);

  const addLocation = () => {
    if (!city) return;
    const label = `${city}, ${state}`;
    if (!locations.includes(label)) setLocations([...locations, label]);
    setCity('');
  };

  const save = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setSaving(true);
    try {
      await profileApi.updatePrefs(token, { preferred_locations: locations });
      onReload();
    } finally { setSaving(false); }
  };

  return (
    <ScrollReveal animation="fade-up">
      <Card title="Preferred Job Locations">
        <div className="flex flex-wrap gap-2 mb-3">
          {locations.map((loc) => (
            <span key={loc} className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>
              {loc}
              <button onClick={() => setLocations(locations.filter((l) => l !== loc))} className="hover:opacity-60">×</button>
            </span>
          ))}
          {locations.length === 0 && <p className="text-xs text-slate-400">None added yet.</p>}
        </div>
        <LocationSelect state={state} city={city} onStateChange={setState} onCityChange={setCity} />
        <div className="flex gap-2 mt-3">
          <Button onClick={addLocation} variant="outline" color={COLOR}>Add</Button>
          <Button onClick={save} loading={saving} color={COLOR}>Save</Button>
        </div>
      </Card>
    </ScrollReveal>
  );
}

function PreferencesSection({ prefs, onReload }: { prefs: any; onReload: () => void }) {
  const [jobType, setJobType] = useState(prefs?.job_types?.[0] ?? '');
  const [expectedSalary, setExpectedSalary] = useState(prefs?.expected_salary ?? '');
  const [noticePeriod, setNoticePeriod] = useState(prefs?.notice_period ?? '');
  const [openToRelocate, setOpenToRelocate] = useState(!!prefs?.open_to_relocate);
  const [openToRemote, setOpenToRemote] = useState(!!prefs?.open_to_remote);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setJobType(prefs?.job_types?.[0] ?? '');
    setExpectedSalary(prefs?.expected_salary ?? '');
    setNoticePeriod(prefs?.notice_period ?? '');
    setOpenToRelocate(!!prefs?.open_to_relocate);
    setOpenToRemote(!!prefs?.open_to_remote);
  }, [prefs]);

  const save = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setSaving(true);
    try {
      await profileApi.updatePrefs(token, {
        job_types: jobType ? [jobType] : undefined,
        expected_salary: expectedSalary || undefined,
        notice_period: noticePeriod || undefined,
        open_to_relocate: openToRelocate,
        open_to_remote: openToRemote,
      });
      onReload();
    } finally { setSaving(false); }
  };

  return (
    <ScrollReveal animation="fade-up" delay={60}>
      <Card title="Job Preferences">
        <div className="space-y-3">
          <FormSelect label="Job Type" value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">Select</option>
            {['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'].map((t) => <option key={t} value={t}>{t}</option>)}
          </FormSelect>
          <FormInput label="Expected Salary" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
          <FormInput label="Notice Period" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} placeholder="30 days" />
        </div>
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={() => setOpenToRelocate((v) => !v)}
            className="px-3 py-1.5 rounded-full border-[1.5px] text-xs font-medium transition"
            style={openToRelocate ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
            Relocate
          </button>
          <button type="button" onClick={() => setOpenToRemote((v) => !v)}
            className="px-3 py-1.5 rounded-full border-[1.5px] text-xs font-medium transition"
            style={openToRemote ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
            Remote
          </button>
        </div>
        <div className="mt-3"><Button onClick={save} loading={saving} color={COLOR} fullWidth>Save Preferences</Button></div>
      </Card>
    </ScrollReveal>
  );
}

function PersonalDetailsSection({ personal, onReload }: { personal: any; onReload: () => void }) {
  const [dob, setDob] = useState(personal?.dob ?? '');
  const [gender, setGender] = useState(personal?.gender ?? '');
  const [maritalStatus, setMaritalStatus] = useState(personal?.marital_status ?? '');
  const [category, setCategory] = useState(personal?.category ?? '');
  const [currentSalary, setCurrentSalary] = useState(personal?.current_salary ?? '');
  const [nationality, setNationality] = useState(personal?.nationality ?? '');
  const [hometown, setHometown] = useState(personal?.hometown ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDob(personal?.dob ?? '');
    setGender(personal?.gender ?? '');
    setMaritalStatus(personal?.marital_status ?? '');
    setCategory(personal?.category ?? '');
    setCurrentSalary(personal?.current_salary ?? '');
    setNationality(personal?.nationality ?? '');
    setHometown(personal?.hometown ?? '');
  }, [personal]);

  const save = async () => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setSaving(true);
    try {
      await profileApi.updatePersonal(token, {
        dob: dob || undefined,
        gender: gender || undefined,
        marital_status: maritalStatus || undefined,
        category: category || undefined,
        current_salary: currentSalary || undefined,
        nationality: nationality || undefined,
        hometown: hometown || undefined,
      });
      onReload();
    } finally { setSaving(false); }
  };

  return (
    <ScrollReveal animation="fade-up" delay={100}>
      <Card title="Personal Details">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormInput label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <FormSelect label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select</option>
            {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((g) => <option key={g} value={g}>{g}</option>)}
          </FormSelect>
          <FormSelect label="Marital Status" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
            <option value="">Select</option>
            {['Single', 'Married', 'Divorced', 'Widowed'].map((m) => <option key={m} value={m}>{m}</option>)}
          </FormSelect>
          <FormInput label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <FormInput label="Current Salary" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} />
          <FormInput label="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          <FormInput label="Hometown" value={hometown} onChange={(e) => setHometown(e.target.value)} />
        </div>
        <div className="mt-3"><Button onClick={save} loading={saving} color={COLOR}>Save Personal Details</Button></div>
      </Card>
    </ScrollReveal>
  );
}
