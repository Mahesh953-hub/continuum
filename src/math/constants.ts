/**
 * Continuum: Fundamental Mathematical and Physical Constants
 */

export const MATH_CONSTANTS = {
  PI: Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Golden Ratio 1.6180339887...
  SQRT_2: Math.SQRT2,
  SQRT_3: Math.sqrt(3),
  SQRT_5: Math.sqrt(5),
  FEIGENBAUM_DELTA: 4.6692016091, // Chaos bifurcation constant
  FEIGENBAUM_ALPHA: 2.5029078750,
  EULER_MASCHERONI: 0.5772156649,
  APERY: 1.2020569031, // zeta(3)
  CATALAN: 0.9159655941,
  FINE_STRUCTURE: 1 / 137.035999, // alpha
  GRAVITATIONAL_CONSTANT: 0.6,
  PLANCK_SCALE: 0.05,
} as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distanceSquared2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}
