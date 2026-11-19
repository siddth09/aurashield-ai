export interface PresetCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  typicalWinterAQI: number;
  keySources: string;
}

export const PRESET_CITIES: PresetCity[] = [
  {
    id: 'delhi',
    name: 'New Delhi (NCR)',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    typicalWinterAQI: 385,
    keySources: 'Thermal inversion, crop residue burning, vehicular traffic, construction dust',
  },
  {
    id: 'lahore',
    name: 'Lahore',
    country: 'Pakistan',
    latitude: 31.5497,
    longitude: 74.3436,
    typicalWinterAQI: 395,
    keySources: 'Brick kilns, winter low-level inversion, biomass burning, 2-stroke engines',
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    typicalWinterAQI: 165,
    keySources: 'Coal district heating, industrial emissions, surrounding mountain basin trapping',
  },
  {
    id: 'saltlake',
    name: 'Salt Lake City, UT',
    country: 'USA',
    latitude: 40.7608,
    longitude: -111.8910,
    typicalWinterAQI: 145,
    keySources: 'Persistent cold-air pool inversions trapped against the Wasatch Range',
  },
  {
    id: 'katowice',
    name: 'Katowice / Silesia',
    country: 'Poland',
    latitude: 50.2649,
    longitude: 19.0238,
    typicalWinterAQI: 160,
    keySources: 'Domestic coal boiler heating ("smokers"), stagnant winter anticyclone',
  },
  {
    id: 'milan',
    name: 'Milan (Po Valley)',
    country: 'Italy',
    latitude: 45.4642,
    longitude: 9.1900,
    typicalWinterAQI: 130,
    keySources: 'Po Valley geographical basin, low wind circulation, agricultural ammonia + diesel',
  },
  {
    id: 'dhaka',
    name: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.8103,
    longitude: 90.4125,
    typicalWinterAQI: 310,
    keySources: 'Unregulated brick kilns, unpaved road dust, high traffic congestion',
  },
  {
    id: 'ulaanbaatar',
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    latitude: 47.9184,
    longitude: 106.9177,
    typicalWinterAQI: 410,
    keySources: 'Ger district raw coal stoves during -30°C winter inversion',
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    latitude: 51.5074,
    longitude: -0.1278,
    typicalWinterAQI: 65,
    keySources: 'Domestic wood burning stoves, diesel NO2, stagnant winter high pressure',
  }
];
