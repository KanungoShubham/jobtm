'use client';
import { stateObject } from '@/lib/csclist';
import { FormSelect } from './FormField';

const STATES = Object.keys(stateObject.India).sort();

export function LocationSelect({
  state, city, onStateChange, onCityChange, stateError, cityError,
}: {
  state: string; city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  stateError?: string; cityError?: string;
}) {
  const cities: string[] = state && (stateObject.India as Record<string, string[]>)[state]
    ? [...(stateObject.India as Record<string, string[]>)[state]].sort()
    : [];

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormSelect
        label="State *"
        value={state}
        error={stateError}
        onChange={(e) => { onStateChange(e.target.value); onCityChange(''); }}
      >
        <option value="">Select State</option>
        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </FormSelect>
      <FormSelect
        label="City *"
        value={city}
        error={cityError}
        disabled={!state}
        onChange={(e) => onCityChange(e.target.value)}
      >
        <option value="">{state ? 'Select City' : 'Select state first'}</option>
        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
      </FormSelect>
    </div>
  );
}
