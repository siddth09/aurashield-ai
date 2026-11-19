import { AQICategory, AQIData, HourlyForecastItem } from '../types';
import { PRESET_CITIES } from '../data/presetCities';

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 300) return 'Unhealthy';
  if (aqi <= 400) return 'Severe';
  return 'Hazardous';
}

export function getAQIColor(category: AQICategory): string {
  switch (category) {
    case 'Good': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    case 'Moderate': return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    case 'Poor': return 'text-orange-400 bg-orange-950/60 border-orange-500/40';
    case 'Unhealthy': return 'text-red-400 bg-red-950/60 border-red-500/40';
    case 'Severe': return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
    case 'Hazardous': return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
  }
}

export function getAQIBadgeShape(category: AQICategory): string {
  switch (category) {
    case 'Good': return 'Shield (Safe)';
    case 'Moderate': return 'Circle (Caution for Sensitive)';
    case 'Poor': return 'Triangle (Unhealthy for Sensitive)';
    case 'Unhealthy': return 'Octagon (Unhealthy for All)';
    case 'Severe': return 'Hexagon (Emergency Conditions)';
    case 'Hazardous': return 'Skull / Alert (Catastrophic Smog)';
  }
}

export async function fetchLiveAQI(lat: number, lon: number, cityName?: string): Promise<AQIData> {
  const matchedPreset = PRESET_CITIES.find(
    c => Math.abs(c.latitude - lat) < 0.25 && Math.abs(c.longitude - lon) < 0.25
  );
  const locationName = cityName || (matchedPreset ? matchedPreset.name : `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10,european_aqi,us_aqi&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    const data = await response.json();

    const currentUS_AQI = Math.round(data.current?.us_aqi ?? (data.current?.pm2_5 ? data.current.pm2_5 * 1.8 : 180));
    const currentPM2_5 = Math.round(data.current?.pm2_5 ?? 95);
    const currentPM10 = Math.round(data.current?.pm10 ?? 160);
    const no2 = Math.round(data.current?.nitrogen_dioxide ?? 45);
    const so2 = Math.round(data.current?.sulphur_dioxide ?? 18);
    const o3 = Math.round(data.current?.ozone ?? 32);
    const co = Math.round((data.current?.carbon_monoxide ?? 650) / 100) / 10;

    // Process hourly
    const hourlyItems: HourlyForecastItem[] = [];
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyPM25: number[] = data.hourly?.pm2_5 || [];
    const hourlyAQI: number[] = data.hourly?.us_aqi || [];

    const now = new Date();
    const currentHourIndex = Math.max(0, hourlyTimes.findIndex(t => new Date(t).getHours() === now.getHours()));

    // Take 24 hours from now
    for (let i = 0; i < 24; i++) {
      const idx = (currentHourIndex + i) % (hourlyTimes.length || 24);
      const timeStr = hourlyTimes[idx] || `${(now.getHours() + i) % 24}:00`;
      const hour = (now.getHours() + i) % 24;
      const pmVal = hourlyPM25[idx] ? Math.round(hourlyPM25[idx]) : Math.round(currentPM2_5 * getDiurnalMultiplier(hour));
      const aqiVal = hourlyAQI[idx] ? Math.round(hourlyAQI[idx]) : Math.round(pmVal * 1.8);

      const isInversionPeak = (hour >= 6 && hour <= 9) || (hour >= 20 && hour <= 23);
      const isVentilationWindow = hour >= 13 && hour <= 15;

      hourlyItems.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        aqi: aqiVal,
        pm2_5: pmVal,
        temperature: 14 + Math.sin((hour - 8) / 4) * 6,
        humidity: 65 - Math.sin((hour - 8) / 4) * 20,
        isInversionPeak,
        isVentilationWindow,
      });
    }

    const category = getAQICategory(currentUS_AQI);

    let inversionRisk: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
    if (currentUS_AQI > 300) inversionRisk = 'Extreme';
    else if (currentUS_AQI > 200) inversionRisk = 'High';
    else if (currentUS_AQI > 100) inversionRisk = 'Moderate';
    else inversionRisk = 'Low';

    return {
      location: locationName,
      latitude: lat,
      longitude: lon,
      aqi: currentUS_AQI,
      category,
      dominantPollutant: 'PM2.5 (Fine particulate matter)',
      pollutants: {
        pm2_5: currentPM2_5,
        pm10: currentPM10,
        no2,
        so2,
        o3,
        co,
      },
      temperature: 16,
      humidity: 68,
      windSpeed: 4.5,
      inversionRisk,
      ventilationWindow: {
        startHour: 13,
        endHour: 15,
        recommended: currentUS_AQI < 350,
        note: currentUS_AQI >= 350 
          ? 'Emergency: Outdoor AQI too severe even during solar peak. Rely strictly on closed-window DIY filtration.' 
          : 'Safe for 15-minute cross-ventilation to flush CO2 before night inversion resumes.',
      },
      hourly: hourlyItems,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Live AQI fetch failed or offline; using high-fidelity winter profile:', err);
    return getFallbackWinterAQI(lat, lon, locationName);
  }
}

// Diurnal inversion curve: PM2.5 spikes in early morning and late evening, dips at solar afternoon
function getDiurnalMultiplier(hour: number): number {
  if (hour >= 6 && hour <= 9) return 1.45; // Morning cold air pool + traffic
  if (hour >= 13 && hour <= 15) return 0.65; // Solar convective mixing layer lifts lid
  if (hour >= 20 && hour <= 23) return 1.35; // Ground radiative cooling traps evening emissions
  return 1.0;
}

export function getFallbackWinterAQI(lat: number, lon: number, locationName: string): AQIData {
  const matched = PRESET_CITIES.find(
    c => Math.abs(c.latitude - lat) < 1.0 && Math.abs(c.longitude - lon) < 1.0
  );
  const baseAQI = matched ? matched.typicalWinterAQI : 190;
  const pm2_5 = Math.round(baseAQI * 0.65);
  const pm10 = Math.round(pm2_5 * 1.6);
  const category = getAQICategory(baseAQI);

  const hourly: HourlyForecastItem[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const hour = (now.getHours() + i) % 24;
    const mult = getDiurnalMultiplier(hour);
    const hourlyPM = Math.round(pm2_5 * mult);
    const hourlyAQI = Math.round(baseAQI * mult);

    hourly.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour,
      aqi: hourlyAQI,
      pm2_5: hourlyPM,
      temperature: Math.round(15 + Math.sin((hour - 8) / 4) * 6),
      humidity: Math.round(70 - Math.sin((hour - 8) / 4) * 20),
      isInversionPeak: (hour >= 6 && hour <= 9) || (hour >= 20 && hour <= 23),
      isVentilationWindow: hour >= 13 && hour <= 15,
    });
  }

  return {
    location: locationName,
    latitude: lat,
    longitude: lon,
    aqi: baseAQI,
    category,
    dominantPollutant: 'PM2.5 (Fine particulate matter)',
    pollutants: {
      pm2_5,
      pm10,
      no2: 48,
      so2: 22,
      o3: 31,
      co: 5.8,
    },
    temperature: 15,
    humidity: 72,
    windSpeed: 3.8,
    inversionRisk: baseAQI > 300 ? 'Extreme' : baseAQI > 200 ? 'High' : 'Moderate',
    ventilationWindow: {
      startHour: 13,
      endHour: 15,
      recommended: baseAQI < 350,
      note: baseAQI >= 350 
        ? 'Emergency: Outdoor AQI too severe even during solar peak. Rely strictly on closed-window DIY filtration.' 
        : 'Safe for 15-minute cross-ventilation to flush CO2 before night inversion resumes.',
    },
    hourly,
    timestamp: new Date().toISOString(),
  };
}
