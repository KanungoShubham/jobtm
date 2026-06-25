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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1225]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
            <HiShieldCheck className="w-9 h-9 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl font-extrabold text-white tracking-tight">jobstm</span>
            <span className="bg-indigo-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-widest">
              ADMIN
            </span>
          </div>
          <p className="text-white/40 text-sm">Super Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 shadow-2xl border" style={{ backgroundColor: "#1a1f36", borderColor: "rgba(255,255,255,0.08)" }}>
          <h1 className="text-lg font-bold text-white mb-1">Sign in to continue</h1>
          <p className="text-white/40 text-sm mb-6">Admin access only</p>

          {error && (
            <div className="flex items-start gap-2 rounded-xl px-3.5 py-3 mb-4" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <HiExclamationCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* autofill override — forces dark bg + white text when browser autofills */}
          <style>{`
            .admin-input:-webkit-autofill,
            .admin-input:-webkit-autofill:hover,
            .admin-input:-webkit-autofill:focus,
            .admin-input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px #252b45 inset !important;
              -webkit-text-fill-color: #ffffff !important;
              caret-color: #6366f1;
            }
          `}</style>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium select-none">
                  +91
                </span>
                <HiPhone className="absolute left-12 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="98765 43210"
                  className="admin-input w-full pl-20 pr-4 py-2.5 rounded-xl text-sm transition focus:outline-none"
                  style={{ backgroundColor: "#252b45", border: "1px solid rgba(255,255,255,0.12)", color: "#ffffff", caretColor: "#6366f1" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="admin-input w-full pl-9 pr-10 py-2.5 rounded-xl text-sm transition focus:outline-none"
                  style={{ backgroundColor: "#252b45", border: "1px solid rgba(255,255,255,0.12)", color: "#ffffff", caretColor: "#6366f1" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.2)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                >
                  {showPwd ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
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

        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access · jobstm Super Admin
        </p>
      </div>
    </div>
  );
}
