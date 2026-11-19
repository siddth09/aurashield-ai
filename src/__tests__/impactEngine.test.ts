import { describe, it, expect } from 'vitest';
import { calculateDirectImpact, getMonthlyProjection } from '../services/impactEngine';
import { HouseholdProfile, RoutineItem } from '../types';

describe('Impact Engine & Mathematical Models', () => {
  const dummyProfile: HouseholdProfile = {
    cityName: 'New Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    dwellingType: 'high_rise_apartment',
    floorLevel: 6,
    hasAirPurifier: true,
    purifierCount: 1,
    hasExhaustFans: true,
    sealedWindows: false,
    commuteMode: 'metro_subway',
    dailyCommuteKm: 20,
    cookingEnergy: 'electric_induction',
    heatingType: 'electric_oil_radiator',
    vulnerableMembers: {
      infantsOrToddlers: true,
      elderly: false,
      asthmaOrRespiratory: false,
      pregnant: false,
      pets: false,
    },
    activeHacks: ['corsi-rosenthal', 'wet-mopping-physics'],
  };

  const dummyRoutines: RoutineItem[] = [
    {
      id: 'morning-commute',
      timeSlot: '07:30 - 08:30 AM',
      title: 'Morning Work Commute',
      standardHabit: 'Solo car drive',
      lowEmissionAlternative: 'Electric Metro shift',
      exposureReductionPct: 60,
      co2SavedKg: 4.5,
      category: 'commute',
      status: 'completed',
      urgency: 'critical',
      explanation: 'Avoids tailpipe NOx and inversion peak',
    }
  ];

  it('correctly calculates microgram exposure reduction and Berkeley Earth cigarette equivalence', () => {
    const ambientAQI = 350;
    const ambientPM2_5 = 220; // 220 ug/m3
    const metrics = calculateDirectImpact(dummyProfile, ambientAQI, ambientPM2_5, dummyRoutines, 2);

    expect(metrics.totalPM25ExposurePreventedUg).toBeGreaterThan(0);
    expect(metrics.cigarettesAvoidedEquivalent).toBeGreaterThan(0);
    expect(metrics.co2ePreventedKg).toBeGreaterThanOrEqual(4.5);
    expect(metrics.indoorAQIImprovementPct).toBeGreaterThan(50);
  });

  it('projects 30-day cumulative benefits cleanly', () => {
    const sampleImpact = {
      totalPM25ExposurePreventedUg: 1200,
      cigarettesAvoidedEquivalent: 5,
      co2ePreventedKg: 6,
      activeSustainableChoicesCount: 3,
      indoorAQIImprovementPct: 75,
      healthRiskReductionScore: 85,
    };

    const monthly = getMonthlyProjection(sampleImpact);
    expect(monthly.monthlyCigarettesAvoided).toBe(150); // 5 * 30
    expect(monthly.monthlyCO2SavedKg).toBe(180); // 6 * 30
    expect(monthly.treesEquivalentAnnual).toBeGreaterThan(0);
  });
});
