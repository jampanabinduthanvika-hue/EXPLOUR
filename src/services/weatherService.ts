import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { WeatherAlertRecord, TravelAlertRecord } from '../types';
import { WEATHER_ALERTS_DATA, TRAVEL_ALERTS_DATA } from '../data';

export const getWeatherAlerts = async (cityId?: string): Promise<WeatherAlertRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('weather_alerts').select('*');
      if (cityId) {
        query = query.eq('city_id', cityId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as WeatherAlertRecord[];
    } catch {
      // fallback
    }
  }

  if (cityId) {
    const matched = WEATHER_ALERTS_DATA.filter((w) => w.city_id.toLowerCase() === cityId.toLowerCase());
    if (matched.length > 0) return matched;
  }
  return WEATHER_ALERTS_DATA;
};

export const getTravelAlerts = async (cityId?: string): Promise<TravelAlertRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('travel_alerts').select('*');
      if (cityId) {
        query = query.eq('city_id', cityId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as TravelAlertRecord[];
    } catch {
      // fallback
    }
  }

  if (cityId) {
    const matched = TRAVEL_ALERTS_DATA.filter((t) => t.city_id.toLowerCase() === cityId.toLowerCase());
    if (matched.length > 0) return matched;
  }
  return TRAVEL_ALERTS_DATA;
};
