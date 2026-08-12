'use client';
import { useRef, useState, useEffect } from 'react';

export function OtpInput({
  value, onChange, length = 5, color = '#0EA5E9',
}: { value: string; onChange: (v: string) => void; length?: number; color?: string }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, d: string) => {
    const digits = value.split('');
    digits[i] = d;
    const next = digits.join('').slice(0, length);
    onChange(next);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ''}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-slate-200 focus:outline-none"
          style={{ borderColor: value[i] ? color : undefined }}
        />
      ))}
    </div>
  );
}

export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(0);
  const start = () => setLeft(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((v: number) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return { left, start };
}
