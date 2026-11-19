import React, { createContext, useContext, useState, useEffect } from 'react';
import { AQIData, HouseholdProfile, ImpactMetrics, RoutineItem } from '../types';
import { PRESET_CITIES } from '../data/presetCities';
import { DEFAULT_ROUTINE_ITEMS } from '../data/routineTemplates';
import { fetchLiveAQI, getFallbackWinterAQI } from '../services/aqiService';
import { calculateDirectImpact } from '../services/impactEngine';

interface HouseholdContextType {
  profile: HouseholdProfile;
  updateProfile: (updates: Partial<HouseholdProfile>) => void;
  aqiData: AQIData;
  isLoadingAQI: boolean;
  routineItems: RoutineItem[];
  toggleRoutineItem: (id: string) => void;
  toggleHack: (hackId: string) => void;
  impactMetrics: ImpactMetrics;
  selectedCityId: string;
  selectCityById: (cityId: string) => void;
  refreshAQI: () => Promise<void>;
  setCustomCoordinates: (lat: number, lon: number, name: string) => Promise<void>;
}

const DEFAULT_PROFILE: HouseholdProfile = {
  cityName: 'New Delhi (NCR)',
  latitude: 28.6139,
  longitude: 77.2090,
  dwellingType: 'high_rise_apartment',
  floorLevel: 6,
  hasAirPurifier: true,
  purifierCount: 1,
  hasExhaustFans: true,
  sealedWindows: false,
  commuteMode: 'metro_subway',
  dailyCommuteKm: 18,
  cookingEnergy: 'lpg_gas',
  heatingType: 'electric_oil_radiator',
  vulnerableMembers: {
    infantsOrToddlers: true,
    elderly: true,
    asthmaOrRespiratory: false,
    pregnant: false,
    pets: false,
  },
  activeHacks: ['corsi-rosenthal', 'wet-mopping-physics', 'inversion-ventilation'],
};

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<HouseholdProfile>(() => {
    const saved = localStorage.getItem('aurashield_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PROFILE;
  });

  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [isLoadingAQI, setIsLoadingAQI] = useState<boolean>(true);
  const [aqiData, setAqiData] = useState<AQIData>(() => {
    return getFallbackWinterAQI(DEFAULT_PROFILE.latitude, DEFAULT_PROFILE.longitude, DEFAULT_PROFILE.cityName);
  });

  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem('aurashield_routines');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_ROUTINE_ITEMS;
  });

  // Save profile changes
  const updateProfile = (updates: Partial<HouseholdProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('aurashield_profile', JSON.stringify(next));
      return next;
    });
  };

  // Toggle hack
  const toggleHack = (hackId: string) => {
    setProfile(prev => {
      const exists = prev.activeHacks.includes(hackId);
      const activeHacks = exists
        ? prev.activeHacks.filter(id => id !== hackId)
        : [...prev.activeHacks, hackId];
      const next = { ...prev, activeHacks };
      localStorage.setItem('aurashield_profile', JSON.stringify(next));
      return next;
    });
  };

  // Toggle routine item
  const toggleRoutineItem = (id: string) => {
    setRoutineItems(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
          return { ...item, status: nextStatus as 'completed' | 'pending' };
        }
        return item;
      });
      localStorage.setItem('aurashield_routines', JSON.stringify(next));
      return next;
    });
  };

  // Refresh AQI
  const refreshAQI = async () => {
    setIsLoadingAQI(true);
    try {
      const data = await fetchLiveAQI(profile.latitude, profile.longitude, profile.cityName);
      setAqiData(data);
    } catch (err) {
      console.error('Failed to load AQI', err);
    } finally {
      setIsLoadingAQI(false);
    }
  };

  // Select city by preset ID
  const selectCityById = async (cityId: string) => {
    setSelectedCityId(cityId);
    const city = PRESET_CITIES.find(c => c.id === cityId);
    if (city) {
      updateProfile({
        cityName: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      });
      setIsLoadingAQI(true);
      const data = await fetchLiveAQI(city.latitude, city.longitude, city.name);
      setAqiData(data);
      setIsLoadingAQI(false);
    }
  };

  // Set custom coordinates
  const setCustomCoordinates = async (lat: number, lon: number, name: string) => {
    updateProfile({
      cityName: name,
      latitude: lat,
      longitude: lon,
    });
    setSelectedCityId('custom');
    setIsLoadingAQI(true);
    const data = await fetchLiveAQI(lat, lon, name);
    setAqiData(data);
    setIsLoadingAQI(false);
  };

  // Initial load
  useEffect(() => {
    refreshAQI();
  }, [profile.latitude, profile.longitude]);

  // Compute live impact metrics
  const impactMetrics = calculateDirectImpact(
    profile,
    aqiData.aqi,
    aqiData.pollutants.pm2_5,
    routineItems,
    profile.activeHacks.length
  );

  return (
    <HouseholdContext.Provider
      value={{
        profile,
        updateProfile,
        aqiData,
        isLoadingAQI,
        routineItems,
        toggleRoutineItem,
        toggleHack,
        impactMetrics,
        selectedCityId,
        selectCityById,
        refreshAQI,
        setCustomCoordinates,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within HouseholdProvider');
  }
  return context;
};
