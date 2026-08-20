import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Loader2, 
  Volume2, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Compass,
  Clock,
  Ticket
} from 'lucide-react';
import { Venue, UserLocation } from '../types';
import { formatDistance, getEstimatedDriveTime } from '../utils/geolocation';

interface NearestTheatersBannerProps {
  currentCity: string;
  venues: Venue[];
  userLocation: UserLocation | null;
  isLocating: boolean;
  onDetectLocation: () => void;
  onSelectVenue?: (venue: Venue) => void;
}

export const NearestTheatersBanner: React.FC<NearestTheatersBannerProps> = ({
  currentCity,
  venues,
  userLocation,
  isLocating,
  onDetectLocation,
  onSelectVenue,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<'all' | '5km' | '10km'>('all');
  const isGpsActive = userLocation?.source === 'gps';

  const filteredVenues = venues.filter((v) => {
    if (selectedRadius === '5km') return (v.distanceKm ?? 999) <= 5;
    if (selectedRadius === '10km') return (v.distanceKm ?? 999) <= 10;
    return true;
  }).slice(0, 4); // Top closest 4 theaters

  return (
    <section className="mb-10 max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 rounded-3xl border border-slate-800 p-5 md:p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Navigation className={`w-4 h-4 ${isGpsActive ? 'animate-pulse fill-rose-400' : ''}`} />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Theaters Nearest To Your Mobile</span>
                {isGpsActive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    Live GPS
                  </span>
                )}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {userLocation 
                ? `Sorted in real-time by closest distance to ${userLocation.neighborhood || userLocation.city}` 
                : `Showing the premier screens in ${currentCity}`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Radius filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedRadius('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRadius === 'all' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedRadius('5km')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRadius === '5km' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                &lt; 5 km
              </button>
              <button
                onClick={() => setSelectedRadius('10km')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRadius === '10km' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                &lt; 10 km
              </button>
            </div>

            {/* Fast Detect Button */}
            <button
              onClick={onDetectLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              <span>{isLocating ? 'Locating...' : 'Refresh GPS'}</span>
            </button>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {filteredVenues.map((venue, idx) => {
            const isClosest = idx === 0;
            return (
              <div
                key={venue.id}
                onClick={() => onSelectVenue && onSelectVenue(venue)}
                className={`group p-4 rounded-2xl bg-slate-950/70 border transition cursor-pointer flex flex-col justify-between space-y-3 relative hover:shadow-xl ${
                  isClosest 
                    ? 'border-rose-500/40 hover:border-rose-500 shadow-lg shadow-rose-950/30' 
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {isClosest && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow">
                    Closest
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {venue.chain}
                    </span>
                    {venue.distanceKm !== undefined && (
                      <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {formatDistance(venue.distanceKm)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-rose-300 transition line-clamp-2">
                    {venue.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {venue.address}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Est. {getEstimatedDriveTime(venue.distanceKm || 2)} drive</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-cyan-400 font-medium line-clamp-1">
                    {venue.soundSystem.split(' ')[0]} {venue.soundSystem.split(' ')[1]}
                  </span>
                  <div className="flex items-center gap-1 text-rose-400 font-semibold group-hover:translate-x-0.5 transition text-[11px]">
                    <span>View Shows</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
