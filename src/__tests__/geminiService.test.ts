import { describe, it, expect } from 'vitest';
import { generateHeuristicResponse, generateCommunityNoticeText } from '../services/geminiService';
import { AQIData, HouseholdProfile } from '../types';

describe('Aura Copilot & GenAI Engine', () => {
  const dummyAQI: AQIData = {
    location: 'New Delhi (NCR)',
    latitude: 28.6139,
    longitude: 77.209,
    aqi: 380,
    category: 'Severe',
    dominantPollutant: 'PM2.5',
    pollutants: {
      pm2_5: 240,
      pm10: 380,
      no2: 65,
      so2: 24,
      o3: 28,
      co: 4.8,
    },
    temperature: 14,
    humidity: 75,
    windSpeed: 3.2,
    inversionRisk: 'Extreme',
    ventilationWindow: {
      startHour: 13,
      endHour: 15,
      recommended: false,
      note: 'Emergency: Outdoor AQI too severe even during solar peak.',
    },
    hourly: [],
    timestamp: new Date().toISOString(),
  };

  const dummyProfile: HouseholdProfile = {
    cityName: 'New Delhi (NCR)',
    latitude: 28.6139,
    longitude: 77.209,
    dwellingType: 'high_rise_apartment',
    floorLevel: 6,
    hasAirPurifier: true,
    purifierCount: 1,
    hasExhaustFans: true,
    sealedWindows: false,
    commuteMode: 'metro_subway',
    dailyCommuteKm: 18,
    cookingEnergy: 'electric_induction',
    heatingType: 'electric_oil_radiator',
    vulnerableMembers: {
      infantsOrToddlers: true,
      elderly: true,
      asthmaOrRespiratory: true,
      pregnant: false,
      pets: false,
    },
    activeHacks: ['corsi-rosenthal', 'wet-mopping-physics'],
  };

  it('triggers emergency alert flag and non-medical triage for cough/wheezing queries', () => {
    const res = generateHeuristicResponse('My toddler has a cough and chest wheezing in this smog', dummyAQI, dummyProfile);
    expect(res.isEmergencyAlert).toBe(true);
    expect(res.text).toContain('Immediate Smog Exposure Triage');
    expect(res.text).toContain('Clean Air Sanctuary Room');
    expect(res.text).toContain('Clinical Warning'); // because asthmaOrRespiratory is true in profile
    expect(res.suggestedActions?.length).toBeGreaterThan(0);
  });

  it('provides scientific boundary layer explanation for window ventilation queries', () => {
    const res = generateHeuristicResponse('When should I open my windows today for fresh air?', dummyAQI, dummyProfile);
    expect(res.text).toContain('Thermal Inversion Ventilation Protocol');
    expect(res.text).toContain('Do NOT open windows in early morning');
    expect(res.text).toContain('Solar Mixing');
  });

  it('details Corsi-Rosenthal construction and MERV 13 physics for DIY purifier queries', () => {
    const res = generateHeuristicResponse('How do I build a DIY air purifier filter box?', dummyAQI, dummyProfile);
    expect(res.text).toContain('Corsi-Rosenthal');
    expect(res.text).toContain('MERV 13');
    expect(res.text.toLowerCase()).toContain('box fan');
  });

  it('redirects exercise indoors and calculates transit benefits for commute queries', () => {
    const res = generateHeuristicResponse('Can I go jogging outside this evening?', dummyAQI, dummyProfile);
    expect(res.text).toContain('Cancel Outdoor Cardio');
    expect(res.text).toContain('alveolar');
  });

  it('generates official community notices with local AQI context', () => {
    const antiBurningNotice = generateCommunityNoticeText('Skyline Heights RWA', 'Delhi', 380, 'anti_burning');
    expect(antiBurningNotice).toContain('ZERO WASTE BURNING PROTOCOL');
    expect(antiBurningNotice).toContain('Skyline Heights RWA');
    expect(antiBurningNotice).toContain('380 AQI');

    const carpoolNotice = generateCommunityNoticeText('Skyline Heights RWA', 'Delhi', 380, 'carpool_initiative');
    expect(carpoolNotice).toContain('WINTER SMOG CARPOOL');
    expect(carpoolNotice).toContain('Cluster Carpools');

    const sanctuaryNotice = generateCommunityNoticeText('Skyline Heights RWA', 'Delhi', 380, 'clean_air_space');
    expect(sanctuaryNotice).toContain('CLEAN AIR SANCTUARY');
    expect(sanctuaryNotice).toContain('Corsi-Rosenthal');
  });
});
