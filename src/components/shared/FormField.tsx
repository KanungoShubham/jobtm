'use client';
import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

// Strong password: 8+ chars, upper, lower, number, special char
export function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(pwd)) return 'Add at least one uppercase letter';
  if (!/[a-z]/.test(pwd)) return 'Add at least one lowercase letter';
  if (!/[0-9]/.test(pwd)) return 'Add at least one number';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Add at least one special character';
  return null;
}

export function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  const rules = [pwd.length >= 8, /[A-Z]/.test(pwd), /[a-z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)];
  const score = rules.filter(Boolean).length;
  if (!pwd) return { score: 0, label: '', color: '#E2E8F0' };
  if (score <= 2) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 4) return { score, label: 'Medium', color: '#F59E0B' };
  return { score, label: 'Strong', color: '#10B981' };
}

export function PasswordInput({
  label, error, containerClassName = '', color = '#0EA5E9', showStrength, value, ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string; error?: string; containerClassName?: string; color?: string; showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? passwordStrength(String(value ?? '')) : null;

  return (
    <div className={containerClassName}>
      {label && <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          {...props}
          value={value}
          type={visible ? 'text' : 'password'}
          className={`w-full pl-3 pr-10 py-2.5 rounded-xl text-sm border transition focus:outline-none ${
            error ? 'border-red-400' : 'border-slate-200 focus:border-current'
          }`}
          style={{ ['--tw-ring-color' as any]: color }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
        >
          {visible ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && strength && strength.label && (
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(strength.score / 5) * 100}%`, backgroundColor: strength.color }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FormInput({
  label, error, icon, containerClassName = '', color = '#0EA5E9', ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string; error?: string; icon?: ReactNode; containerClassName?: string; color?: string;
}) {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl text-sm border transition focus:outline-none ${
            error ? 'border-red-400' : 'border-slate-200 focus:border-current'
          }`}
          style={{ color: props.disabled ? undefined : undefined, ['--tw-ring-color' as any]: color }}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label, error, containerClassName = '', children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string; error?: string; containerClassName?: string;
}) {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>}
      <select
        {...props}
        className={`w-full px-3 py-2.5 rounded-xl text-sm border bg-white transition focus:outline-none ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label, error, containerClassName = '', ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string; error?: string; containerClassName?: string;
}) {
  return (
    <div className={containerClassName}>
      {label && <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>}
      <textarea
        {...props}
        className={`w-full px-3 py-2.5 rounded-xl text-sm border transition focus:outline-none ${
          error ? 'border-red-400' : 'border-slate-200'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Button({
  children, loading, variant = 'primary', color = '#0EA5E9', fullWidth, className = '', ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean; variant?: 'primary' | 'outline' | 'ghost'; color?: string; fullWidth?: boolean;
}) {
  const base = 'flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed';
  const style =
    variant === 'primary' ? { backgroundColor: color, color: '#fff' } :
    variant === 'outline' ? { border: `1.5px solid ${color}`, color } : { color };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${base} ${fullWidth ? 'w-full' : ''} hover:opacity-90 ${className}`}
      style={style}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
