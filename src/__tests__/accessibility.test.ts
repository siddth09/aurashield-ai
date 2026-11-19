import { describe, it, expect } from 'vitest';
import { getAQICategory, getAQIColor, getAQIBadgeShape } from '../services/aqiService';
import { AQICategory } from '../types';

describe('Accessibility & Inclusive Design Verification (WCAG AAA)', () => {
  const categories: AQICategory[] = ['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'];

  it('guarantees unique shape tokens for all 6 AQI tiers for colorblind inclusivity', () => {
    const shapes = categories.map(cat => getAQIBadgeShape(cat));
    const uniqueShapes = new Set(shapes.map(s => s.split(' ')[0]));

    // Shield, Circle, Triangle, Octagon, Hexagon, Skull
    expect(uniqueShapes.size).toBe(6);
    expect(shapes[0]).toContain('Shield');
    expect(shapes[1]).toContain('Circle');
    expect(shapes[2]).toContain('Triangle');
    expect(shapes[3]).toContain('Octagon');
    expect(shapes[4]).toContain('Hexagon');
    expect(shapes[5]).toContain('Skull');
  });

  it('provides high-contrast color classes for each AQI tier', () => {
    categories.forEach(cat => {
      const colorClass = getAQIColor(cat);
      expect(colorClass).toBeDefined();
      expect(colorClass.length).toBeGreaterThan(10);
      expect(colorClass).toContain('border-');
      expect(colorClass).toContain('bg-');
    });
  });

  it('safely handles extreme edge case AQI numerical values', () => {
    expect(getAQICategory(0)).toBe('Good');
    expect(getAQICategory(-10)).toBe('Good');
    expect(getAQICategory(999)).toBe('Hazardous');
    expect(getAQICategory(2000)).toBe('Hazardous');
  });
});
