import {
  calculate1RM,
  lbsToKg,
  kgToLbs,
  formatWeight,
} from './utils';

describe('calculate1RM (Epley)', () => {
  test('computes 1RM for typical bench set', () => {
    expect(calculate1RM(100, 10)).toBeCloseTo(133.333333, 4);
  });

  test('caps reps at 20 for formula', () => {
    const capped = calculate1RM(100, 50);
    const at20 = calculate1RM(100, 20);
    expect(capped).toBe(at20);
  });

  test('single rep returns same weight', () => {
    expect(calculate1RM(200, 1)).toBeCloseTo(200 * (1 + 1 / 30), 6);
  });
});

describe('unit conversions', () => {
  test('lbsToKg and kgToLbs round-trip', () => {
    const lbs = 220;
    const kg = lbsToKg(lbs);
    expect(kgToLbs(kg)).toBeCloseTo(lbs, 5);
  });

  test('kgToLbs matches known conversion', () => {
    expect(kgToLbs(100)).toBeCloseTo(220.462, 2);
  });
});

describe('formatWeight', () => {
  test('returns unknown for missing values', () => {
    expect(formatWeight('unknown')).toBe('unknown');
    expect(formatWeight(null)).toBe('unknown');
    expect(formatWeight(undefined)).toBe('unknown');
  });

  test('formats lbs by default', () => {
    expect(formatWeight(185)).toBe('185 lbs');
  });

  test('formats kg with one decimal', () => {
    expect(formatWeight(220.462, 'kg')).toMatch(/kg$/);
    expect(formatWeight(220.462, 'kg')).toMatch(/^[\d.]+ kg$/);
  });

  test('passes through non-numeric as string', () => {
    expect(formatWeight('heavy')).toBe('heavy');
  });
});
