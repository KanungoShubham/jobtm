'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiLightningBolt, HiRefresh, HiExclamationCircle, HiCheckCircle,
  HiInformationCircle, HiUsers,
} from 'react-icons/hi';
import { launchOfferApi } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

export default function LaunchOfferPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [limit,    setLimit]    = useState('1000');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await launchOfferApi.get(getAdminToken() ?? '');
      setSettings(res.data);
      setLimit(String(res.data.registration_limit));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (patch: { is_enabled?: boolean; registration_limit?: number }) => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await launchOfferApi.update(getAdminToken() ?? '', patch);
      setSettings(res.data);
      setLimit(String(res.data.registration_limit));
      setSuccess('Settings saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLimitSave = () => {
    const v = parseInt(limit);
    if (isNaN(v) || v < 1) { setError('Limit must be a positive number.'); return; }
    save({ registration_limit: v });
  };

  const pct = settings
    ? Math.min(100, Math.round(((settings.total_jobseekers ?? 0) / Math.max(settings.registration_limit, 1)) * 100))
    : 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Admin Settings</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiLightningBolt className="w-6 h-6 text-amber-500" />
            Launch Offer
          </h1>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-3.5 py-2 rounded-xl shadow-sm transition">
          <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <HiCheckCircle className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : settings ? (
        <>
          {/* Status card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900">Current Status</p>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                settings.launch_offer_active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {settings.launch_offer_active ? '● ACTIVE' : '○ INACTIVE'}
              </span>
            </div>

            {/* Registration progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Jobseeker registrations</span>
                <span className="font-semibold text-slate-700">
                  {(settings.total_jobseekers ?? 0).toLocaleString('en-IN')} / {(settings.registration_limit ?? 1000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {pct < 100
                  ? `${(settings.registration_limit - settings.total_jobseekers).toLocaleString('en-IN')} spots remaining before offer closes automatically`
                  : 'Registration limit reached — offer is closed'}
              </p>
            </div>

            {/* Info rows */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Jobseekers',  value: (settings.total_jobseekers ?? 0).toLocaleString('en-IN'), icon: HiUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Reg. Limit',        value: (settings.registration_limit ?? 1000).toLocaleString('en-IN'), icon: HiLightningBolt, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-3">
                  <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">{s.value}</p>
                    <p className="text-[10px] text-slate-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enable / Disable */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
            <p className="text-sm font-extrabold text-slate-900">Enable / Disable Offer</p>
            <p className="text-xs text-slate-500">
              When enabled, all jobseekers can apply to unlimited jobs for free — regardless of the 10-application limit — until the registration count reaches the configured limit.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => save({ is_enabled: true })}
                disabled={saving || settings.is_enabled}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition border-2 ${
                  settings.is_enabled
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {settings.is_enabled ? '✓ Enabled' : 'Enable Offer'}
              </button>
              <button
                onClick={() => save({ is_enabled: false })}
                disabled={saving || !settings.is_enabled}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition border-2 ${
                  !settings.is_enabled
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {!settings.is_enabled ? '✓ Disabled' : 'Disable Offer'}
              </button>
            </div>
          </div>

          {/* Registration limit */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
            <p className="text-sm font-extrabold text-slate-900">Registration Limit</p>
            <p className="text-xs text-slate-500">
              The launch offer automatically closes when total jobseeker registrations reach this number. You can increase or decrease it at any time.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setLimit(String(Math.max(1, parseInt(limit || '0') - 100)))}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-lg transition flex items-center justify-center"
              >−</button>
              <button
                onClick={() => setLimit(String(Math.max(1, parseInt(limit || '0') - 1000)))}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition flex items-center justify-center"
              >−1k</button>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-center text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => setLimit(String(parseInt(limit || '0') + 1000))}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold transition flex items-center justify-center"
              >+1k</button>
              <button
                onClick={() => setLimit(String(parseInt(limit || '0') + 100))}
                className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-lg transition flex items-center justify-center"
              >+</button>
              <button
                onClick={handleLimitSave}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-800">
              <HiInformationCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-bold">How the Launch Offer works</p>
            </div>
            <ul className="text-xs text-amber-700 space-y-1.5 pl-5 list-disc">
              <li>While active, all jobseekers can apply to unlimited jobs for free</li>
              <li>The offer closes automatically when total jobseeker count reaches the registration limit</li>
              <li>After closing, users get 10 free applications then must subscribe</li>
              <li>You can re-enable the offer or raise the limit at any time from this panel</li>
              <li>Disabling overrides the limit check — offer stops immediately</li>
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
