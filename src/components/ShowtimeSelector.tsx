import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Volume2, 
  Info, 
  Navigation, 
  Crosshair, 
  Loader2, 
  Compass 
} from 'lucide-react';
import { MediaItem, Showtime, Venue, Currency, UserLocation } from '../types';
import { MOCK_VENUES, MOCK_SHOWTIMES } from '../data/mockData';
import { formatPrice } from '../utils/formatters';
import { getVenuesSortedByProximity, formatDistance, getEstimatedDriveTime } from '../utils/geolocation';

interface ShowtimeSelectorProps {
  media: MediaItem;
  currentCity: string;
  currency: Currency;
  userLocation: UserLocation | null;
  isLocating?: boolean;
  onDetectLocation?: () => void;
  onSelectShowtime: (showtime: Showtime, venue: Venue) => void;
}

export const ShowtimeSelector: React.FC<ShowtimeSelectorProps> = ({
  media,
  currentCity,
  currency,
  userLocation,
  isLocating = false,
  onDetectLocation,
  onSelectShowtime,
}) => {
  const dates = [
    { date: '2026-08-20', day: 'TODAY', label: '20 AUG' },
    { date: '2026-08-21', day: 'FRI', label: '21 AUG' },
    { date: '2026-08-22', day: 'SAT', label: '22 AUG' },
    { date: '2026-08-23', day: 'SUN', label: '23 AUG' },
    { date: '2026-08-24', day: 'MON', label: '24 AUG' },
  ];

  const [selectedDate, setSelectedDate] = useState('2026-08-20');
  const [selectedLang, setSelectedLang] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [distanceFilter, setDistanceFilter] = useState<'all' | '5km' | '10km' | '20km'>('all');

  // Filter showtimes for this media
  const relevantShowtimes = useMemo(() => {
    const shows = (MOCK_SHOWTIMES || []).filter((st) => st.mediaId === media.id);
    return shows.length > 0 ? shows : (MOCK_SHOWTIMES || []);
  }, [media.id]);

  // Compute dynamically sorted venues by proximity
  const sortedVenues = useMemo(() => {
    const coords = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null;
    let venues = getVenuesSortedByProximity(coords, currentCity, MOCK_VENUES);

    if (distanceFilter !== 'all') {
      const maxKm = distanceFilter === '5km' ? 5 : distanceFilter === '10km' ? 10 : 20;
      venues = venues.filter((v) => (v.distanceKm ?? 999) <= maxKm);
    }

    return venues;
  }, [userLocation, currentCity, distanceFilter]);

  // Group showtimes by venue
  const venuesWithShows = useMemo(() => {
    return sortedVenues.map((venue) => {
      let shows = relevantShowtimes.filter((st) => st.venueId === venue.id);

      if (selectedLang !== 'All') {
        shows = shows.filter((st) => st.language.toLowerCase() === selectedLang.toLowerCase());
      }
      if (selectedFormat !== 'All') {
        shows = shows.filter((st) => st.format.toLowerCase() === selectedFormat.toLowerCase());
      }

      return {
        venue,
        shows,
      };
    }).filter((v) => v.shows.length > 0);
  }, [sortedVenues, relevantShowtimes, selectedLang, selectedFormat]);

  const isGpsActive = userLocation?.source === 'gps';

  return (
    <div className="space-y-4 text-slate-800">
      {/* Geolocation Notice & Quick Radius Controls */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isGpsActive ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-200 text-slate-600'}`}>
            <Navigation className={`w-4 h-4 ${isGpsActive ? 'fill-rose-600' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Cinemas in {currentCity}</span>
              {isGpsActive && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                  Proximity Sorted
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {userLocation 
                ? `Closest venues near ${userLocation.neighborhood || userLocation.city} updated` 
                : 'Click detect to prioritize theaters nearest to you'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Radius selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] shadow-2xs">
            <button
              onClick={() => setDistanceFilter('all')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer ${distanceFilter === 'all' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setDistanceFilter('5km')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer ${distanceFilter === '5km' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              &lt;5km
            </button>
            <button
              onClick={() => setDistanceFilter('10km')}
              className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer ${distanceFilter === '10km' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              &lt;10km
            </button>
          </div>

          {onDetectLocation && (
            <button
              onClick={onDetectLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              <span>{isLocating ? 'Locating...' : 'GPS'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Date Selector Tabs */}
      <div className="bg-slate-100/80 p-2 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex-1 min-w-[72px] py-2 px-2.5 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
              selectedDate === d.date
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="text-[10px] uppercase font-semibold opacity-90">{d.day}</span>
            <span className="text-xs font-extrabold tracking-tight">{d.label}</span>
          </button>
        ))}
      </div>

      {/* Language & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-medium text-[11px]">Lang:</span>
          {['All', ...(media?.languages || ['English'])].map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`px-2.5 py-0.5 rounded-lg transition cursor-pointer text-xs font-medium ${
                selectedLang === l
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Filling Fast</span>
          </div>
        </div>
      </div>

      {/* Venues and Showtimes List */}
      <div className="space-y-3">
        {venuesWithShows.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-1">
            <Info className="w-5 h-5 mx-auto text-slate-400" />
            <p className="text-xs font-medium">No theaters found matching distance / filters for {selectedDate}</p>
          </div>
        ) : (
          venuesWithShows.map(({ venue, shows }, index) => {
            const isClosest = index === 0 && (venue.distanceKm !== undefined && venue.distanceKm <= 5);
            return (
              <div
                key={venue.id}
                className={`bg-white rounded-2xl border p-4 space-y-3 shadow-2xs transition ${
                  isClosest 
                    ? 'border-rose-300 ring-1 ring-rose-200' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Venue Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900">{venue.name}</h4>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                        {venue.chain}
                      </span>
                      {isClosest && (
                        <span className="px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-rose-600" />
                          Closest
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{venue.address}</span>
                      {venue.distanceKm !== undefined && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold font-mono">
                            📍 {formatDistance(venue.distanceKm)}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            ({getEstimatedDriveTime(venue.distanceKm)})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sound & Screen Specs */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0">
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      <Volume2 className="w-3 h-3 text-sky-600" />
                      <span className="font-mono text-[10px]">{venue.soundSystem.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {shows.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => onSelectShowtime(st, venue)}
                      className="group relative p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition cursor-pointer text-left flex flex-col justify-between space-y-1.5 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 tracking-tight">
                            {st.time}
                          </span>
                          {st.fillingFast && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
                              Fast
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {st.format} • {st.language}
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">
                          {formatPrice(st.basePrices.classic, currency)}
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          {st.availableSeats} left
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
