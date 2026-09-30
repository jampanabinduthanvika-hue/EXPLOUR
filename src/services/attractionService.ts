import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AttractionRecord, CityRecord, StateRecord } from '../types';
import { ALL_ATTRACTIONS, CITIES_DATA, STATES_DATA } from '../data';

export const getStates = async (): Promise<StateRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('states').select('*');
      if (!error && data && data.length > 0) return data as StateRecord[];
    } catch (e) {
      console.warn('Supabase fetch states failed, falling back to bundled data:', e);
    }
  }
  return STATES_DATA;
};

export const getCities = async (): Promise<CityRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data && data.length > 0) return data as CityRecord[];
    } catch (e) {
      console.warn('Supabase fetch cities failed, falling back to bundled data:', e);
    }
  }
  return CITIES_DATA;
};

export const getAttractions = async (cityId?: string): Promise<AttractionRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('attractions').select('*');
      if (cityId) {
        query = query.eq('city_id', cityId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as AttractionRecord[];
    } catch (e) {
      console.warn('Supabase fetch attractions failed, falling back to bundled data:', e);
    }
  }

  if (cityId) {
    return ALL_ATTRACTIONS.filter((a) => a.city_id.toLowerCase() === cityId.toLowerCase());
  }
  return ALL_ATTRACTIONS;
};

export const getAttractionById = async (id: string): Promise<AttractionRecord | undefined> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('attractions').select('*').eq('id', id).single();
      if (!error && data) return data as AttractionRecord;
    } catch {
      // fallback
    }
  }
  return ALL_ATTRACTIONS.find((a) => a.id === id);
};
