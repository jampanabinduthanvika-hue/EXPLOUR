import React, { useState } from 'react';
import { Database, Copy, Check, ShieldCheck, HardDrive, Key, Layers, Terminal, Sparkles, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SupabaseSetupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'seed' | 'storage' | 'architecture'>('schema');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const schemaSnippet = `-- =========================================================================
-- EXPLOUR — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. states
CREATE TABLE IF NOT EXISTS public.states (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code VARCHAR(5) NOT NULL UNIQUE,
    region TEXT NOT NULL CHECK (region IN ('North', 'South', 'East', 'West', 'Central', 'North-East')),
    description TEXT NOT NULL,
    banner_image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. cities
CREATE TABLE IF NOT EXISTS public.cities (
    id TEXT PRIMARY KEY,
    state_id TEXT NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    ideal_days INT NOT NULL DEFAULT 2,
    avg_daily_budget INT NOT NULL DEFAULT 3000,
    best_season TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. attractions (100+ Records Across India)
CREATE TABLE IF NOT EXISTS public.attractions (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    state_id TEXT NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Beach', 'Heritage', 'Nature', 'Adventure', 'Religious', 'Shopping', 'Culture', 'Food')),
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_url TEXT NOT NULL,
    entry_fee INT NOT NULL DEFAULT 0,
    opening_time TIME NOT NULL DEFAULT '09:00',
    closing_time TIME NOT NULL DEFAULT '18:00',
    visit_duration INT NOT NULL DEFAULT 90,
    popularity_score INT NOT NULL DEFAULT 80 CHECK (popularity_score >= 1 AND popularity_score <= 100),
    interest_tags TEXT[] NOT NULL DEFAULT '{}',
    transport_cost INT NOT NULL DEFAULT 100,
    travel_time INT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. weather_alerts & travel_alerts
CREATE TABLE IF NOT EXISTS public.weather_alerts (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    city_name TEXT NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('Rain', 'Thunderstorm', 'Heat', 'UV Alert', 'Fog', 'Clear')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'severe')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    advisory TEXT[] NOT NULL DEFAULT '{}',
    indoor_alternatives TEXT[] DEFAULT '{}',
    valid_until TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.travel_alerts (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    city_name TEXT NOT NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('Traffic', 'Crowd', 'Festival', 'AQI', 'Closure', 'Safety')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high')),
    message TEXT NOT NULL,
    impact_areas TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. travel_updates (X-Style Feed)
CREATE TABLE IF NOT EXISTS public.travel_updates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    author_name TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'Traveler',
    city TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tourism', 'Weather', 'Traffic', 'Festival', 'User Tip', 'Safety')),
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    timestamp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. itineraries & items
CREATE TABLE IF NOT EXISTS public.itineraries (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    destination_city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    destination_city_name TEXT NOT NULL,
    title TEXT NOT NULL,
    number_of_days INT NOT NULL CHECK (number_of_days BETWEEN 1 AND 7),
    total_budget INT NOT NULL,
    spent_budget INT NOT NULL DEFAULT 0,
    group_size INT NOT NULL DEFAULT 1,
    transport_preference TEXT NOT NULL DEFAULT 'Public',
    interests TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id TEXT PRIMARY KEY,
    itinerary_id TEXT NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    order_index INT NOT NULL,
    attraction_id TEXT REFERENCES public.attractions(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('attraction', 'meal', 'transport', 'rest')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    cost INT NOT NULL DEFAULT 0,
    transport_type TEXT,
    travel_time_from_prev INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes & RLS Policies
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON public.attractions FOR SELECT USING (true);`;

  const seedSnippet = `-- =========================================================================
-- EXPLOUR — PRODUCTION SEED DATA (INDIA EDITION)
-- =========================================================================

-- Insert 11 States & UTs
INSERT INTO public.states (id, name, code, region, description, banner_image) VALUES
('andhra-pradesh', 'Andhra Pradesh', 'AP', 'South', 'Home to sacred hill shrines, Bay of Bengal shores, and Eastern Ghats.', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=1200&q=80'),
('telangana', 'Telangana', 'TG', 'South', 'Where centuries-old Nizami heritage blends with cutting-edge tech.', 'https://images.unsplash.com/photo-1605335198038-f1f4ba3e4760?auto=format&fit=crop&w=1200&q=80'),
('goa', 'Goa', 'GA', 'West', 'Golden sand shores, Portuguese colonial cathedrals, and spice plantations.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'),
('kerala', 'Kerala', 'KL', 'South', 'God’s Own Country: emerald backwaters, tea gardens, and Ayurveda.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'),
('rajasthan', 'Rajasthan', 'RJ', 'North', 'Royal desert land of grand hill forts, lake palaces, and textiles.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'),
('delhi', 'Delhi', 'DL', 'North', 'The monumental heart of India, spanning Mughal domes and India Gate.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'),
('maharashtra', 'Maharashtra', 'MH', 'West', 'Dynamic cosmopolitan shores, Marine Drive, and UNESCO caves.', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'),
('karnataka', 'Karnataka', 'KA', 'South', 'From majestic Mysore Palace to boulder-strewn UNESCO Hampi ruins.', 'https://images.unsplash.com/photo-1600100397608-f010f443b782?auto=format&fit=crop&w=1200&q=80'),
('tamil-nadu', 'Tamil Nadu', 'TN', 'South', 'Dravidian gopurams reaching the sky and mist-covered Nilgiri hills.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'),
('jammu-kashmir', 'Jammu and Kashmir', 'JK', 'North', 'Paradise on Earth: Dal Lake shikaras and snowy Gulmarg peaks.', 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'),
('ladakh', 'Ladakh', 'LA', 'North', 'High-altitude cold desert of turquoise lakes and ancient monasteries.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (id) DO NOTHING;

-- Insert Cities (Visakhapatnam, Araku, Tirupati, Hyderabad, Warangal, Goa, Munnar, Jaipur, Delhi, Mumbai, etc.)
-- Complete seed statements are available in supabase/seed.sql`;

  const storageSnippet = `-- =========================================================================
-- EXPLOUR — SUPABASE STORAGE BUCKET DESIGN & POLICIES
-- =========================================================================

-- Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('hero-images', 'hero-images', true),
  ('destination-images', 'destination-images', true),
  ('attraction-images', 'attraction-images', true),
  ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Public Read Policies
CREATE POLICY "Public Read Hero Images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Public Read Destination Images" ON storage.objects FOR SELECT USING (bucket_id = 'destination-images');
CREATE POLICY "Public Read Attraction Images" ON storage.objects FOR SELECT USING (bucket_id = 'attraction-images');
CREATE POLICY "Public Read User Uploads" ON storage.objects FOR SELECT USING (bucket_id = 'user-uploads');

-- Authenticated Upload Policy
CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-uploads');`;

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Production Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Supabase Database & Storage Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete PostgreSQL schema, seed data, storage buckets, and RLS policies for Explour.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <div className="text-xs">
            <div className="font-bold text-white">
              {isSupabaseConfigured() ? 'Connected to Supabase' : 'Offline Mode (Local Engine Active)'}
            </div>
            <div className="text-[10px] text-slate-400">
              {isSupabaseConfigured() ? 'Using VITE_SUPABASE_URL' : 'Configured via .env.example'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. Schema SQL
        </button>
        <button
          onClick={() => setActiveTab('seed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'seed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Seed SQL
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'storage'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. Storage Buckets & Policies
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          4. Future Integrations
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>supabase/schema.sql</span>
            </div>
            <button
              onClick={() => handleCopy(schemaSnippet, 'schema')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              {copiedTab === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'schema' ? 'Copied SQL!' : 'Copy Schema SQL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[480px] leading-relaxed border border-slate-800/80">
            {schemaSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'seed' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>supabase/seed.sql (100+ Indian Attractions)</span>
            </div>
            <button
              onClick={() => handleCopy(seedSnippet, 'seed')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              {copiedTab === 'seed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'seed' ? 'Copied SQL!' : 'Copy Seed SQL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[480px] leading-relaxed border border-slate-800/80">
            {seedSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'storage' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span>supabase/storage.sql</span>
            </div>
            <button
              onClick={() => handleCopy(storageSnippet, 'storage')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              {copiedTab === 'storage' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'storage' ? 'Copied SQL!' : 'Copy Storage SQL'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[480px] leading-relaxed border border-slate-800/80">
            {storageSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack Decoupled Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explour runs on Vite + React SPA with zero custom Node server dependencies. All relational entities, user preferences, saved trips, and storage buckets run on Supabase PostgreSQL.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Future Ready APIs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed with modular interfaces ready to hook into Google Maps Platform, OpenWeatherMap, Directions APIs, and Supabase Realtime WebSocket subscriptions without refactoring core logic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
