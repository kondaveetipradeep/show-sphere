import React, { useState } from 'react';
import { 
  MapPin, 
  Crosshair, 
  Loader2, 
  Search
} from 'lucide-react';
import { Venue, UserLocation, MediaItem, Showtime, Currency } from '../types';
import { MOCK_SHOWTIMES, MOCK_MEDIA } from '../data/mockData';
import { formatDistance } from '../utils/geolocation';
import { formatPrice } from '../utils/formatters';

interface NearbyTheatersViewProps {
  currentCity: string;
  venues: Venue[];
  userLocation: UserLocation | null;
  isLocating: boolean;
  onDetectLocation: () => void;
  currency: Currency;
  onSelectShowtime: (showtime: Showtime, venue: Venue, media: MediaItem) => void;
  onSelectMedia: (media: MediaItem) => void;
}

export const NearbyTheatersView: React.FC<NearbyTheatersViewProps> = ({
  currentCity,
  venues,
  isLocating,
  onDetectLocation,
  currency,
  onSelectShowtime,
}) => {
  const [selectedRadius, setSelectedRadius] = useState<'all' | '5km' | '10km'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-20');

  const dates = [
    { label: 'Today', sub: 'Aug 20', value: '2026-08-20' },
    { label: 'Tomorrow', sub: 'Aug 21', value: '2026-08-21' },
    { label: 'Saturday', sub: 'Aug 22', value: '2026-08-22' },
    { label: 'Sunday', sub: 'Aug 23', value: '2026-08-23' },
  ];

  // Filter venues
  const filteredVenues = venues.filter((v) => {
    if (selectedRadius === '5km' && (v.distanceKm ?? 999) > 5) return false;
    if (selectedRadius === '10km' && (v.distanceKm ?? 999) > 10) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pb-24 px-4 max-w-2xl mx-auto space-y-4">
      {/* City & GPS Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              Cinemas in {currentCity}
            </h2>
            <p className="text-xs text-slate-500">
              Select a cinema and showtime to pick seats
            </p>
          </div>

          <button
            onClick={onDetectLocation}
            disabled={isLocating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer disabled:opacity-50 transition"
          >
            {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
            <span>{isLocating ? 'Locating...' : 'Nearest to Me'}</span>
          </button>
        </div>

        {/* Search & Distance Chips */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cinema by name or area..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', '5km', '10km'] as const).map((rad) => (
              <button
                key={rad}
                onClick={() => setSelectedRadius(rad)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedRadius === rad
                    ? 'bg-rose-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {rad === 'all' ? 'All Distance' : `< ${rad}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {dates.map((d) => {
          const isSelected = selectedDate === d.value;
          return (
            <button
              key={d.value}
              onClick={() => setSelectedDate(d.value)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`text-xs font-bold ${isSelected ? 'text-rose-600' : 'text-slate-800'}`}>
                {d.label}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
                {d.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Theaters List */}
      <div className="space-y-3">
        {filteredVenues.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs shadow-sm">
            No cinemas found matching your filter.
          </div>
        ) : (
          filteredVenues.map((venue) => {
            const venueShowtimes = MOCK_SHOWTIMES.filter((st) => st.venueId === venue.id && st.date === selectedDate);

            return (
              <div
                key={venue.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{venue.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{venue.address}</span>
                    </p>
                  </div>

                  {venue.distanceKm !== undefined && (
                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                        {formatDistance(venue.distanceKm)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sound & Amenities */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 font-medium">
                    {venue.soundSystem}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                    {venue.chain}
                  </span>
                </div>

                {/* Showtimes */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Available Showtimes:
                  </div>

                  {venueShowtimes.length === 0 ? (
                    <div className="text-xs text-slate-400 py-1">
                      No shows available for this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {venueShowtimes.map((st) => {
                        const media = MOCK_MEDIA.find((m) => m.id === st.mediaId) || MOCK_MEDIA[0];
                        return (
                          <button
                            key={st.id}
                            onClick={() => onSelectShowtime(st, venue, media)}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition cursor-pointer flex flex-col space-y-0.5 group shadow-2xs"
                          >
                            <div className="text-xs font-bold text-rose-600 group-hover:text-rose-700">
                              {st.time}
                            </div>
                            <div className="text-xs text-slate-800 font-medium truncate">
                              {media.title}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center justify-between">
                              <span>{st.format}</span>
                              <span className="text-emerald-700 font-semibold">{formatPrice(st.basePrices?.classic || 250, currency)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
