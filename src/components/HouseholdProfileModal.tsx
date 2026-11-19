import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { 
  X, 
  Home, 
  Users, 
  Car, 
  Flame, 
  Wind, 
  Save, 
  CheckCircle2, 
  Baby, 
  ShieldAlert 
} from 'lucide-react';
import { CommuteMode, CookingEnergy, DwellingType, HeatingType } from '../types';

interface HouseholdProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseholdProfileModal: React.FC<HouseholdProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useHousehold();
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          aria-label="Close Profile Settings"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Household & Lifestyle Profile</h2>
            <p className="text-xs text-slate-400">Personalize AI routines and impact metrics for your living conditions.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Dwelling & Building */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-400" />
              1. Dwelling & Ventilation Physics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Housing Architecture</label>
                <select
                  value={formData.dwellingType}
                  onChange={(e) => setFormData({ ...formData, dwellingType: e.target.value as DwellingType })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="high_rise_apartment">High-Rise Apartment (Floors 5+)</option>
                  <option value="low_rise_apartment">Low-Rise Apartment (Floors 1-4)</option>
                  <option value="independent_house">Independent House / Ground Villa</option>
                  <option value="compact_settlement">Compact Urban Settlement / Slum</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Floor Level: {formData.floorLevel}</label>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={formData.floorLevel}
                  onChange={(e) => setFormData({ ...formData, floorLevel: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
                <span className="text-[10px] text-slate-400">Ground level experiences highest diesel & dust settling.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAirPurifier}
                  onChange={(e) => setFormData({ ...formData, hasAirPurifier: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span>Air Purifier in Home</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sealedWindows}
                  onChange={(e) => setFormData({ ...formData, sealedWindows: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span>Weather-Sealed Windows</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasExhaustFans}
                  onChange={(e) => setFormData({ ...formData, hasExhaustFans: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                />
                <span>Kitchen Exhaust Fan</span>
              </label>
            </div>
          </div>

          {/* Section 2: Vulnerable Family Demographics */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-rose-400" />
              2. Vulnerable Household Members
            </h3>
            <p className="text-[11px] text-slate-400">
              Select members present so the AI can elevate protective urgency thresholds.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vulnerableMembers.infantsOrToddlers}
                  onChange={(e) => setFormData({
                    ...formData,
                    vulnerableMembers: { ...formData.vulnerableMembers, infantsOrToddlers: e.target.checked }
                  })}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <span>Infants / Under 5</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vulnerableMembers.elderly}
                  onChange={(e) => setFormData({
                    ...formData,
                    vulnerableMembers: { ...formData.vulnerableMembers, elderly: e.target.checked }
                  })}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <span>Elderly (65+)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vulnerableMembers.asthmaOrRespiratory}
                  onChange={(e) => setFormData({
                    ...formData,
                    vulnerableMembers: { ...formData.vulnerableMembers, asthmaOrRespiratory: e.target.checked }
                  })}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <span>Asthma / COPD</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vulnerableMembers.pregnant}
                  onChange={(e) => setFormData({
                    ...formData,
                    vulnerableMembers: { ...formData.vulnerableMembers, pregnant: e.target.checked }
                  })}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <span>Pregnant</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vulnerableMembers.pets}
                  onChange={(e) => setFormData({
                    ...formData,
                    vulnerableMembers: { ...formData.vulnerableMembers, pets: e.target.checked }
                  })}
                  className="rounded text-rose-500 accent-rose-500"
                />
                <span>Pets (Dogs/Cats)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Commute & Energy */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-teal-400" />
              3. Daily Commute & Cooking Fuel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Daily Commute Mode</label>
                <select
                  value={formData.commuteMode}
                  onChange={(e) => setFormData({ ...formData, commuteMode: e.target.value as CommuteMode })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="metro_subway">Electric Metro / Subway Train</option>
                  <option value="carpool">Carpool (3+ passengers)</option>
                  <option value="car_solo">Solo Petrol/Diesel Car</option>
                  <option value="bike_two_wheeler">Motorcycle / Two-Wheeler</option>
                  <option value="bus">Public City Bus</option>
                  <option value="walking_cycling">Walking / Cycling</option>
                  <option value="work_from_home">Work From Home (Zero Commute)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Roundtrip Commute: {formData.dailyCommuteKm} km/day
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={formData.dailyCommuteKm}
                  onChange={(e) => setFormData({ ...formData, dailyCommuteKm: Number(e.target.value) })}
                  className="w-full accent-teal-500 cursor-pointer mt-2"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Kitchen Cooking Energy</label>
                <select
                  value={formData.cookingEnergy}
                  onChange={(e) => setFormData({ ...formData, cookingEnergy: e.target.value as CookingEnergy })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="electric_induction">Electric Induction / Radiant</option>
                  <option value="piped_natural_gas">Piped Natural Gas (PNG)</option>
                  <option value="lpg_gas">LPG Cylinder Gas</option>
                  <option value="biomass_wood">Biomass / Charcoal / Wood</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Winter Space Heating</label>
                <select
                  value={formData.heatingType}
                  onChange={(e) => setFormData({ ...formData, heatingType: e.target.value as HeatingType })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="electric_oil_radiator">Electric Oil-Filled Radiator (Clean)</option>
                  <option value="electric_hot_blower">Electric Ceramic Blower</option>
                  <option value="wood_fireplace">Wood Fireplace (Heavy PM2.5)</option>
                  <option value="lpg_heater">Unvented Gas Heater</option>
                  <option value="none">No Space Heating Needed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">Updates immediately recalculate your Impact Mirror.</span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
