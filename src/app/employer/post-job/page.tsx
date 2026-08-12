'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiBriefcase, HiUserGroup, HiCash, HiCalendar, HiPlus, HiX,
  HiChevronDown, HiChevronUp, HiCheckCircle, HiExclamation, HiLightningBolt,
  HiChatAlt2, HiShieldCheck, HiOfficeBuilding, HiWifi, HiShare,
} from 'react-icons/hi';
import { employerApi, subscriptionApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormTextarea, FormSelect } from '@/components/shared/FormField';
import { stateObject } from '@/lib/csclist';

const STATES = Object.keys(stateObject.India).sort();
function citiesFor(state: string): string[] {
  return state && (stateObject.India as Record<string, string[]>)[state]
    ? [...(stateObject.India as Record<string, string[]>)[state]].sort()
    : [];
}

const COLOR = '#7C3AED';
const TINT  = '#EDE9FE';

const JOB_TYPES   = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
const EXP_OPTIONS = ['Fresher', '0–1 yr', '1–2 yrs', '2–4 yrs', '4–6 yrs', '6+ yrs'];
const WORK_MODES: { label: 'Onsite' | 'Remote' | 'Hybrid'; icon: any }[] = [
  { label: 'Onsite', icon: HiOfficeBuilding },
  { label: 'Remote',  icon: HiWifi },
  { label: 'Hybrid',  icon: HiShare },
];
const SALARY_PERIODS = [
  { label: 'Per Day',      value: 'per_day'     },
  { label: 'Per Week',     value: 'per_week'    },
  { label: 'Per Month',    value: 'per_month'   },
  { label: 'Per 6 Months', value: 'per_6months' },
  { label: 'Per Year',     value: 'per_year'    },
];

interface Person { id: string; name: string; designation: string; department: string; }

function PillGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`px-3.5 py-2 rounded-full border-[1.5px] text-[13px] font-medium transition-colors ${
            value === o ? 'text-white' : 'bg-white text-slate-500 border-slate-200'
          }`}
          style={value === o ? { backgroundColor: COLOR, borderColor: COLOR } : undefined}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className="w-11 h-6 rounded-full p-0.5 flex-shrink-0 transition-colors"
      style={{ backgroundColor: value ? COLOR : '#CBD5E1' }}>
      <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function PostJobPage() {
  const router = useRouter();

  const [persons, setPersons]                 = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson]    = useState<Person | null>(null);
  const [showPersonPicker, setShowPersonPicker] = useState(false);

  const [title, setTitle]             = useState('');
  const [cityPickState, setCityPickState] = useState('');
  const [cityPickCity, setCityPickCity]   = useState('');
  const [jobCities, setJobCities]     = useState<string[]>([]);
  const [openings, setOpenings]       = useState('1');

  const location = jobCities[0] ?? '';

  const [salaryPeriod, setSalaryPeriod] = useState('per_month');
  const [salaryMin, setSalaryMin]       = useState('');
  const [salaryMax, setSalaryMax]       = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');

  const [jobType, setJobType]     = useState('Full Time');
  const [experience, setExperience] = useState('2–4 yrs');
  const [workMode, setWorkMode]   = useState<'Onsite' | 'Remote' | 'Hybrid'>('Onsite');
  const [isUrgent, setIsUrgent]   = useState(false);
  const [isHindi, setIsHindi]     = useState(false);

  const [lastApplyDate, setLastApplyDate] = useState('');

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills]         = useState<string[]>([]);

  const [description, setDescription] = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const [paywallPlans, setPaywallPlans] = useState<any[]>([]);
  const [showPaywall, setShowPaywall]   = useState(false);
  const [subscribing, setSubscribing]   = useState<string | null>(null);

  useEffect(() => {
    const token = employerAuth.getToken();
    if (!token) return;
    employerApi.getPersons(token).then((r) => {
      const list: Person[] = r.data ?? [];
      setPersons(list);
      if (list.length > 0) setSelectedPerson(list[0]);
    }).catch(() => {});
  }, []);

  const isPerDay = salaryPeriod === 'per_day';

  const salaryLabel = () => {
    const periodLabel = SALARY_PERIODS.find((p) => p.value === salaryPeriod)?.label ?? 'Per Month';
    if (isPerDay) return salaryAmount ? `₹${salaryAmount} ${periodLabel}` : 'As per CTC';
    if (salaryMin && salaryMax) return `₹${salaryMin}–₹${salaryMax} ${periodLabel}`;
    if (salaryMin) return `₹${salaryMin}+ ${periodLabel}`;
    return 'As per CTC';
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 10) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const addCity = () => {
    if (!cityPickCity) return;
    const c = cityPickState ? `${cityPickCity}, ${cityPickState}` : cityPickCity;
    if (!jobCities.includes(c)) {
      setJobCities([...jobCities, c]);
      setCityPickCity('');
    }
  };

  const insertIntoDescription = (text: string) => setDescription((prev) => prev + text);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = employerAuth.getToken();
    if (!token) return;

    if (!title.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in Job Title, at least one Job Location, and Description.');
      return;
    }
    if (description.trim().length < 30) {
      setError('Please write at least 30 characters in the job description.');
      return;
    }

    setLoading(true);
    try {
      await employerApi.createJob(token, {
        title: title.trim(),
        location: location.trim(),
        cities: jobCities,
        salary_min: isPerDay ? (salaryAmount ? Number(salaryAmount) : null) : (salaryMin ? Number(salaryMin) : null),
        salary_max: isPerDay ? null : (salaryMax ? Number(salaryMax) : null),
        salary_label: salaryLabel(),
        salary_period: salaryPeriod,
        type: jobType,
        experience,
        work_mode: workMode.toLowerCase(),
        is_remote: workMode === 'Remote',
        is_urgent: isUrgent,
        is_hindi: isHindi,
        skills,
        description: description.trim(),
        openings: Number(openings) || 1,
        last_apply_date: lastApplyDate || null,
        posted_by: selectedPerson?.id ?? null,
      });
      router.push('/employer/jobs');
    } catch (err: any) {
      if (err.httpStatus === 402 && err.error === 'subscription_required') {
        setPaywallPlans(err.plans ?? []);
        setShowPaywall(true);
      } else {
        setError(err.message ?? 'Failed to post job. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const subscribe = async (planType: string) => {
    const token = employerAuth.getToken();
    if (!token) return;
    setSubscribing(planType);
    try {
      const res = await subscriptionApi.createOrder(token, planType);
      if (res.payment_url) window.location.href = res.payment_url;
    } catch (err: any) {
      setError(err.message ?? 'Subscription failed.');
      setSubscribing(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pb-16">
      <h1 className="text-xl font-extrabold text-slate-900 mb-1">Post a Job</h1>
      <p className="text-sm text-slate-400 mb-6">Fill in the details to publish a new job listing</p>

      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: TINT }}>
                <HiBriefcase className="w-7 h-7" style={{ color: COLOR }} />
              </div>
              <p className="text-lg font-extrabold text-slate-900">Upgrade to Post More Jobs</p>
              <p className="text-sm text-slate-400 mt-1.5">You have used your free job postings. Subscribe to post unlimited jobs.</p>
            </div>
            {paywallPlans.map((plan: any) => {
              const isBusy = subscribing === plan.plan_type;
              const amtInr = (plan.amount / 100).toLocaleString('en-IN');
              return (
                <button key={plan.plan_type} type="button" disabled={!!subscribing} onClick={() => subscribe(plan.plan_type)}
                  className="w-full text-left mb-3 rounded-2xl border-2 p-4 transition-colors disabled:opacity-60"
                  style={{ borderColor: plan.badge ? COLOR : '#E2E8F0' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {plan.badge && (
                        <span className="inline-block text-white text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-lg mb-1" style={{ backgroundColor: COLOR }}>
                          {String(plan.badge).toUpperCase()}
                        </span>
                      )}
                      <p className="text-base font-extrabold text-slate-900">{plan.label}</p>
                      <p className="text-xs text-slate-400">{plan.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-extrabold" style={{ color: COLOR }}>₹{amtInr}</p>
                      <p className="text-[11px] text-slate-400">{plan.validity_label}</p>
                    </div>
                  </div>
                  {isBusy && (
                    <div className="mt-2 rounded-xl py-2 text-center text-white text-[13px] font-bold" style={{ backgroundColor: COLOR }}>
                      Activating…
                    </div>
                  )}
                </button>
              );
            })}
            <button type="button" onClick={() => setShowPaywall(false)} className="w-full py-3 text-center text-sm font-semibold text-slate-500">
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Posting As */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Posting As</p>
            <a href="/employer/persons" className="flex items-center gap-1 text-xs font-semibold" style={{ color: COLOR }}>
              <HiPlus className="w-3.5 h-3.5" /> Manage Team
            </a>
          </div>

          {persons.length === 0 ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
              <HiExclamation className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                No authorized persons added. Jobs will be posted under your company.{' '}
                <a href="/employer/persons" className="font-bold underline">Add one</a>
              </p>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setShowPersonPicker((v) => !v)}
                className={`w-full flex items-center gap-3 bg-white border-[1.5px] rounded-2xl px-4 py-3.5 transition-colors ${showPersonPicker ? '' : 'border-slate-200'}`}
                style={showPersonPicker ? { borderColor: COLOR } : undefined}>
                {selectedPerson ? (
                  <>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TINT }}>
                      <span className="text-base font-extrabold" style={{ color: COLOR }}>{selectedPerson.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{selectedPerson.name}</p>
                      <p className="text-xs" style={{ color: COLOR }}>{selectedPerson.designation}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <HiUserGroup className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="flex-1 text-left text-sm text-slate-400">Select authorized person</p>
                  </>
                )}
                {showPersonPicker ? <HiChevronUp className="w-4 h-4 text-slate-400" /> : <HiChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showPersonPicker && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  {persons.map((person) => (
                    <button key={person.id} type="button"
                      onClick={() => { setSelectedPerson(person); setShowPersonPicker(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors ${selectedPerson?.id === person.id ? '' : 'hover:bg-slate-50'}`}
                      style={selectedPerson?.id === person.id ? { backgroundColor: TINT } : undefined}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: TINT }}>
                        <span className="text-sm font-extrabold" style={{ color: COLOR }}>{person.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{person.name}</p>
                        <p className="text-xs text-slate-400">{person.designation} · {person.department}</p>
                      </div>
                      {selectedPerson?.id === person.id && <HiCheckCircle className="w-4.5 h-4.5 flex-shrink-0" style={{ color: COLOR }} />}
                    </button>
                  ))}
                </div>
              )}

              {selectedPerson && (
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: TINT }}>
                  <HiShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: COLOR }} />
                  <p className="text-xs font-medium" style={{ color: COLOR }}>
                    This job will be posted by <span className="font-bold">{selectedPerson.name}</span> · {selectedPerson.designation}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Basic Details */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Basic Details</p>
          <FormInput label="Job Title *" icon={<HiBriefcase className="w-4 h-4" />} color={COLOR}
            placeholder="e.g. Senior React Native Developer" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Job Location(s) * <span className="font-normal text-slate-400">(add one or more cities, across any states)</span></label>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <FormSelect value={cityPickState} onChange={(e) => { setCityPickState(e.target.value); setCityPickCity(''); }}>
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </FormSelect>
              <FormSelect value={cityPickCity} disabled={!cityPickState} onChange={(e) => setCityPickCity(e.target.value)}>
                <option value="">{cityPickState ? 'Select City' : 'Select state first'}</option>
                {citiesFor(cityPickState).map((c) => <option key={c} value={c}>{c}</option>)}
              </FormSelect>
            </div>
            <button type="button" onClick={addCity} disabled={!cityPickCity}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: COLOR }}>
              <HiPlus className="w-3.5 h-3.5" /> Add City
            </button>
            {jobCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {jobCities.map((c) => (
                  <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: TINT, color: COLOR }}>
                    {c}
                    <button type="button" onClick={() => setJobCities(jobCities.filter((x) => x !== c))}><HiX className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <FormInput label="Openings" type="number" min={1} icon={<HiUserGroup className="w-4 h-4" />} color={COLOR}
            value={openings} onChange={(e) => setOpenings(e.target.value)} />
        </div>

        {/* Salary */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Salary</p>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Salary Period</p>
            <div className="flex flex-wrap gap-2">
              {SALARY_PERIODS.map((p) => (
                <button key={p.value} type="button" onClick={() => setSalaryPeriod(p.value)}
                  className="px-3.5 py-2 rounded-full border-[1.5px] text-[13px] font-medium transition-colors"
                  style={salaryPeriod === p.value ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { backgroundColor: '#fff', borderColor: '#E2E8F0', color: '#64748B' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {isPerDay ? (
            <FormInput label="Daily Rate (₹)" type="number" icon={<HiCash className="w-4 h-4" />} color={COLOR}
              placeholder="e.g. 800" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Min (₹)" type="number" icon={<HiCash className="w-4 h-4" />} color={COLOR}
                placeholder="15000" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              <FormInput label="Max (₹)" type="number" icon={<HiCash className="w-4 h-4" />} color={COLOR}
                placeholder="25000" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
            </div>
          )}
          {(isPerDay ? salaryAmount : (salaryMin || salaryMax)) ? (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: TINT }}>
              <HiCash className="w-3.5 h-3.5" style={{ color: COLOR }} />
              <p className="text-xs font-semibold" style={{ color: COLOR }}>{salaryLabel()}</p>
            </div>
          ) : null}
        </div>

        {/* Job Type */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Job Type</p>
          <PillGroup options={JOB_TYPES} value={jobType} onChange={setJobType} />
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Experience Required</p>
          <PillGroup options={EXP_OPTIONS} value={experience} onChange={setExperience} />
        </div>

        {/* Work Mode */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Work Mode</p>
          <div className="grid grid-cols-3 gap-2">
            {WORK_MODES.map(({ label, icon: Icon }) => {
              const active = workMode === label;
              return (
                <button key={label} type="button" onClick={() => setWorkMode(label)}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border-[1.5px] text-[13px] font-semibold transition-colors"
                  style={active ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { backgroundColor: '#fff', borderColor: '#E2E8F0', color: '#64748B' }}>
                  <Icon className="w-4 h-4" /> {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Options */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Special Options</p>
          {[
            { icon: HiLightningBolt, label: 'Urgent Hiring', sub: 'Mark as urgent requirement', value: isUrgent, toggle: () => setIsUrgent((v) => !v) },
            { icon: HiChatAlt2,      label: 'Hindi Speaking', sub: 'Hindi language preferred/required', value: isHindi, toggle: () => setIsHindi((v) => !v) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <item.icon className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.sub}</p>
                </div>
              </div>
              <Toggle value={item.value} onChange={item.toggle} />
            </div>
          ))}
        </div>

        {/* Last Date to Apply */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-900">Last Date to Apply</p>
          <FormInput type="date" icon={<HiCalendar className="w-4 h-4" />} color={COLOR}
            value={lastApplyDate} onChange={(e) => setLastApplyDate(e.target.value)} />
          {lastApplyDate ? (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: TINT }}>
              <HiCalendar className="w-3.5 h-3.5" style={{ color: COLOR }} />
              <p className="text-xs font-semibold" style={{ color: COLOR }}>Applications close on {lastApplyDate}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Leave empty for no deadline</p>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-900">Required Skills ({skills.length}/10)</p>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-slate-200 rounded-xl pl-3.5 pr-1.5 py-1.5">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press +" className="flex-1 text-sm text-slate-900 py-1.5 focus:outline-none" />
            <button type="button" onClick={addSkill} className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
              <HiPlus className="w-4 h-4" />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium" style={{ backgroundColor: TINT, color: COLOR }}>
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><HiX className="w-3.5 h-3.5" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Job Description *</p>
            <span className={`text-xs font-medium ${description.length < 30 ? 'text-amber-500' : 'text-slate-400'}`}>
              {description.length} chars {description.length < 30 ? '(min 30)' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              { label: 'Responsibilities', insert: '\n\nResponsibilities:\n• ' },
              { label: 'Requirements',      insert: '\n\nRequirements:\n• '    },
              { label: 'Benefits',          insert: '\n\nBenefits:\n• '        },
              { label: '• Bullet',          insert: '\n• '                     },
            ].map((b) => (
              <button key={b.label} type="button" onClick={() => insertIntoDescription(b.insert)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-500 transition-colors">
                {b.label}
              </button>
            ))}
          </div>
          <FormTextarea rows={8} placeholder="Describe the role, responsibilities, and requirements…"
            value={description} onChange={(e) => setDescription(e.target.value)} />
          <p className="text-xs text-slate-400 leading-relaxed">
            Tip: Use the quick-insert buttons above to structure your description with sections and bullet points.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{error}</p>}
        <Button type="submit" loading={loading} color={COLOR} fullWidth>Post Job</Button>
      </form>
    </div>
  );
}
