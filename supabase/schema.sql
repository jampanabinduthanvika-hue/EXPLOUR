-- =========================================================================
-- EXPLOUR — INDIA TRAVEL INTELLIGENCE PLATFORM
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STATES TABLE
CREATE TABLE IF NOT EXISTS public.states (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code VARCHAR(5) NOT NULL UNIQUE,
    region TEXT NOT NULL CHECK (region IN ('North', 'South', 'East', 'West', 'Central', 'North-East')),
    description TEXT NOT NULL,
    banner_image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CITIES TABLE
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

-- 3. ATTRACTIONS TABLE
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
    visit_duration INT NOT NULL DEFAULT 90, -- in minutes
    popularity_score INT NOT NULL DEFAULT 80 CHECK (popularity_score >= 1 AND popularity_score <= 100),
    interest_tags TEXT[] NOT NULL DEFAULT '{}',
    transport_cost INT NOT NULL DEFAULT 100, -- INR
    travel_time INT NOT NULL DEFAULT 20, -- minutes from center
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. WEATHER ALERTS TABLE
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

-- 5. TRAVEL ALERTS TABLE
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

-- 6. TRAVEL UPDATES (X-Style Feed)
CREATE TABLE IF NOT EXISTS public.travel_updates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    author_name TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'Traveler',
    author_avatar TEXT,
    city TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Tourism', 'Weather', 'Traffic', 'Festival', 'User Tip', 'Safety')),
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    timestamp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ITINERARY TEMPLATES
CREATE TABLE IF NOT EXISTS public.itinerary_templates (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    days INT NOT NULL,
    suggested_budget INT NOT NULL,
    overview TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ITINERARIES TABLE (User generated / persistent)
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
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ITINERARY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.itinerary_items (
    id TEXT PRIMARY KEY,
    itinerary_id TEXT NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    order_index INT NOT NULL,
    attraction_id TEXT REFERENCES public.attractions(id) ON DELETE SET NULL,
    custom_title TEXT,
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

-- 10. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    default_currency VARCHAR(5) DEFAULT 'INR',
    preferred_transport TEXT DEFAULT 'Public',
    dietary_preference TEXT DEFAULT 'Any',
    interests TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. SAVED TRIPS
CREATE TABLE IF NOT EXISTS public.saved_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    itinerary_id TEXT NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR SPEED
CREATE INDEX IF NOT EXISTS idx_cities_state ON public.cities(state_id);
CREATE INDEX IF NOT EXISTS idx_attractions_city ON public.attractions(city_id);
CREATE INDEX IF NOT EXISTS idx_attractions_category ON public.attractions(category);
CREATE INDEX IF NOT EXISTS idx_weather_alerts_city ON public.weather_alerts(city_id);
CREATE INDEX IF NOT EXISTS idx_travel_alerts_city ON public.travel_alerts(city_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_items_itinerary ON public.itinerary_items(itinerary_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR DISCOVERY TABLES
CREATE POLICY "Public states are viewable by everyone" ON public.states FOR SELECT USING (true);
CREATE POLICY "Public cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public attractions are viewable by everyone" ON public.attractions FOR SELECT USING (true);
CREATE POLICY "Public weather alerts are viewable by everyone" ON public.weather_alerts FOR SELECT USING (true);
CREATE POLICY "Public travel alerts are viewable by everyone" ON public.travel_alerts FOR SELECT USING (true);
CREATE POLICY "Public travel updates are viewable by everyone" ON public.travel_updates FOR SELECT USING (true);
CREATE POLICY "Travel updates can be posted by authenticated users" ON public.travel_updates FOR INSERT WITH CHECK (true);

-- ITINERARY POLICIES
CREATE POLICY "Anyone can view their itineraries or public ones" ON public.itineraries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert itineraries" ON public.itineraries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update itineraries" ON public.itineraries FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete itineraries" ON public.itineraries FOR DELETE USING (true);

CREATE POLICY "Anyone can view itinerary items" ON public.itinerary_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert itinerary items" ON public.itinerary_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update itinerary items" ON public.itinerary_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete itinerary items" ON public.itinerary_items FOR DELETE USING (true);
