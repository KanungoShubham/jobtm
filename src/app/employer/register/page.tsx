'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiCheckCircle, HiUpload, HiExclamationCircle, HiArrowLeft, HiOfficeBuilding, HiDocumentText, HiFlag } from 'react-icons/hi';
import { authApi, uploadApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { Button, FormInput, FormSelect, PasswordInput, validatePassword } from '@/components/shared/FormField';
import { LocationSelect } from '@/components/shared/LocationSelect';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#7C3AED';
const STEPS = [
  { label: 'Company Info', desc: 'Tell us about your business', icon: HiOfficeBuilding },
  { label: 'Documents', desc: 'Verify & set up your login', icon: HiDocumentText },
  { label: 'Done', desc: 'Await admin approval', icon: HiFlag },
];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const INDUSTRIES = [
  'Information Technology', 'Manufacturing', 'Healthcare', 'Finance & Banking',
  'Retail & FMCG', 'Education', 'Construction', 'Logistics', 'Media & Entertainment', 'Other',
];

export default function EmployerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [fullName, setFullName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panDocUrl, setPanDocUrl] = useState('');
  const [cinDocUrl, setCinDocUrl] = useState('');
  const [panFileName, setPanFileName] = useState('');
  const [cinFileName, setCinFileName] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingCin, setUploadingCin] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!companyName.trim()) e.companyName = 'Company name is required';
      if (!industry) e.industry = 'Select an industry';
      if (!companySize) e.companySize = 'Select company size';
      if (!address.trim()) e.address = 'Address is required';
      if (!stateVal) e.state = 'Select a state';
      if (!city) e.city = 'Select a city';
      if (!pincode.match(/^\d{6}$/)) e.pincode = 'Valid 6-digit pincode required';
      if (!compPhone.replace(/\D/g, '').match(/^\d{10}$/)) e.phone = 'Valid 10-digit phone required';
      if (!compEmail.includes('@')) e.email = 'Valid email required';
    }
    if (step === 1) {
      if (!fullName.trim()) e.fullName = 'Your name is required';
      if (!panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) e.panNumber = 'Valid PAN required (e.g. AAAAA9999A)';
      if (!panDocUrl) e.panUpload = 'Upload Company PAN card';
      if (!cinDocUrl) e.cinUpload = 'Upload Registration Certificate';
      if (!adminMobile.replace(/\D/g, '').match(/^\d{10}$/)) e.adminMobile = 'Valid 10-digit mobile required';
      const pwdError = validatePassword(adminPassword);
      if (pwdError) e.adminPassword = pwdError;
      if (adminPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const upload = async (type: 'pan' | 'cin', file: File) => {
    const setUploading = type === 'pan' ? setUploadingPan : setUploadingCin;
    setUploading(true);
    try {
      const res = await uploadApi.companyDoc(file, type);
      if (type === 'pan') { setPanDocUrl(res.url); setPanFileName(file.name); }
      else { setCinDocUrl(res.url); setCinFileName(file.name); }
    } catch (err: any) {
      setErrors((p) => ({ ...p, [`${type}Upload`]: err.message ?? 'Upload failed' }));
    } finally { setUploading(false); }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step === 0) { setStep(1); return; }

    if (step === 1) {
      setLoading(true);
      setErrors({});
      try {
        const res = await authApi.registerEmployerWeb({
          full_name: fullName,
          mobile: `+91${adminMobile.replace(/\D/g, '')}`,
          password: adminPassword,
          company_name: companyName,
          industry,
          size: companySize,
          address,
          city,
          state: stateVal,
          pincode,
          phone: compPhone.replace(/\D/g, ''),
          email: compEmail,
          website: website || undefined,
          pan_number: panNumber,
          cin_number: cinNumber || undefined,
          gst_number: gstNumber || undefined,
          pan_doc_url: panDocUrl || undefined,
          cin_doc_url: cinDocUrl || undefined,
        });
        if (res.token) employerAuth.saveSession(res.token, { userId: res.userId, name: fullName, role: res.role });
        setStep(2);
      } catch (err: any) {
        setErrors({ form: err.message ?? 'Registration failed. Please try again.' });
      } finally { setLoading(false); }
    }
  };

  const UploadBox = ({ label, fileName, uploading, error, onFile }: {
    label: string; fileName: string; uploading: boolean; error?: string; onFile: (f: File) => void;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition ${
        fileName ? 'border-emerald-400 bg-emerald-50' : error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-violet-300'
      }`}>
        <HiUpload className={`w-5 h-5 flex-shrink-0 ${fileName ? 'text-emerald-500' : 'text-slate-400'}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${fileName ? 'text-emerald-700' : 'text-slate-500'}`}>
            {uploading ? 'Uploading…' : fileName || `Click to upload ${label}`}
          </p>
          <p className="text-xs text-slate-400">PDF, JPG or PNG · Max 5MB</p>
        </div>
        <input type="file" accept=".pdf,image/jpeg,image/png" className="hidden" disabled={uploading}
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </label>
      {error && !fileName && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/employer/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-6">
          <HiArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
          {/* Step rail */}
          <div className="lg:sticky lg:top-8 space-y-1">
            <h1 className="text-lg font-extrabold text-slate-900 mb-1">Register as Employer</h1>
            <p className="text-xs text-slate-400 mb-5">Get verified and start hiring in 24–48 hours.</p>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const state = i < step ? 'done' : i === step ? 'active' : 'upcoming';
              return (
                <div key={s.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition"
                      style={
                        state === 'done' ? { backgroundColor: '#10B981', color: '#fff' }
                        : state === 'active' ? { backgroundColor: COLOR, color: '#fff' }
                        : { backgroundColor: '#F1F5F9', color: '#94A3B8' }
                      }>
                      {state === 'done' ? <HiCheckCircle className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                    </div>
                    {i < STEPS.length - 1 && <div className="w-0.5 flex-1 min-h-[24px]" style={{ backgroundColor: i < step ? '#10B981' : '#E2E8F0' }} />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold" style={{ color: state === 'upcoming' ? '#94A3B8' : '#0F172A' }}>{s.label}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form panel */}
          <ScrollReveal key={step} animation="fade-up" duration={400}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-warm-lg p-6 sm:p-8">
              {step === 0 && (
                <div className="space-y-4">
                  <FormInput label="Company Name *" value={companyName} onChange={(e) => setCompanyName(e.target.value)} error={errors.companyName} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormSelect label="Industry *" value={industry} onChange={(e) => setIndustry(e.target.value)} error={errors.industry}>
                      <option value="">Select Industry</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </FormSelect>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company Size *</label>
                      <div className="flex flex-wrap gap-2">
                        {COMPANY_SIZES.map((s) => (
                          <button key={s} type="button" onClick={() => setCompanySize(s)}
                            className="px-3 py-2 rounded-full border-[1.5px] text-xs font-medium transition"
                            style={companySize === s ? { backgroundColor: COLOR, borderColor: COLOR, color: '#fff' } : { borderColor: '#E2E8F0', color: '#64748B' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                      {errors.companySize && <p className="text-xs text-red-500 mt-1">{errors.companySize}</p>}
                    </div>
                  </div>
                  <FormInput label="Registered Address *" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} />
                  <LocationSelect
                    state={stateVal} city={city}
                    onStateChange={setStateVal} onCityChange={setCity}
                    stateError={errors.state} cityError={errors.city}
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormInput label="Pincode *" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} maxLength={6} error={errors.pincode} />
                    <FormInput label="Phone *" value={compPhone} onChange={(e) => setCompPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} error={errors.phone} />
                    <FormInput label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <FormInput label="Company Email *" type="email" value={compEmail} onChange={(e) => setCompEmail(e.target.value)} error={errors.email} />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                    <HiExclamationCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">Documents are encrypted & secure. After admin verification (24–48 hrs), you can log in and add authorized persons to post jobs.</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormInput label="Your Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
                    <FormInput label="PAN Number *" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} maxLength={10} error={errors.panNumber} />
                    <FormInput label="CIN Number" value={cinNumber} onChange={(e) => setCinNumber(e.target.value.toUpperCase())} />
                  </div>
                  <FormInput label="GST Number (optional)" value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} maxLength={15} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <UploadBox label="Company PAN Card *" fileName={panFileName} uploading={uploadingPan} error={errors.panUpload} onFile={(f) => upload('pan', f)} />
                    <UploadBox label="Registration Certificate *" fileName={cinFileName} uploading={uploadingCin} error={errors.cinUpload} onFile={(f) => upload('cin', f)} />
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Your Login Credentials</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormInput label="Mobile Number *" value={adminMobile} onChange={(e) => setAdminMobile(e.target.value.replace(/\D/g, ''))} maxLength={10} error={errors.adminMobile} />
                      <PasswordInput label="Password *" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} error={errors.adminPassword} showStrength color={COLOR} />
                      <PasswordInput label="Confirm Password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} color={COLOR} />
                    </div>
                  </div>
                  {errors.form && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{errors.form}</p>}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                    <HiCheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">Registration Submitted!</h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    <span className="font-bold text-slate-900">{companyName}</span> has been submitted for admin verification within <span className="font-bold">24–48 hours</span>.
                  </p>
                  <div className="max-w-xs mx-auto pt-2">
                    <Button onClick={() => router.replace('/employer/login')} fullWidth color={COLOR}>Go to Login</Button>
                  </div>
                </div>
              )}

              {step < 2 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition px-2"
                  >
                    <HiArrowLeft className="w-3.5 h-3.5" /> {step > 0 ? 'Previous' : 'Cancel'}
                  </button>
                  <Button onClick={handleNext} loading={loading} color={COLOR} className="shadow-warm hover-lift px-8">
                    {step === 1 ? 'Submit Registration' : 'Continue'}
                  </Button>
                </div>
              )}

              {step < 2 && (
                <p className="text-center text-slate-400 text-sm mt-5">
                  Already have an account? <Link href="/employer/login" className="font-bold" style={{ color: COLOR }}>Sign In</Link>
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
