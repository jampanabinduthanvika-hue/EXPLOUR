import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  guestUser: { id: string; email: string; name: string } | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  guestUser: typeof window !== 'undefined' && localStorage.getItem('explour_guest') 
    ? JSON.parse(localStorage.getItem('explour_guest')!) 
    : null,
  loading: true,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      set({ loading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, loading: false });
      });
    } catch {
      set({ loading: false });
    }
  },

  signInWithEmail: async (email, password) => {
    if (!isSupabaseConfigured()) {
      // Mock login for developer trial without Supabase
      const guest = { id: 'guest-' + Date.now(), email, name: email.split('@')[0] };
      localStorage.setItem('explour_guest', JSON.stringify(guest));
      set({ guestUser: guest });
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  },

  signUpWithEmail: async (email, password) => {
    if (!isSupabaseConfigured()) {
      const guest = { id: 'guest-' + Date.now(), email, name: email.split('@')[0] };
      localStorage.setItem('explour_guest', JSON.stringify(guest));
      set({ guestUser: guest });
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ? error.message : null };
  },

  signInAsGuest: () => {
    const guest = { id: 'guest-' + Math.floor(Math.random() * 100000), email: 'explorer@explour.in', name: 'Explorer Guest' };
    localStorage.setItem('explour_guest', JSON.stringify(guest));
    set({ guestUser: guest });
  },

  signOut: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('explour_guest');
    set({ user: null, guestUser: null });
  },
}));
