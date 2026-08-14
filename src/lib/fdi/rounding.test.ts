/**
 * Display rounding (§7, owner-pinned answer H: half-up).
 *
 * No reachable FDI-1.0 value lands on a half, so these tests exercise the rule
 * directly rather than through the engine. Pinning it matters for reproducibility
 * the moment a future version changes the item count or range.
 */

import { roundHalfUp, rounderFor } from './rounding';

describe('roundHalfUp', () => {
  it.each([
    [0, 0],
    [0.49, 0],
    [0.5, 1],
    [0.51, 1],
    [1.5, 2],
    [2.5, 3],
    [23.5, 24],
    [24.5, 25],
    [49.5, 50],
    [74.5, 75],
    [99.5, 100],
    [33.333333333333336, 33],
    [41.66666666666667, 42],
    [66.66666666666667, 67],
    [100, 100],
  ])('rounds %p to %p', (input, expected) => {
    expect(roundHalfUp(input)).toBe(expected);
  });

  it('rounds halves UP rather than to even', () => {
    // Half-to-even would give 2 here, not 3.
    expect(roundHalfUp(2.5)).toBe(3);
    expect(roundHalfUp(0.5)).toBe(1);
  });

  it('does not carry a value across the boundary through floating-point addition', () => {
    // The classic `Math.floor(x + 0.5)` defect: 0.49999999999999994 + 0.5 rounds
    // up to 1.0 in binary64, which would wrongly yield 1.
    expect(roundHalfUp(0.49999999999999994)).toBe(0);
  });

  it('rejects non-finite input rather than producing a nonsense display value', () => {
    expect(() => roundHalfUp(Number.NaN)).toThrow(RangeError);
    expect(() => roundHalfUp(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe('rounderFor', () => {
  it('resolves the configured rule', () => {
    expect(rounderFor('half-up')).toBe(roundHalfUp);
  });

  it('throws on an unknown rule rather than silently defaulting', () => {
    // @ts-expect-error deliberately invalid rounding rule
    expect(() => rounderFor('half-even')).toThrow(RangeError);
  });
});
