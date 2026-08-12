'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HiArrowLeft, HiShieldCheck, HiLightningBolt, HiBadgeCheck } from 'react-icons/hi';
import { authApi } from '@/lib/api';
import { jobseekerAuth } from '@/lib/roleAuth';
import { Button, FormInput, PasswordInput, validatePassword } from '@/components/shared/FormField';
import { LocationSelect } from '@/components/shared/LocationSelect';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const COLOR = '#0EA5E9';

export default function JobseekerRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const digits = mobile.replace(/\D/g, '');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (digits.length !== 10) e.mobile = 'Enter a 10-digit mobile number';
    const pwdError = validatePassword(password);
    if (pwdError) e.password = pwdError;
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.registerJobseekerWeb({
        full_name: fullName,
        mobile: `+91${digits}`,
        password,
        email,
        location: city ? `${city}, ${state}` : undefined,
      });
      jobseekerAuth.saveSession(res.token, { userId: res.userId, name: fullName, role: res.role });
      router.replace('/jobseeker/home');
    } catch (err: any) {
      setErrors({ form: err.message ?? 'Failed to create account. Try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-10 overflow-hidden bg-slate-50">
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-warm-lg bg-white border border-slate-100 animate-fade-in-scale">
        {/* Left: brand messaging */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden" style={{ backgroundColor: COLOR }}>
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2.5 mb-10 w-fit hover:opacity-85 transition-opacity">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center overflow-hidden">
                <Image src="/assets/logo-white.png" alt="jobstm" width={32} height={32} className="rounded-lg" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">jobstm</span>
            </Link>
            <h2 className="text-3xl font-bold leading-tight mb-4">Start your job<br />search today.</h2>
            <p className="text-white/75 text-sm max-w-xs">Create your free profile and get matched with verified employers hiring near you.</p>
          </div>
          <div className="relative z-10 space-y-3 mt-10">
            {[
              { icon: HiShieldCheck, label: '100% Verified Employers' },
              { icon: HiLightningBolt, label: 'Fast, Simple Onboarding' },
              { icon: HiBadgeCheck, label: 'Trusted by 1000+ Workers' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-white/85">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 sm:p-10 bg-white overflow-y-auto max-h-screen">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-6">
            <HiArrowLeft className="w-3.5 h-3.5" /> Back to website
          </Link>
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-warm overflow-hidden" style={{ backgroundColor: COLOR }}>
              <Image src="/assets/logo-white.png" alt="jobstm" width={40} height={40} className="rounded-xl" />
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Create Account</span>
              <span className="text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest" style={{ backgroundColor: COLOR }}>
                JOB SEEKER
              </span>
            </div>
            <p className="text-slate-400 text-sm">Register to start applying for jobs</p>
          </div>

          <ScrollReveal animation="fade-up">
            <div className="space-y-4">
              <FormInput label="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
              <FormInput label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <FormInput label="Mobile Number *" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} maxLength={10} error={errors.mobile} />
              <PasswordInput label="Password *" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} showStrength color={COLOR} />
              <PasswordInput label="Confirm Password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} color={COLOR} />
              <LocationSelect state={state} city={city} onStateChange={setState} onCityChange={setCity} />
              {errors.form && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">{errors.form}</p>}
              <Button onClick={submit} loading={loading} fullWidth color={COLOR} className="shadow-warm hover-lift">Create Account</Button>
            </div>
          </ScrollReveal>

          <p className="text-center lg:text-left text-slate-400 text-sm mt-6">
            Already have an account? <Link href="/jobseeker/login" className="font-bold" style={{ color: COLOR }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
