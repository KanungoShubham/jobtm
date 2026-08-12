'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiArrowLeft, HiPlusCircle, HiXCircle, HiUpload, HiInformationCircle,
  HiCheckCircle, HiGift, HiCash, HiLockClosed,
} from 'react-icons/hi';
import { activitiesApi, uploadApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormTextarea } from '@/components/shared/FormField';
import { LocationSelect } from '@/components/shared/LocationSelect';

const COLOR = '#0EA5E9';

const CATEGORIES = [
  { label: 'Dance', value: 'dance' }, { label: 'Coaching', value: 'coaching' },
  { label: 'Yoga', value: 'yoga' }, { label: 'Music', value: 'music' },
  { label: 'Sports', value: 'sports' }, { label: 'Arts', value: 'arts' },
  { label: 'Language', value: 'language' }, { label: 'Fitness', value: 'fitness' },
  { label: 'Academic', value: 'academic' }, { label: 'Other', value: 'other' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface BatchForm {
  name: string;
  days: string[];
  time_start: string;
  time_end: string;
  max_students: string;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}
function in3MonthsISO() {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toISOString().split('T')[0];
}

export default function CreateActivityPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('coaching');
  const [description, setDescription] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(in3MonthsISO());

  const [batches, setBatches] = useState<BatchForm[]>([
    { name: 'Batch 1', days: [], time_start: '09:00', time_end: '10:00', max_students: '10' },
  ]);

  const [aadharUrl, setAadharUrl] = useState('');
  const [aadharName, setAadharName] = useState('');
  const [activityImgUrl, setActivityImgUrl] = useState('');
  const [activityImgName, setActivityImgName] = useState('');
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateBatch = (idx: number, field: keyof BatchForm, value: string | string[]) =>
    setBatches((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)));

  const toggleBatchDay = (idx: number, day: string) =>
    setBatches((prev) => prev.map((b, i) => (i === idx ? { ...b, days: b.days.includes(day) ? b.days.filter((d) => d !== day) : [...b.days, day] } : b)));

  const addBatch = () => setBatches((prev) => [...prev, { name: `Batch ${prev.length + 1}`, days: [], time_start: '09:00', time_end: '10:00', max_students: '10' }]);
  const removeBatch = (idx: number) => setBatches((prev) => prev.filter((_, i) => i !== idx));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s) && skills.length < 10) { setSkills([...skills, s]); setSkillInput(''); }
  };

  const uploadFile = async (
    file: File,
    fn: (token: string, file: File) => Promise<{ url: string }>,
    setUrl: (url: string) => void, setName: (n: string) => void, setBusy: (b: boolean) => void,
  ) => {
    const token = jobseekerAuth.getToken();
    if (!token) return;
    setBusy(true);
    try {
      const res = await fn(token, file);
      setUrl(res.url);
      setName(file.name);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed.');
    } finally { setBusy(false); }
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) return setError('Please enter an activity title.');
    if (!description.trim() || description.length < 20) return setError('Write at least 20 characters describing the activity.');
    if (!city) return setError('Please select a city.');
    if (!startDate) return setError('Please select a start date.');
    if (batches[0].days.length === 0) return setError('Select at least one day in Batch 1.');
    if (!isFree && !price) return setError('Enter a price or mark the activity as free.');
    if (!aadharUrl) return setError('Please upload your Aadhar card image for verification.');

    const token = jobseekerAuth.getToken();
    if (!token) return;

    setLoading(true);
    try {
      const { data: created } = await activitiesApi.create(token, {
        title: title.trim(),
        category,
        description: description.trim(),
        location: city ? `${city}, ${state}` : '',
        address: address.trim(),
        start_date: startDate,
        end_date: endDate || undefined,
        days: batches[0].days,
        time_start: batches[0].time_start,
        time_end: batches[0].time_end,
        skills,
        max_students: Number(batches[0].max_students) || 10,
        is_free: isFree,
        price: isFree ? 0 : Number(price) || 0,
        aadhar_image_url: aadharUrl,
        activity_image_url: activityImgUrl,
      });

      for (let i = 0; i < batches.length; i++) {
        const b = batches[i];
        await activitiesApi.createBatch(token, created.id, {
          name: b.name, days: b.days, time_start: b.time_start, time_end: b.time_end,
          max_students: Number(b.max_students) || 10, sort_order: i,
        }).catch(() => {});
      }

      router.replace('/jobseeker/activities/my');
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit. Please try again.');
    } finally { setLoading(false); }
  };

  const UploadBox = ({ url, name, uploading, label, onFile }: { url: string; name: string; uploading: boolean; label: string; onFile: (f: File) => void }) => (
    <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition ${url ? 'border-sky-400 bg-sky-50' : 'border-slate-300 bg-white hover:border-sky-300'}`}>
      <HiUpload className={`w-5 h-5 flex-shrink-0 ${url ? 'text-sky-500' : 'text-slate-400'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${url ? 'text-sky-700' : 'text-slate-500'}`}>
          {uploading ? 'Uploading…' : name || label}
        </p>
        <p className="text-xs text-slate-400">JPG or PNG · Max 5MB</p>
      </div>
      <input type="file" accept="image/jpeg,image/png" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </label>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <HiArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">Create Activity</h1>
          <p className="text-xs text-slate-400">List your coaching, classes or workshops</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Category */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Activity Type</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setCategory(c.value)}
                className="px-3.5 py-2 rounded-full border-[1.5px] text-sm font-medium transition"
                style={category === c.value ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {/* Basic info */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Basic Info</h2>
          <FormInput label="Activity Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Kathak Dance for Beginners" />
          <FormTextarea label={`Description * (${description.length} chars)`} value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what participants will learn, who it's for, and what to bring…" rows={5} />
        </section>

        {/* Location */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Location</h2>
          <LocationSelect state={state} city={city} onStateChange={setState} onCityChange={setCity} />
          <FormInput label="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building, street, landmark…" />
        </section>

        {/* Date range */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Activity Period</h2>
            <p className="text-xs text-slate-400 mt-0.5">Students can book sessions between these dates.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Start Date *" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <FormInput label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </section>

        {/* Batches */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Batches & Schedule</h2>
            <p className="text-xs text-slate-400 mt-0.5">Create different batches for morning, evening or weekend slots.</p>
          </div>
          {batches.map((batch, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>{idx + 1}</span>
                <input value={batch.name} onChange={(e) => updateBatch(idx, 'name', e.target.value)}
                  className="flex-1 text-sm font-bold text-slate-900 outline-none" placeholder="Batch name" />
                {batches.length > 1 && (
                  <button onClick={() => removeBatch(idx)}><HiXCircle className="w-5 h-5 text-red-400" /></button>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-1.5">Days *</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const active = batch.days.includes(d);
                    return (
                      <button key={d} onClick={() => toggleBatchDay(idx, d)}
                        className="w-11 h-11 rounded-xl flex items-center justify-center border-[1.5px] text-xs font-bold transition"
                        style={active ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <FormInput label="Start" type="time" value={batch.time_start} onChange={(e) => updateBatch(idx, 'time_start', e.target.value)} />
                <FormInput label="End" type="time" value={batch.time_end} onChange={(e) => updateBatch(idx, 'time_end', e.target.value)} />
                <FormInput label="Max" type="number" value={batch.max_students} onChange={(e) => updateBatch(idx, 'max_students', e.target.value)} />
              </div>
            </div>
          ))}
          <button onClick={addBatch} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed text-sm font-bold transition hover:bg-sky-50/50"
            style={{ borderColor: `${COLOR}80`, color: COLOR }}>
            <HiPlusCircle className="w-4 h-4" /> Add Another Batch
          </button>
        </section>

        {/* Skills */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Skills Taught ({skills.length}/10)</h2>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-slate-200 rounded-xl pl-3.5 pr-1.5 py-1.5">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className="flex-1 text-sm outline-none py-1.5" placeholder="e.g. Footwork, Rhythm, Flexibility" />
            <button onClick={addSkill} className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: COLOR }}>
              <HiPlusCircle className="w-4 h-4" />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#E0F2FE', color: COLOR }}>
                  {s}
                  <button onClick={() => setSkills(skills.filter((x) => x !== s))}><HiXCircle className="w-3.5 h-3.5" /></button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Pricing */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Pricing</h2>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Free', value: true, icon: HiGift }, { label: 'Paid', value: false, icon: HiCash }].map((opt) => {
              const Icon = opt.icon;
              const active = isFree === opt.value;
              return (
                <button key={opt.label} onClick={() => setIsFree(opt.value)}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border-[1.5px] text-sm font-bold transition"
                  style={active ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                  <Icon className="w-4 h-4" /> {opt.label}
                </button>
              );
            })}
          </div>
          {!isFree ? (
            <>
              <FormInput label="Price per Session (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 500" />
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 space-y-1">
                <p className="flex items-center gap-2 text-sm font-bold text-amber-800"><HiInformationCircle className="w-4 h-4" />Platform Fee: 15%</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  When a student pays ₹{price || '0'}, you receive <strong>₹{price ? Math.round(Number(price) * 0.85) : 0}</strong> (85%) after the session.
                </p>
              </div>
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3">
              <HiCheckCircle className="w-4 h-4 flex-shrink-0" /> Free activity — no payment required. Students can join at no cost.
            </p>
          )}
        </section>

        {/* Verification */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Identity Verification</h2>
            <p className="text-xs text-slate-400 mt-0.5">Required to activate your listing. Documents are reviewed by admin.</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Aadhar Card (Front) *</p>
            <UploadBox url={aadharUrl} name={aadharName} uploading={uploadingAadhar} label="Upload Aadhar Card Image"
              onFile={(f) => uploadFile(f, uploadApi.aadhar, setAadharUrl, setAadharName, setUploadingAadhar)} />
            {!aadharUrl && <p className="flex items-center gap-1.5 text-xs text-slate-400"><HiLockClosed className="w-3 h-3" />Stored securely · visible only to admin</p>}
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700">Activity / Profile Photo</p>
            <UploadBox url={activityImgUrl} name={activityImgName} uploading={uploadingImg} label="Upload Activity or Profile Photo"
              onFile={(f) => uploadFile(f, uploadApi.activityImage, setActivityImgUrl, setActivityImgName, setUploadingImg)} />
          </div>
        </section>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

        <Button onClick={handleSubmit} loading={loading} fullWidth color={COLOR}>Submit for Verification</Button>

        <p className="text-center text-sm text-slate-400">
          <Link href="/jobseeker/activities/my" className="font-semibold" style={{ color: COLOR }}>View my activities</Link>
        </p>
      </div>
    </div>
  );
}
