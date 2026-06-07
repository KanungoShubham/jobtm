'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiShieldCheck, HiPhone, HiLockClosed, HiEye, HiEyeOff,
  HiExclamationCircle,
} from 'react-icons/hi';
import { adminAuthApi } from '@/lib/api';
import { saveAdminSession, getAdminToken } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mobile,   setMobile]   = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (getAdminToken()) router.replace('/admin/dashboard');
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const digits = mobile.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    if (!password)             { setError('Password is required.');                 return; }

    setLoading(true);
    try {
      const fullMobile = `+91${digits}`;
      const res = await adminAuthApi.loginPassword(fullMobile, password);

      if (res.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }

      saveAdminSession(res.token, { userId: res.userId, name: res.name, role: res.role });
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#dc262622_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600 shadow-lg shadow-red-600/40 mb-4">
            <HiShieldCheck className="w-9 h-9 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-extrabold text-white tracking-tight">jobstm</span>
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest">
              ADMIN
            </span>
          </div>
          <p className="text-slate-400 text-sm">Super Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-1">Sign in to continue</h1>
          <p className="text-slate-400 text-sm mb-6">Admin access only</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-950 border border-red-800 rounded-xl px-3.5 py-3 mb-4">
              <HiExclamationCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium select-none">
                  +91
                </span>
                <HiPhone className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPwd ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Restricted access · jobstm Super Admin
        </p>
      </div>
    </div>
  );
}
