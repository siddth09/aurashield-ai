import { CADRCalculation } from '../types';

export interface CorsiConfigOption {
  name: string;
  filters: 1 | 2 | 4 | 5;
  filterRating: 'MERV 13' | 'MERV 14' | 'HEPA H13';
  fanSpeed: 'Low' | 'Medium' | 'High';
  estimatedNoiseDb: number;
  cadrCfm: number;
  powerWatts: number;
}

export function calculateCADR(
  lengthFt: number,
  widthFt: number,
  heightFt: number = 9,
  desiredACH: number = 4.5,
  filters: 1 | 2 | 4 | 5 = 4,
  fanSpeed: 'Low' | 'Medium' | 'High' = 'Medium',
  filterRating: 'MERV 13' | 'MERV 14' | 'HEPA H13' = 'MERV 13'
): CADRCalculation {
  const volumeCuFt = Math.max(100, Math.round(lengthFt * widthFt * heightFt));
  const requiredCADR = Math.round((volumeCuFt * desiredACH) / 60);

  // Compute effective CADR based on filter geometry and speed
  // 4-filter Corsi-Rosenthal cube has 4x surface area, yielding minimal static pressure drop
  let baseCfm = 340;
  if (fanSpeed === 'Low') baseCfm = 220;
  if (fanSpeed === 'High') baseCfm = 460;

  // Filter count geometry penalty: single filter chokes fan severely
  let geometryMultiplier = 1.0;
  if (filters === 1) geometryMultiplier = 0.45; // 1 filter causes immense backpressure
  else if (filters === 2) geometryMultiplier = 0.72; // V-shape wedge
  else if (filters === 4) geometryMultiplier = 1.0; // 4-filter cube
  else if (filters === 5) geometryMultiplier = 1.15; // 5-filter tower / Comparetto

  // Filter rating capture penalty
  let ratingMultiplier = 1.0;
  if (filterRating === 'MERV 14') ratingMultiplier = 0.95;
  if (filterRating === 'HEPA H13') ratingMultiplier = 0.75; // standard box fan cannot push easily through dense HEPA fiberglass

  const effectiveCADR = Math.round(baseCfm * geometryMultiplier * ratingMultiplier);
  const achAchieved = Math.round(((effectiveCADR * 60) / volumeCuFt) * 10) / 10;

  let adequacyStatus: 'Underpowered' | 'Adequate' | 'Hospital Grade' = 'Adequate';
  if (achAchieved < desiredACH) {
    adequacyStatus = 'Underpowered';
  } else if (achAchieved >= 6.0) {
    adequacyStatus = 'Hospital Grade';
  }

  return {
    roomLengthFeet: lengthFt,
    roomWidthFeet: widthFt,
    ceilingHeightFeet: heightFt,
    roomVolumeCuFt: volumeCuFt,
    desiredACH,
    requiredCADR,
    boxFanCFM: effectiveCADR,
    filterRating,
    numberOfFilters: filters,
    effectiveCADR,
    achAchieved,
    adequacyStatus,
  };
}

export function getDIYCostComparison(roomVolumeCuFt: number) {
  const diyInitial = 55; // $20 box fan + $35 (4x MERV 13 filters)
  const diyAnnualFilter = 32; // 4x filters replaced every 6 months in heavy winter smog
  const commercialInitial = 380; // Reputable 300+ CADR HEPA purifier
  const commercialAnnualFilter = 95; // Proprietary OEM cylindrical HEPA cartridge

  const fiveYearDIY = diyInitial + (diyAnnualFilter * 5);
  const fiveYearCommercial = commercialInitial + (commercialAnnualFilter * 5);
  const savingsFiveYear = fiveYearCommercial - fiveYearDIY;
  const savingsPct = Math.round((savingsFiveYear / fiveYearCommercial) * 100);

  return {
    diyInitial,
    diyAnnualFilter,
    commercialInitial,
    commercialAnnualFilter,
    fiveYearDIY,
    fiveYearCommercial,
    savingsFiveYear,
    savingsPct,
  };
}
