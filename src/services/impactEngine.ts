import { HouseholdProfile, ImpactMetrics, RoutineItem } from '../types';

export interface HabitImpactBreakdown {
  id: string;
  title: string;
  pm25AvoidedUg: number;
  cigarettesAvoided: number;
  co2SavedKg: number;
  category: string;
}

export function calculateDirectImpact(
  profile: HouseholdProfile,
  ambientAQI: number,
  ambientPM2_5: number,
  routineItems: RoutineItem[],
  activeHacksCount: number
): ImpactMetrics {
  let totalPM25AvoidedMicrograms = 0;
  let totalCO2SavedKg = 0;
  let activeSustainableCount = 0;

  // Average adult breathes ~11,000 liters (11 m³) of air per day (approx 0.46 m³/hour resting, up to 1.5 m³/hour walking/cardio)
  const breathingRateM3PerHour = 0.55;

  // 1. Commute impact
  const commuteKm = profile.dailyCommuteKm || 15;
  const commuteItem = routineItems.find(r => r.id === 'morning-commute');
  const isCommuteOptimized = commuteItem?.status === 'completed' || profile.commuteMode === 'metro_subway' || profile.commuteMode === 'carpool' || profile.commuteMode === 'work_from_home';

  if (isCommuteOptimized) {
    activeSustainableCount++;
    // If switched from solo car to metro/carpool/wfh:
    // Solo car = 0.192 kg/km, Metro = 0.028 kg/km -> Delta = 0.164 kg/km
    const co2DeltaPerKm = profile.commuteMode === 'work_from_home' ? 0.192 : 0.155;
    totalCO2SavedKg += Math.round(commuteKm * co2DeltaPerKm * 10) / 10;

    // Outdoor street-level PM2.5 in heavy traffic is often 25% higher than ambient AQI
    const streetPM2_5 = ambientPM2_5 * 1.25;
    // N95 / Metro filtration reduces inhalation by ~75%
    const pmPreventedPerHour = streetPM2_5 * 0.75;
    const commuteHours = commuteKm / 25; // average urban speed 25 km/h
    totalPM25AvoidedMicrograms += Math.round(pmPreventedPerHour * breathingRateM3PerHour * commuteHours * 10) / 10;
  }

  // 2. Indoor Air Quality & Filtration impact
  // If user has active hacks (Corsi-Rosenthal, sealed windows, wet-mopping)
  const baseIndoorPM2_5 = profile.sealedWindows ? ambientPM2_5 * 0.6 : ambientPM2_5 * 0.85;
  let filteredIndoorPM2_5 = baseIndoorPM2_5;

  if (profile.hasAirPurifier || activeHacksCount > 0) {
    // Each hack contributes synergistic reduction
    const hackEfficacy = Math.min(0.85, 0.45 + (activeHacksCount * 0.12));
    filteredIndoorPM2_5 = baseIndoorPM2_5 * (1 - hackEfficacy);
    const indoorPM2_5SavedPerM3 = baseIndoorPM2_5 - filteredIndoorPM2_5;
    // 14 hours spent indoors in bedroom/living room
    const indoorHours = 14;
    totalPM25AvoidedMicrograms += Math.round(indoorPM2_5SavedPerM3 * breathingRateM3PerHour * indoorHours * 10) / 10;
  }

  // 3. Routine completed items
  routineItems.forEach(item => {
    if (item.status === 'completed') {
      activeSustainableCount++;
      totalCO2SavedKg += item.co2SavedKg;
      // Extra exposure protection based on item reduction pct
      const hourlySaved = ambientPM2_5 * (item.exposureReductionPct / 100) * breathingRateM3PerHour * 1.5;
      totalPM25AvoidedMicrograms += Math.round(hourlySaved * 10) / 10;
    }
  });

  // Berkeley Earth formula: 1 cigarette/day ≈ 22 µg/m³ of PM2.5 exposure over 24 hours.
  // Daily microgram inhalation equivalent to 1 cigarette: 22 µg/m³ * 11 m³ = 242 µg PM2.5
  const cigarettesAvoided = Math.round((totalPM25AvoidedMicrograms / 242) * 10) / 10;

  // Indoor AQI improvement percentage
  const indoorImprovementPct = baseIndoorPM2_5 > 0 
    ? Math.min(92, Math.round(((baseIndoorPM2_5 - filteredIndoorPM2_5) / baseIndoorPM2_5) * 100))
    : 0;

  // Health risk score (0 to 100, where 100 is best protected)
  let healthScore = 30; // baseline under winter smog
  healthScore += Math.min(35, activeHacksCount * 7);
  healthScore += Math.min(25, activeSustainableCount * 5);
  if (profile.vulnerableMembers.infantsOrToddlers || profile.vulnerableMembers.asthmaOrRespiratory) {
    // If sensitive members are present, penalties apply if filtration is low
    if (activeHacksCount < 2) healthScore = Math.max(15, healthScore - 15);
  }
  healthScore = Math.min(98, healthScore);

  return {
    totalPM25ExposurePreventedUg: Math.round(totalPM25AvoidedMicrograms),
    cigarettesAvoidedEquivalent: Math.max(0, cigarettesAvoided),
    co2ePreventedKg: Math.round(totalCO2SavedKg * 10) / 10,
    activeSustainableChoicesCount: activeSustainableCount,
    indoorAQIImprovementPct: indoorImprovementPct,
    healthRiskReductionScore: healthScore,
  };
}

export function getMonthlyProjection(dailyMetrics: ImpactMetrics) {
  return {
    monthlyPM25AvoidedMg: Math.round((dailyMetrics.totalPM25ExposurePreventedUg * 30) / 1000 * 10) / 10, // in milligrams
    monthlyCigarettesAvoided: Math.round(dailyMetrics.cigarettesAvoidedEquivalent * 30),
    monthlyCO2SavedKg: Math.round(dailyMetrics.co2ePreventedKg * 30),
    treesEquivalentAnnual: Math.round((dailyMetrics.co2ePreventedKg * 365) / 21 * 10) / 10, // 1 mature tree absorbs ~21kg CO2/year
  };
}
