'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiSpeakerphone, HiShieldCheck, HiLightningBolt, HiUserGroup } from 'react-icons/hi';
import { authApi } from '@/lib/api';
import { advertiserAuth } from '@/lib/roleAuth';
import { Button, FormInput, PasswordInput, validatePassword } from '@/components/shared/FormField';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#F59E0B';

export default function AdvertiserRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [mobile, setMobile]         = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName]       = useState('');
  const [companyName, setCompanyName]         = useState('');
  const [companyAddress, setCompanyAddress]   = useState('');
  const [website, setWebsite]                 = useState('');
  const [regNumber, setRegNumber]             = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const digits = mobile.replace(/\D/g, '');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Your name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (digits.length !== 10) e.mobile = 'Enter a 10-digit mobile number';
    const pwdError = validatePassword(password);
    if (pwdError) e.password = pwdError;
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!businessName.trim()) e.businessName = 'Shop / business name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.registerAdvertiser({
        full_name: fullName.trim(),
        mobile: `+91${digits}`,
        password,
        email: email.trim(),
        business_name: businessName.trim(),
        company_name: companyName.trim() || undefined,
        company_address: companyAddress.trim() || undefined,
        website: website.trim() || undefined,
        business_reg_number: regNumber.trim() || undefined,
      });
      advertiserAuth.saveSession(res.token, { userId: res.userId, name: fullName, role: res.role });
      router.replace('/advertiser');
    } catch (err: any) {
      setErrors({ form: err.message ?? 'Registration failed. Try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-10 overflow-hidden bg-slate-50">
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-warm-lg bg-white border border-slate-100 animate-fade-in-scale">
        <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden" style={{ backgroundColor: COLOR }}>
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2.5 mb-10 w-fit hover:opacity-85 transition-opacity">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center overflow-hidden">
                <Image src="/assets/logo-white.png" alt="jobstm" width={32} height={32} className="rounded-lg" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">jobstm</span>
            </Link>
            <h2 className="text-3xl font-bold leading-tight mb-4">Run banner ads,<br />reach real users.</h2>
            <p className="text-white/75 text-sm max-w-xs">Set up your AD Center account and get your business in front of job seekers and employers.</p>
          </div>
          <div className="relative z-10 space-y-3 mt-10">
            {[
              { icon: HiShieldCheck, label: 'Admin-Reviewed Banners' },
              { icon: HiLightningBolt, label: 'Live in Minutes After Approval' },
              { icon: HiUserGroup, label: 'Reach Job Seekers & Employers' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-white/85">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-white overflow-y-auto max-h-screen">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-6">
            <HiArrowLeft className="w-3.5 h-3.5" /> Back to website
          </Link>
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-warm" style={{ backgroundColor: COLOR }}>
              <HiSpeakerphone className="w-7 h-7 text-white" />
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Register as Advertiser</span>
              <span className="text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest" style={{ backgroundColor: COLOR }}>
                AD CENTER
              </span>
            </div>
            <p className="text-slate-400 text-sm">Create your account. After admin approval you can run banner ads.</p>
          </div>

          <ScrollReveal animation="fade-up">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</p>
                <div className="space-y-4">
                  <FormInput label="Your Name *" color={COLOR} value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
                  <FormInput label="Email Address *" type="email" color={COLOR} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                      <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 transition"
                        style={{ ['--tw-ring-color' as any]: `${COLOR}55` }} />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                  <PasswordInput label="Password *" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} showStrength color={COLOR} />
                  <PasswordInput label="Confirm Password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} color={COLOR} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Business Details</p>
                <div className="space-y-4">
                  <FormInput label="Shop / Business Name *" color={COLOR} placeholder="e.g. Sharma Sports Academy" value={businessName} onChange={(e) => setBusinessName(e.target.value)} error={errors.businessName} />
                  <FormInput label="Company Name" color={COLOR} placeholder="Registered company (optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  <FormInput label="Company Address" color={COLOR} placeholder="Full address (optional)" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                  <FormInput label="Website" color={COLOR} placeholder="https://… (optional)" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  <FormInput label="Business Reg. Number" color={COLOR} placeholder="GST / Reg no. (optional)" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                </div>
              </div>

              {errors.form && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{errors.form}</p>}
              <Button onClick={submit} loading={loading} fullWidth color={COLOR} className="shadow-warm hover-lift">Create Advertiser Account</Button>
            </div>
          </ScrollReveal>

          <p className="text-center lg:text-left text-slate-400 text-sm mt-6">
            Already have an account? <Link href="/advertiser/login" className="font-bold" style={{ color: COLOR }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
