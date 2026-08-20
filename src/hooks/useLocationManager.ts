import { useState, useEffect, useCallback, useMemo } from 'react';
import { City, Coordinates, UserLocation, Venue } from '../types';
import { CITIES, MOCK_VENUES } from '../data/mockData';
import { 
  requestMobileLocation, 
  getCachedUserLocation, 
  getVenuesSortedByProximity, 
  findNearestCity,
  calculateDistanceKm
} from '../utils/geolocation';

export interface UseLocationManagerReturn {
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: string | null;
  isGpsActive: boolean;
  currentCity: string;
  setCurrentCity: (city: string) => void;
  detectLocation: (showPrompt?: boolean) => Promise<UserLocation | null>;
  setCityWithPresetCoords: (cityName: string) => void;
  getDynamicVenues: (selectedCity?: string) => Venue[];
  getDistanceToCity: (city: City) => number | null;
}

export function useLocationManager(initialCity: string = 'Hyderabad'): UseLocationManagerReturn {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => getCachedUserLocation());
  const [currentCity, setCurrentCity] = useState<string>(() => {
    const cached = getCachedUserLocation();
    return cached?.city || initialCity;
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Manual / on-demand GPS location detection
  const detectLocation = useCallback(async (_showPrompt: boolean = true): Promise<UserLocation | null> => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const loc = await requestMobileLocation();
      setUserLocation(loc);
      if (loc.city) {
        setCurrentCity(loc.city);
      }
      setIsLocating(false);
      return loc;
    } catch (err: any) {
      console.warn('Geolocation lookup notice:', err?.message || err);
      setLocationError(err?.message || 'Could not fetch device location.');
      setIsLocating(false);
      return null;
    }
  }, []);

  // Set city with preset fallback coords if user selects manually
  const setCityWithPresetCoords = useCallback((cityName: string) => {
    setCurrentCity(cityName);
    const cityMatch = CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    if (cityMatch && cityMatch.coordinates) {
      const updatedLoc: UserLocation = {
        lat: cityMatch.coordinates.lat,
        lng: cityMatch.coordinates.lng,
        city: cityMatch.name,
        state: cityMatch.state,
        neighborhood: cityMatch.name,
        formattedAddress: `${cityMatch.name}, ${cityMatch.state}`,
        source: 'manual',
        timestamp: Date.now(),
      };
      setUserLocation(updatedLoc);
      try {
        localStorage.setItem('showsphere_user_location', JSON.stringify(updatedLoc));
      } catch (_) {}
    }
  }, []);

  // Compute dynamic venues sorted by proximity to current user coords
  const getDynamicVenues = useCallback((selectedCity?: string): Venue[] => {
    const activeCity = selectedCity || currentCity;
    const coords: Coordinates | null = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null;
    return getVenuesSortedByProximity(coords, activeCity, MOCK_VENUES);
  }, [currentCity, userLocation]);

  // Distance to a city from current coords
  const getDistanceToCity = useCallback((city: City): number | null => {
    if (!userLocation || !city.coordinates) return null;
    return calculateDistanceKm(userLocation.lat, userLocation.lng, city.coordinates.lat, city.coordinates.lng);
  }, [userLocation]);

  const isGpsActive = userLocation?.source === 'gps';

  return {
    userLocation,
    isLocating,
    locationError,
    isGpsActive,
    currentCity,
    setCurrentCity,
    detectLocation,
    setCityWithPresetCoords,
    getDynamicVenues,
    getDistanceToCity,
  };
}
