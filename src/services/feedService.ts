import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TravelUpdateRecord } from '../types';
import { TRAVEL_UPDATES_DATA } from '../data';

export const getTravelUpdates = async (filterCategory?: string, filterCity?: string): Promise<TravelUpdateRecord[]> => {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('travel_updates').select('*').order('created_at', { ascending: false });
      if (filterCategory && filterCategory !== 'All') {
        query = query.eq('category', filterCategory);
      }
      if (filterCity && filterCity !== 'All') {
        query = query.eq('city', filterCity);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as TravelUpdateRecord[];
    } catch {
      // fallback
    }
  }

  let items = [...TRAVEL_UPDATES_DATA];
  if (filterCategory && filterCategory !== 'All') {
    items = items.filter((u) => u.category === filterCategory);
  }
  if (filterCity && filterCity !== 'All') {
    items = items.filter((u) => u.city.toLowerCase() === filterCity.toLowerCase());
  }
  return items;
};

export const createTravelUpdate = async (update: Omit<TravelUpdateRecord, 'id' | 'timestamp' | 'likes_count'>): Promise<TravelUpdateRecord> => {
  const newRecord: TravelUpdateRecord = {
    ...update,
    id: 'update-' + Date.now(),
    likes_count: 0,
    timestamp: 'Just now',
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('travel_updates').insert([newRecord]).select().single();
      if (!error && data) return data as TravelUpdateRecord;
    } catch {
      // fallback
    }
  }

  // Prepend to bundled dataset
  TRAVEL_UPDATES_DATA.unshift(newRecord);
  return newRecord;
};

export const toggleLikeUpdate = async (id: string, currentCount: number): Promise<number> => {
  const newCount = currentCount + 1;
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('travel_updates').update({ likes_count: newCount }).eq('id', id);
    } catch {
      // ignore
    }
  }
  const item = TRAVEL_UPDATES_DATA.find((u) => u.id === id);
  if (item) item.likes_count = newCount;
  return newCount;
};
