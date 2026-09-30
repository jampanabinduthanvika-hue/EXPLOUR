import { create } from 'zustand';
import { ItineraryRecord, PlannerInput, ReplanningAdjustment, AttractionRecord } from '../types';
import { generateSmartItinerary, replanItinerary } from '../services/itineraryEngine';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ItineraryState {
  currentItinerary: ItineraryRecord | null;
  savedItineraries: ItineraryRecord[];
  isGenerating: boolean;
  replanningHistory: ReplanningAdjustment[];
  customBucketList: AttractionRecord[];
  
  generateItinerary: (input: PlannerInput) => Promise<void>;
  applyReplanning: (newBudget: number, newDays: 1 | 2 | 3) => Promise<void>;
  saveCurrentItinerary: () => Promise<void>;
  loadSavedItineraries: () => Promise<void>;
  deleteSavedItinerary: (id: string) => Promise<void>;
  addToCustomBucketList: (attraction: AttractionRecord) => void;
  removeFromCustomBucketList: (attractionId: string) => void;
  setCurrentItinerary: (itin: ItineraryRecord) => void;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  currentItinerary: null,
  savedItineraries: typeof window !== 'undefined' && localStorage.getItem('explour_saved_itineraries')
    ? JSON.parse(localStorage.getItem('explour_saved_itineraries')!)
    : [],
  isGenerating: false,
  replanningHistory: [],
  customBucketList: [],

  generateItinerary: async (input) => {
    set({ isGenerating: true });
    try {
      const itinerary = await generateSmartItinerary(input);
      set({ currentItinerary: itinerary, isGenerating: false });
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      set({ isGenerating: false });
    }
  },

  applyReplanning: async (newBudget, newDays) => {
    const { currentItinerary, replanningHistory } = get();
    if (!currentItinerary) return;

    set({ isGenerating: true });
    try {
      const { updatedItinerary, adjustment } = await replanItinerary(
        currentItinerary,
        newBudget,
        newDays
      );
      set({
        currentItinerary: updatedItinerary,
        replanningHistory: [adjustment, ...replanningHistory],
        isGenerating: false,
      });
    } catch (e) {
      console.error('Replanning error:', e);
      set({ isGenerating: false });
    }
  },

  saveCurrentItinerary: async () => {
    const { currentItinerary, savedItineraries } = get();
    if (!currentItinerary) return;

    const exists = savedItineraries.some((i) => i.id === currentItinerary.id);
    const updated = exists
      ? savedItineraries.map((i) => (i.id === currentItinerary.id ? currentItinerary : i))
      : [currentItinerary, ...savedItineraries];

    localStorage.setItem('explour_saved_itineraries', JSON.stringify(updated));
    set({ savedItineraries: updated });

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('itineraries').upsert({
          id: currentItinerary.id,
          destination_city_id: currentItinerary.destination_city_id,
          destination_city_name: currentItinerary.destination_city_name,
          title: currentItinerary.title,
          number_of_days: currentItinerary.number_of_days,
          total_budget: currentItinerary.total_budget,
          spent_budget: currentItinerary.spent_budget,
          group_size: currentItinerary.group_size,
          transport_preference: currentItinerary.transport_preference,
          interests: currentItinerary.interests,
          status: currentItinerary.status,
        });
      } catch (err) {
        console.warn('Supabase save error:', err);
      }
    }
  },

  loadSavedItineraries: async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('itineraries').select('*');
        if (!error && data && data.length > 0) {
          // Merge with local storage
          set({ savedItineraries: data as ItineraryRecord[] });
          return;
        }
      } catch {
        // use local
      }
    }

    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('explour_saved_itineraries');
      if (raw) set({ savedItineraries: JSON.parse(raw) });
    }
  },

  deleteSavedItinerary: async (id) => {
    const updated = get().savedItineraries.filter((i) => i.id !== id);
    set({ savedItineraries: updated });
    localStorage.setItem('explour_saved_itineraries', JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('itineraries').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  },

  addToCustomBucketList: (attraction) => {
    const { customBucketList } = get();
    if (!customBucketList.some((a) => a.id === attraction.id)) {
      set({ customBucketList: [...customBucketList, attraction] });
    }
  },

  removeFromCustomBucketList: (attractionId) => {
    set({ customBucketList: get().customBucketList.filter((a) => a.id !== attractionId) });
  },

  setCurrentItinerary: (itin) => set({ currentItinerary: itin }),
}));
