import type { UnitSystem } from '../models/User';

// ─────────────────────────────────────────────────────────────────────────────
// Unit conversion utilities.
// All values are STORED in metric (metres, °C, bar, kg).
// These helpers convert to the user's preferred display unit.
// ─────────────────────────────────────────────────────────────────────────────

export function metresToDisplay(m: number, units: UnitSystem): { value: number; label: string } {
  if (units === 'imperial') {
    return { value: Math.round(m * 3.28084 * 10) / 10, label: 'ft' };
  }
  return { value: m, label: 'm' };
}

export function celsiusToDisplay(c: number, units: UnitSystem): { value: number; label: string } {
  if (units === 'imperial') {
    return { value: Math.round((c * 9) / 5 + 32), label: '°F' };
  }
  return { value: c, label: '°C' };
}

export function barToDisplay(bar: number, units: UnitSystem): { value: number; label: string } {
  if (units === 'imperial') {
    return { value: Math.round(bar * 14.5038), label: 'psi' };
  }
  return { value: bar, label: 'bar' };
}

export function kgToDisplay(kg: number, units: UnitSystem): { value: number; label: string } {
  if (units === 'imperial') {
    return { value: Math.round(kg * 2.20462 * 10) / 10, label: 'lbs' };
  }
  return { value: kg, label: 'kg' };
}

// Reverse: convert from display unit back to metric for storage
export function displayToMetres(value: number, units: UnitSystem): number {
  return units === 'imperial' ? value / 3.28084 : value;
}

export function displayToCelsius(value: number, units: UnitSystem): number {
  return units === 'imperial' ? ((value - 32) * 5) / 9 : value;
}

export function displayToBar(value: number, units: UnitSystem): number {
  return units === 'imperial' ? value / 14.5038 : value;
}

export function displayToKg(value: number, units: UnitSystem): number {
  return units === 'imperial' ? value / 2.20462 : value;
}
