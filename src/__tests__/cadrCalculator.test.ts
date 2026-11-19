import { describe, it, expect } from 'vitest';
import { calculateCADR, getDIYCostComparison } from '../services/cadrCalculator';

describe('Corsi-Rosenthal & CADR Calculator', () => {
  it('accurately computes room volume and required CADR for 4.5 ACH target', () => {
    // 15ft x 12ft x 9ft = 1,620 cu. ft.
    // Required CADR for 4.5 ACH = (1,620 * 4.5) / 60 = 121.5 CFM (rounded to 122 CFM)
    const result = calculateCADR(15, 12, 9, 4.5, 4, 'Medium', 'MERV 13');
    expect(result.roomVolumeCuFt).toBe(1620);
    expect(result.requiredCADR).toBe(122);
    expect(result.effectiveCADR).toBe(340);
    expect(result.achAchieved).toBeGreaterThanOrEqual(4.5);
    expect(result.adequacyStatus).toBe('Hospital Grade');
  });

  it('penalizes single-filter configurations due to severe static fan backpressure', () => {
    const singleFilter = calculateCADR(15, 12, 9, 4.5, 1, 'Medium', 'MERV 13');
    const fourFilterCube = calculateCADR(15, 12, 9, 4.5, 4, 'Medium', 'MERV 13');

    // 4-filter Corsi cube has 4x surface area, yielding more than 2x the effective CADR
    expect(fourFilterCube.effectiveCADR).toBeGreaterThan(singleFilter.effectiveCADR * 2);
  });

  it('calculates 5-year cost savings showing significant economic advantage over commercial HEPA', () => {
    const comparison = getDIYCostComparison(1620);
    expect(comparison.diyInitial).toBeLessThan(100);
    expect(comparison.commercialInitial).toBeGreaterThan(300);
    expect(comparison.savingsFiveYear).toBeGreaterThan(500);
    expect(comparison.savingsPct).toBeGreaterThan(70);
  });
});
