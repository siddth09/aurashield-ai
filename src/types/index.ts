export type AQICategory = 'Good' | 'Moderate' | 'Poor' | 'Unhealthy' | 'Severe' | 'Hazardous';

export interface PollutantDetails {
  pm2_5: number;      // µg/m³
  pm10: number;       // µg/m³
  no2: number;        // µg/m³
  so2: number;        // µg/m³
  o3: number;         // µg/m³
  co: number;         // µg/m³
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  aqi: number;
  pm2_5: number;
  temperature: number;
  humidity: number;
  isInversionPeak: boolean;
  isVentilationWindow: boolean;
}

export interface AQIData {
  location: string;
  latitude: number;
  longitude: number;
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pollutants: PollutantDetails;
  temperature: number;
  humidity: number;
  windSpeed: number;
  inversionRisk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  ventilationWindow: {
    startHour: number;
    endHour: number;
    recommended: boolean;
    note: string;
  };
  hourly: HourlyForecastItem[];
  timestamp: string;
}

export type DwellingType = 'high_rise_apartment' | 'low_rise_apartment' | 'independent_house' | 'compact_settlement';
export type CommuteMode = 'bike_two_wheeler' | 'car_solo' | 'carpool' | 'metro_subway' | 'bus' | 'walking_cycling' | 'work_from_home';
export type CookingEnergy = 'lpg_gas' | 'electric_induction' | 'biomass_wood' | 'piped_natural_gas';
export type HeatingType = 'electric_oil_radiator' | 'electric_hot_blower' | 'wood_fireplace' | 'lpg_heater' | 'none';

export interface HouseholdProfile {
  cityName: string;
  latitude: number;
  longitude: number;
  dwellingType: DwellingType;
  floorLevel: number;
  hasAirPurifier: boolean;
  purifierCount: number;
  hasExhaustFans: boolean;
  sealedWindows: boolean;
  commuteMode: CommuteMode;
  dailyCommuteKm: number;
  cookingEnergy: CookingEnergy;
  heatingType: HeatingType;
  vulnerableMembers: {
    infantsOrToddlers: boolean;
    elderly: boolean;
    asthmaOrRespiratory: boolean;
    pregnant: boolean;
    pets: boolean;
  };
  activeHacks: string[];
}

export interface RoutineItem {
  id: string;
  timeSlot: string;
  title: string;
  standardHabit: string;
  lowEmissionAlternative: string;
  exposureReductionPct: number;
  co2SavedKg: number;
  category: 'commute' | 'indoor' | 'errand' | 'community' | 'exercise';
  status: 'pending' | 'completed' | 'skipped';
  urgency: 'routine' | 'warning' | 'critical';
  explanation: string;
}

export interface IAQHack {
  id: string;
  title: string;
  shortDesc: string;
  difficulty: 'Easy (5 min)' | 'Moderate (30 min)' | 'Weekend Project';
  costTier: 'Free' | '$' | '$$';
  estimatedCost: string;
  pm25ReductionPct: number;
  materialsNeeded: string[];
  steps: string[];
  physicsExplanation: string;
  applicableDwellings: DwellingType[];
  badge: string;
}

export interface CADRCalculation {
  roomLengthFeet: number;
  roomWidthFeet: number;
  ceilingHeightFeet: number;
  roomVolumeCuFt: number;
  desiredACH: number; // Air changes per hour
  requiredCADR: number; // Clean Air Delivery Rate in CFM
  boxFanCFM: number;
  filterRating: 'MERV 13' | 'MERV 14' | 'HEPA H13';
  numberOfFilters: 1 | 2 | 4 | 5; // Corsi-Rosenthal configuration
  effectiveCADR: number;
  achAchieved: number;
  adequacyStatus: 'Underpowered' | 'Adequate' | 'Hospital Grade';
}

export interface ImpactMetrics {
  totalPM25ExposurePreventedUg: number;
  cigarettesAvoidedEquivalent: number;
  co2ePreventedKg: number;
  activeSustainableChoicesCount: number;
  indoorAQIImprovementPct: number;
  healthRiskReductionScore: number; // 0 - 100
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; payload: string }[];
  isEmergencyAlert?: boolean;
}

export interface CommunityReport {
  id: string;
  title: string;
  type: 'waste_burning' | 'generator_smoke' | 'construction_dust' | 'clean_air_space_available';
  location: string;
  timeReported: string;
  status: 'active' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  upvotes: number;
}
