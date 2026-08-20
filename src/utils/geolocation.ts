import { City, Coordinates, UserLocation, Venue } from '../types';
import { CITIES, MOCK_VENUES } from '../data/mockData';

/**
 * High-precision Haversine formula to compute great-circle distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Format distance in a user-friendly way (e.g., "650 m", "1.4 km", "12 km")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 0.95) {
    const meters = Math.max(100, Math.round(distanceKm * 1000 / 50) * 50);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Calculate estimated driving travel time based on distance in typical city traffic
 */
export function getDriveTimeEstimate(distanceKm: number): string {
  if (distanceKm < 1.5) return '~4-6 mins';
  if (distanceKm < 3.5) return '~8-12 mins';
  if (distanceKm < 7.0) return '~15-20 mins';
  if (distanceKm < 15.0) return '~25-35 mins';
  return `~${Math.round(distanceKm * 2.5)} mins`;
}

export const getEstimatedDriveTime = getDriveTimeEstimate;

/**
 * Find the closest matching city from the user coordinates.
 */
export function findNearestCity(lat: number, lng: number, cities: City[] = CITIES): { city: City; distanceKm: number } {
  let closestCity = cities[0];
  let minDistance = Infinity;

  for (const city of cities) {
    if (city.coordinates) {
      const dist = calculateDistanceKm(lat, lng, city.coordinates.lat, city.coordinates.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }
  }

  return { city: closestCity, distanceKm: minDistance };
}

/**
 * Recalculate dynamic distance from user coordinates to all venues and sort nearest-first.
 */
export function getVenuesSortedByProximity(
  userCoords: Coordinates | null,
  cityName?: string,
  venues: Venue[] = MOCK_VENUES
): Venue[] {
  let filtered = venues;
  if (cityName && cityName !== 'All') {
    filtered = venues.filter((v) => v.city.toLowerCase() === cityName.toLowerCase());
    // If no venues in that city, fallback to all
    if (filtered.length === 0) {
      filtered = venues;
    }
  }

  if (!userCoords) {
    return [...filtered].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return filtered
    .map((venue) => {
      let dynamicDistance = venue.distanceKm;
      if (venue.coordinates) {
        dynamicDistance = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          venue.coordinates.lat,
          venue.coordinates.lng
        );
      }
      return {
        ...venue,
        distanceKm: dynamicDistance,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * High-speed Browser / Mobile Geolocation getter with robust timeouts and fallback.
 */
export async function requestMobileLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser or device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const nearest = findNearestCity(latitude, longitude, CITIES);

        // Find closest venue to identify neighborhood
        const sortedVenues = getVenuesSortedByProximity({ lat: latitude, lng: longitude }, nearest.city.name, MOCK_VENUES);
        const closestVenue = sortedVenues[0];
        const neighborhood = closestVenue ? closestVenue.address.split(',')[0].trim() : nearest.city.name;

        const location: UserLocation = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          city: nearest.city.name,
          state: nearest.city.state,
          neighborhood,
          formattedAddress: `${neighborhood}, ${nearest.city.name}`,
          source: 'gps',
          timestamp: Date.now(),
        };

        try {
          localStorage.setItem('showsphere_user_location', JSON.stringify(location));
        } catch (_) {}

        resolve(location);
      },
      (error) => {
        // Fallback or rejection
        let message = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please allow location permissions in your browser or mobile settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Retrying with fallback.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 15000,
      }
    );
  });
}

/**
 * Read cached location from localStorage if available
 */
export function getCachedUserLocation(): UserLocation | null {
  try {
    const raw = localStorage.getItem('showsphere_user_location');
    if (!raw) return null;
    return JSON.parse(raw) as UserLocation;
  } catch (_) {
    return null;
  }
}
