import { describe, it, expect } from 'vitest';
import { getAQICategory, getAQIColor, getAQIBadgeShape, getFallbackWinterAQI } from '../services/aqiService';

describe('AQI Service & Environmental Physics', () => {
  it('correctly classifies AQI categories based on US EPA thresholds', () => {
    expect(getAQICategory(30)).toBe('Good');
    expect(getAQICategory(50)).toBe('Good');
    expect(getAQICategory(75)).toBe('Moderate');
    expect(getAQICategory(100)).toBe('Moderate');
    expect(getAQICategory(150)).toBe('Poor');
    expect(getAQICategory(200)).toBe('Poor');
    expect(getAQICategory(250)).toBe('Unhealthy');
    expect(getAQICategory(300)).toBe('Unhealthy');
    expect(getAQICategory(350)).toBe('Severe');
    expect(getAQICategory(400)).toBe('Severe');
    expect(getAQICategory(450)).toBe('Hazardous');
    expect(getAQICategory(550)).toBe('Hazardous');
  });

  it('provides colorblind-accessible shape descriptors for all categories', () => {
    expect(getAQIBadgeShape('Good')).toContain('Shield');
    expect(getAQIBadgeShape('Moderate')).toContain('Circle');
    expect(getAQIBadgeShape('Poor')).toContain('Triangle');
    expect(getAQIBadgeShape('Unhealthy')).toContain('Octagon');
    expect(getAQIBadgeShape('Severe')).toContain('Hexagon');
    expect(getAQIBadgeShape('Hazardous')).toContain('Skull');
  });

  it('generates high-fidelity fallback profile with diurnal inversion curves', () => {
    const data = getFallbackWinterAQI(28.6139, 77.209, 'New Delhi (NCR)');
    expect(data.location).toBe('New Delhi (NCR)');
    expect(data.aqi).toBeGreaterThanOrEqual(100);
    expect(data.hourly.length).toBe(24);

    // Morning hours (6-9) must reflect nocturnal boundary layer inversion trap
    const morningItem = data.hourly.find(h => h.hour === 8);
    expect(morningItem?.isInversionPeak).toBe(true);

    // Afternoon hours (13-15) must reflect solar convective ventilation window
    const solarItem = data.hourly.find(h => h.hour === 14);
    expect(solarItem?.isVentilationWindow).toBe(true);
  });
});
