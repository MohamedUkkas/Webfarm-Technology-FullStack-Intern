// Source: Google Maps Platform Code Assist
// GPS Location & Hyperlocal Transit Routing Engine for FreshMart

export interface GpsCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  timestamp?: number;
}

// Default Dark Store Coordinates (Chennai Hubs)
export const DARK_STORE_COORDS: Record<string, { lat: number; lng: number; name: string; address: string }> = {
  'ds-mission-04': {
    lat: 13.0418,
    lng: 80.2337,
    name: 'FreshMart Dark Store #04 (T. Nagar)',
    address: 'Pondy Bazaar, T. Nagar'
  },
  'ds-soma-02': {
    lat: 13.0336,
    lng: 80.2690,
    name: 'FreshMart Farm Hub #02 (Mylapore)',
    address: 'Luz Church Road, Mylapore'
  },
  'ds-richmond-07': {
    lat: 13.0012,
    lng: 80.2565,
    name: 'FreshMart Dark Store #07 (Adyar)',
    address: 'LB Road, Adyar'
  }
};

// Default Customer Drop-off Coordinates (T. Nagar, Chennai)
export const DEFAULT_CUSTOMER_COORDS: GpsCoordinates = {
  lat: 13.0418,
  lng: 80.2341,
  accuracy: 12
};

/**
 * Calculates straight-line distance in kilometers between two GPS points using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes bearing angle in degrees from point A to point B
 */
export function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Interpolates GPS coordinates between origin and destination based on progress ratio (0.0 to 1.0)
 * with realistic street-waypoint bends for natural delivery courier movement
 */
export function interpolateDeliveryRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  progress: number // 0 to 1
): { lat: number; lng: number; bearing: number; remainingKm: number; currentSpeedKmH: number } {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Intermediate realistic street waypoints in Chennai
  const midLat = origin.lat + (destination.lat - origin.lat) * 0.45 + (clampedProgress > 0.3 ? 0.0008 : 0);
  const midLng = origin.lng + (destination.lng - origin.lng) * 0.55 - (clampedProgress > 0.5 ? 0.0005 : 0);

  let currentLat: number;
  let currentLng: number;

  if (clampedProgress <= 0.5) {
    const t = clampedProgress / 0.5;
    currentLat = origin.lat + (midLat - origin.lat) * t;
    currentLng = origin.lng + (midLng - origin.lng) * t;
  } else {
    const t = (clampedProgress - 0.5) / 0.5;
    currentLat = midLat + (destination.lat - midLat) * t;
    currentLng = midLng + (destination.lng - midLng) * t;
  }

  const bearing = calculateBearing(currentLat, currentLng, destination.lat, destination.lng);
  const remainingKm = calculateDistanceKm(currentLat, currentLng, destination.lat, destination.lng);

  // Dynamic courier speed: stops at hub, cruises at 24-28 km/h, slows down for doorstep arrival
  let currentSpeedKmH = 26;
  if (clampedProgress < 0.1) currentSpeedKmH = 0; // picking/packing at dark store
  else if (clampedProgress < 0.2) currentSpeedKmH = 12; // departing hub alley
  else if (clampedProgress > 0.95) currentSpeedKmH = 5; // parking at doorstep
  else if (clampedProgress >= 1.0) currentSpeedKmH = 0; // delivered

  return {
    lat: currentLat,
    lng: currentLng,
    bearing,
    remainingKm,
    currentSpeedKmH
  };
}

/**
 * Generates route polyline points array connecting origin -> courier -> destination
 */
export function getRoutePolyline(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const pt = interpolateDeliveryRoute(origin, destination, ratio);
    points.push({ lat: pt.lat, lng: pt.lng });
  }
  return points;
}

/**
 * Requests device GPS coordinates using HTML5 Geolocation API with high accuracy
 */
export function requestCurrentGpsPosition(): Promise<GpsCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
