import { useState, useEffect, useCallback } from 'react';
import { UserLocation } from '../types';

export interface UseLocationReturn {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
  reverseGeocode: (latitude: number, longitude: number) => Promise<{ city?: string; country?: string }>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = await reverseGeocode(latitude, longitude);
        
        setLocation({
          latitude,
          longitude,
          accuracy,
          ...coords,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const reverseGeocode = useCallback(async (latitude: number, longitude: number): Promise<{ city?: string; country?: string }> => {
    // In production, this would call a geocoding API
    // For now, return mock data
    return {
      city: 'Kyiv',
      country: 'Ukraine',
    };
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    reverseGeocode,
  };
};
