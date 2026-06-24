'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  HiTag, HiRefresh, HiExclamationCircle, HiPlus, HiTrash, HiCheck,
  HiEye, HiEyeOff,
} from 'react-icons/hi';
import { adsAdminApi, type AdPlan } from '@/lib/api';
import { getAdminToken } from '@/lib/adminAuth';

const BLANK = { key: '', label: '', days: 30, amount: 499 };

function Stepper({ value, onChange, step, min = 0, prefix }: {
  value: number; onChange: (v: number) => void; step: number; min?: number; prefix?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={() => onChange(Math.max(min, value - step))}
        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-base leading-none flex-shrink-0">−</button>
      <div className="relative">
        {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">{prefix}</span>}
        <input type="number" value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          className={`w-20 ${prefix ? 'pl-5' : 'pl-2'} pr-2 py-1.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:border-sky-300`} />
      </div>
      <button type="button" onClick={() => onChange(value + step)}
        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-base leading-none flex-shrink-0">+</button>
    </div>
  );
}

function PlanRow({ plan, token, onChanged }: { plan: AdPlan; token: string; onChanged: () => void }) {
  const [label, setLabel]   = useState(plan.label);
  const [days, setDays]     = useState(plan.days);
  const [amount, setAmount] = useState(plan.amount);
  const [order, setOrder]   = useState(plan.sort_order);
  const [active, setActive] = useState(plan.is_active);
  const [busy, setBusy]     = useState<'' | 'save' | 'delete' | 'toggle'>('');
  const [err, setErr]       = useState('');

  useEffect(() => {
    setLabel(plan.label); setDays(plan.days); setAmount(plan.amount);
    setOrder(plan.sort_order); setActive(plan.is_active);
  }, [plan]);

  const dirty = label !== plan.label || days !== plan.days ||
    amount !== plan.amount || order !== plan.sort_order;

  const save = async () => {
    if (!label.trim()) { setErr('Label required'); return; }
    setBusy('save'); setErr('');
    try { await adsAdminApi.updatePlan(token, plan.key, { label: label.trim(), days, amount, sort_order: order }); onChanged(); }
    catch (e: any) { setErr(e.message); } finally { setBusy(''); }
  };
  const toggle = async () => {
    setBusy('toggle'); setErr('');
    try { await adsAdminApi.updatePlan(token, plan.key, { is_active: !active }); setActive(!active); onChanged(); }
    catch (e: any) { setErr(e.message); } finally { setBusy(''); }
  };
  const remove = async () => {
    if (!confirm(`Delete plan "${plan.label}" (${plan.key})? Advertisers can no longer pick it.`)) return;
    setBusy('delete'); setErr('');
    try { await adsAdminApi.deletePlan(token, plan.key); onChanged(); }
    catch (e: any) { setErr(e.message); setBusy(''); }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${active ? 'border-slate-100' : 'border-slate-200 opacity-70'}`}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Key</span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg">{plan.key}</span>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Label</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            className="px-2.5 py-1.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-300" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Duration (days)</span>
          <Stepper value={days} onChange={setDays} step={1} min={1} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Price (₹)</span>
          <Stepper value={amount} onChange={setAmount} step={50} min={0} prefix="₹" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Order</span>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value) || 0)}
            className="w-16 px-2 py-1.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:border-sky-300" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={toggle} disabled={!!busy}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 ${active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            {active ? <HiEye className="w-4 h-4" /> : <HiEyeOff className="w-4 h-4" />}
            {active ? 'Active' : 'Hidden'}
          </button>
          <button onClick={save} disabled={!!busy || !dirty}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 text-xs font-bold transition disabled:opacity-40">
            {busy === 'save' ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiCheck className="w-4 h-4" />}
            Save
          </button>
          <button onClick={remove} disabled={!!busy}
            className="flex items-center justify-center w-9 h-9 rounded-xl border-2 border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50">
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      {err && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><HiExclamationCircle className="w-3.5 h-3.5" /> {err}</p>}
    </div>
  );
}

export default function AdminAdPlansPage() {
  const [list, setList]       = useState<AdPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [adding, setAdding]   = useState(false);
  const [draft, setDraft]     = useState(BLANK);
  const [savingNew, setSavingNew] = useState(false);

  const token = getAdminToken() ?? '';

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await adsAdminApi.listPlans(token); setList(res.data ?? []); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const addPlan = async () => {
    if (!draft.key.trim() || !draft.label.trim()) { setError('Key and label are required'); return; }
    setSavingNew(true); setError('');
    try {
      await adsAdminApi.createPlan(token, {
        key: draft.key.trim(), label: draft.label.trim(), days: draft.days, amount: draft.amount,
        sort_order: (list.length ? Math.max(...list.map((p) => p.sort_order)) : 0) + 1,
      });
      setDraft(BLANK); setAdding(false); load();
    } catch (e: any) { setError(e.message); } finally { setSavingNew(false); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <HiTag className="w-6 h-6 text-sky-500" /> Ad Center Plans
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Add and adjust the duration & price of ad plans advertisers can buy</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1.5 bg-sky-500 text-white px-3.5 py-2 rounded-xl text-sm font-bold hover:bg-sky-600 transition">
            <HiPlus className="w-4 h-4" /> New Plan
          </button>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 bg-white px-3 py-2 rounded-xl text-sm transition">
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <HiExclamationCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p>{error}</p>
            {/relation|does not exist|ad_plans/i.test(error) && (
              <p className="text-xs text-red-500 mt-1">Run <code className="bg-red-100 px-1 rounded">database/ad-plans-migration.sql</code> in the Supabase SQL editor to create the <code className="bg-red-100 px-1 rounded">ad_plans</code> table.</p>
            )}
          </div>
        </div>
      )}

      {adding && (
        <div className="bg-white rounded-2xl border border-sky-200 shadow-sm p-4 space-y-3">
          <p className="text-sm font-extrabold text-slate-900">New Plan</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Key</span>
              <input value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} placeholder="e.g. 2m"
                className="w-24 px-2.5 py-1.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-300" />
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Label</span>
              <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. 2 Months"
                className="px-2.5 py-1.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-300" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Duration (days)</span>
              <Stepper value={draft.days} onChange={(v) => setDraft({ ...draft, days: v })} step={1} min={1} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Price (₹)</span>
              <Stepper value={draft.amount} onChange={(v) => setDraft({ ...draft, amount: v })} step={50} min={0} prefix="₹" />
            </div>
            <button onClick={addPlan} disabled={savingNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-bold transition disabled:opacity-50 ml-auto">
              {savingNew ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiPlus className="w-4 h-4" />}
              Add Plan
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : list.length === 0 && !error ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <HiTag className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-400">No plans yet — add one above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((p) => <PlanRow key={p.key} plan={p} token={token} onChanged={load} />)}
        </div>
      )}
    </div>
  );
}
