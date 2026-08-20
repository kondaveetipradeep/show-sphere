import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Check, 
  Crosshair,
  Loader2
} from 'lucide-react';
import { City, UserLocation } from '../types';
import { CITIES } from '../data/mockData';

interface MobileCityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (cityName: string) => void;
  userLocation: UserLocation | null;
  isLocating: boolean;
  onDetectLocation: () => void;
  getDistanceToCity?: (city: City) => number | null;
}

export const MobileCityDrawer: React.FC<MobileCityDrawerProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
  isLocating,
  onDetectLocation,
}) => {
  const [citySearch, setCitySearch] = useState('');

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return CITIES;
    const q = citySearch.toLowerCase();
    return CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q));
  }, [citySearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-w-md w-full mx-auto max-h-[85vh] flex flex-col space-y-4 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Select City
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Use Current GPS Location Button */}
        <button
          onClick={() => {
            onDetectLocation();
            onClose();
          }}
          disabled={isLocating}
          className="w-full p-3 rounded-xl bg-rose-50/80 border border-rose-200 hover:bg-rose-100/80 flex items-center justify-between text-left transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-4 h-4 text-rose-600" />
            <div>
              <div className="text-xs font-bold text-rose-900">Auto-Detect My Location</div>
              <div className="text-[11px] text-rose-600">Using device GPS sensor</div>
            </div>
          </div>
          {isLocating && <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />}
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search your city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition"
          />
        </div>

        {/* Popular Cities Grid */}
        <div className="flex-1 overflow-y-auto space-y-1 max-h-64 pr-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1">
            Cities
          </div>
          {filteredCities.map((city) => {
            const isSelected = city.name.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => {
                  onSelectCity(city.name);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-rose-50 border border-rose-300 text-rose-900 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{city.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({city.state})</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
