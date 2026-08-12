'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HiPhone, HiLockClosed, HiEye, HiEyeOff, HiExclamationCircle, HiShieldCheck, HiLightningBolt, HiUserGroup, HiArrowLeft } from 'react-icons/hi';
import { authApi } from '@/lib/api';
import { employerAuth } from '@/lib/roleAuth';
import { Button } from '@/components/shared/FormField';

const COLOR = '#7C3AED';

export default function EmployerLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employerAuth.getToken()) router.replace('/employer/dashboard');
  }, [router]);

  const digits = mobile.replace(/\D/g, '');

  const finish = (res: { token: string; userId: string; role: string; name?: string }) => {
    if (res.role !== 'employer') { setError('This account does not have employer access.'); return; }
    employerAuth.saveSession(res.token, { userId: res.userId, name: res.name, role: res.role });
    router.replace('/employer/dashboard');
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    if (!password) { setError('Password is required.'); return; }
    setLoading(true);
    try {
      const res = await authApi.loginPassword(`+91${digits}`, password);
      finish(res);
    } catch (err: any) {
      setError(err.message ?? 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-violet-100">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: `${COLOR}14` }} />
        <div className="absolute -bottom-1/4 -left-1/4 w-[450px] h-[450px] rounded-full blur-3xl bg-violet-200/30" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-warm-lg bg-white/70 backdrop-blur-sm border border-white animate-fade-in-scale">
        {/* Left: brand messaging */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden" style={{ background: `linear-gradient(150deg, ${COLOR}, #A78BFA 65%, #C4B5FD)` }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-black/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2.5 mb-10 w-fit hover:opacity-85 transition-opacity">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center overflow-hidden">
                <Image src="/assets/logo-white.png" alt="jobstm" width={32} height={32} className="rounded-lg" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">jobstm</span>
            </Link>
            <h2 className="text-3xl font-bold leading-tight mb-4">Hire verified talent,<br />on demand.</h2>
            <p className="text-white/75 text-sm max-w-xs">Post jobs, review applications, and build your workforce with confidence.</p>
          </div>
          <div className="relative z-10 space-y-3 mt-10">
            {[
              { icon: HiShieldCheck, label: 'Pre-Verified Candidates' },
              { icon: HiLightningBolt, label: 'Hire in Minutes, Not Weeks' },
              { icon: HiUserGroup, label: 'Manage Your Whole Team' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-white/85">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 sm:p-10 bg-white">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors mb-6">
            <HiArrowLeft className="w-3.5 h-3.5" /> Back to website
          </Link>
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-warm overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${COLOR}, #A78BFA)` }}>
              <Image src="/assets/logo-white.png" alt="jobstm" width={40} height={40} className="rounded-xl" />
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome back</span>
              <span className="text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest" style={{ backgroundColor: COLOR }}>
                EMPLOYER
              </span>
            </div>
            <p className="text-slate-400 text-sm">Sign in to manage your hiring</p>
          </div>

          <div className="flex mb-5 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
            <button className="flex-1 py-2 rounded-lg text-sm font-bold text-white shadow-sm" style={{ backgroundColor: COLOR }}>
              Login
            </button>
            <Link href="/employer/register" className="flex-1 py-2 rounded-lg text-sm font-bold text-center text-slate-500 hover:text-slate-700 transition-colors">
              Sign Up
            </Link>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl px-3.5 py-3 mb-4 bg-red-50 border border-red-200 animate-fade-in-up">
              <HiExclamationCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={submitPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
                <HiPhone className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 transition" style={{ ['--tw-ring-color' as any]: `${COLOR}55` }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type={showPwd ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 transition" style={{ ['--tw-ring-color' as any]: `${COLOR}55` }} />
                <button type="button" tabIndex={-1} onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  {showPwd ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" loading={loading} fullWidth color={COLOR} className="shadow-warm hover-lift">Sign In</Button>
          </form>

          <p className="text-center lg:text-left text-slate-400 text-sm mt-6">
            New employer?{' '}
            <Link href="/employer/register" className="font-bold" style={{ color: COLOR }}>Register your company</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
