import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  PieChart, 
  CloudSun, 
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { SearchAutocomplete } from '../components/common/SearchAutocomplete';
import { getStates, getCities } from '../services/attractionService';
import { StateRecord, CityRecord } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [states, setStates] = useState<StateRecord[]>([]);
  const [cities, setCities] = useState<CityRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [s, c] = await Promise.all([getStates(), getCities()]);
      setStates(s);
      setCities(c);
    };
    loadData();
  }, []);

  // Hero showcase destinations specified in requirements: Ladakh, Kerala, Goa, Rajasthan, Kashmir
  const heroShowcase = [
    {
      title: 'Ladakh',
      subtitle: 'High Himalayas & Monasteries',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      badge: 'Cold Desert Circuit',
      cityId: 'leh',
    },
    {
      title: 'Kerala',
      subtitle: 'Backwaters & Tea Slopes',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      badge: 'Tropical Serenity',
      cityId: 'munnar',
    },
    {
      title: 'Goa',
      subtitle: 'Coastal Shacks & Portuguese Forts',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      badge: 'Arabian Sea Shore',
      cityId: 'north-goa',
    },
    {
      title: 'Rajasthan',
      subtitle: 'Amber Citadels & Lake Palaces',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      badge: 'Royal Heritage',
      cityId: 'jaipur',
    },
    {
      title: 'Kashmir',
      subtitle: 'Dal Lake & Pine Meadows',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      badge: 'Paradise on Earth',
      cityId: 'srinagar',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Driven Context-Aware Travel Intelligence Platform (India Edition)</span>
          </div>

          {/* Mandatory Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Plan More. Spend Less. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Explore Smarter.
            </span>
          </h1>

          {/* Mandatory Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Tell us where you&apos;re going, your budget, and how much time you have. Explour builds a practical, weather-optimized travel plan with zero timetable conflicts.
          </p>

          {/* Smart Destination Search with Autocomplete */}
          <div className="max-w-xl mx-auto pt-2">
            <SearchAutocomplete placeholder="Search destination (e.g. Goa, Leh, Munnar, Vizag)..." />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              to="/plan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t('hero.planTrip')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>{t('hero.exploreDestinations')}</span>
            </Link>
          </div>

          {/* Core Metrics */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl font-extrabold text-white">100+</div>
              <div className="text-xs text-slate-400">Verified Indian Attractions</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl font-extrabold text-blue-400">11 States</div>
              <div className="text-xs text-slate-400">Jammu to Tamil Nadu</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400">Real-Time</div>
              <div className="text-xs text-slate-400">Weather & Traffic Engine</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl font-extrabold text-amber-400">Zero Debt</div>
              <div className="text-xs text-slate-400">Budget Intelligence Guard</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Showcase Grid: Ladakh, Kerala, Goa, Rajasthan, Kashmir */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Featured Iconic Circuits
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curated regional travel intelligence across northern peaks, desert citadels, and coastal backwaters
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {heroShowcase.map((dest) => (
            <div
              key={dest.title}
              onClick={() => navigate(`/plan?destination=${dest.cityId}`)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-slate-600 transition-all duration-300 shadow-xl"
            >
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

              <div className="absolute top-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/60">
                  {dest.badge}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {dest.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1">{dest.subtitle}</p>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-400">
                  <span>Plan Itinerary</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works: The 4-Pillar Intelligence Advantage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How Explour Optimizes Your Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Unlike static recommendation directories, Explour continuously calculates distances, ticket fees, opening hours, and microclimate alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Budget Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintains rigid cost barriers across entry fees, transit options, and food allowance so you never run out of funds midway.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Geographic Route Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attractions are clustered by distance vectors. You never zigzag through heavy Indian traffic between opposite ends of the city.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Microclimate & Weather Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors high UV in Ladakh, mountain rain in Munnar, or midday heat in Jaipur, recommending indoor museums during peak solar hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Friction Dynamic Replanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drop budget by ₹2,000 on the fly: Explour instantly swaps cab rides for metros, re-prioritizes high-value spots, and explains every rupee saved.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-blue-800/50 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/60">
              Ready to Explore India?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Start Your Context-Aware Indian Journey Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Whether you have 24 hours in Mumbai or a 3-day exploration of Udaipur’s royal palaces, Explour builds your perfect day.
            </p>
          </div>

          <Link
            to="/plan"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Launch Smart Planner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
