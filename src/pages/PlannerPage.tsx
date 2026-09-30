import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  Car, 
  Compass, 
  RefreshCw, 
  BookmarkCheck, 
  Printer, 
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useItineraryStore } from '../store/useItineraryStore';
import { getCities, getAttractions } from '../services/attractionService';
import { getWeatherAlerts, getTravelAlerts } from '../services/weatherService';
import { calculateBudgetBreakdown } from '../services/itineraryEngine';
import { CityRecord, AttractionRecord, WeatherAlertRecord, TravelAlertRecord, TransportPreference, PlannerInput } from '../types';
import { IndiaMap } from '../components/map/IndiaMap';
import { BudgetTracker } from '../components/itinerary/BudgetTracker';
import { DayTimeline } from '../components/itinerary/DayTimeline';
import { WeatherAdvisoryBanner } from '../components/itinerary/WeatherAdvisoryBanner';
import { DynamicReplannerModal } from '../components/itinerary/DynamicReplannerModal';

export const PlannerPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || 'north-goa';

  const {
    currentItinerary,
    generateItinerary,
    isGenerating,
    saveCurrentItinerary,
  } = useItineraryStore();

  const [cities, setCities] = useState<CityRecord[]>([]);
  const [selectedCityId, setSelectedCityId] = useState(initialDestination);
  const [budget, setBudget] = useState(6500);
  const [numberOfDays, setNumberOfDays] = useState<1 | 2 | 3>(2);
  const [groupSize, setGroupSize] = useState(1);
  const [transportPreference, setTransportPreference] = useState<TransportPreference>('Public');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Beach', 'Heritage', 'Nature']);

  const [cityAttractions, setCityAttractions] = useState<AttractionRecord[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlertRecord[]>([]);
  const [travelAlerts, setTravelAlerts] = useState<TravelAlertRecord[]>([]);
  const [isReplannerOpen, setIsReplannerOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available Interests
  const allInterests = [
    'Beach',
    'Heritage',
    'Nature',
    'Adventure',
    'Religious',
    'Shopping',
    'Culture',
    'Food',
  ];

  // Load cities on mount
  useEffect(() => {
    const fetchInitial = async () => {
      const c = await getCities();
      setCities(c);
    };
    fetchInitial();
  }, []);

  // When selectedCityId changes, fetch attractions, weather alerts, and travel alerts for that city
  useEffect(() => {
    const fetchCityData = async () => {
      if (!selectedCityId) return;
      const [attrs, wAlerts, tAlerts] = await Promise.all([
        getAttractions(selectedCityId),
        getWeatherAlerts(selectedCityId),
        getTravelAlerts(selectedCityId),
      ]);
      setCityAttractions(attrs);
      setWeatherAlerts(wAlerts);
      setTravelAlerts(tAlerts);
    };
    fetchCityData();
  }, [selectedCityId]);

  // If no current itinerary yet, generate on load
  useEffect(() => {
    if (!currentItinerary && selectedCityId) {
      handleGenerate();
    }
  }, [selectedCityId]);

  const handleGenerate = async () => {
    const input: PlannerInput = {
      destinationCityId: selectedCityId,
      budget,
      numberOfDays,
      interests: selectedInterests,
      transportPreference,
      groupSize,
    };
    await generateItinerary(input);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    await saveCurrentItinerary();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const budgetBreakdown = currentItinerary ? calculateBudgetBreakdown(currentItinerary) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Travel Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {t('planner.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t('planner.subtitle')}
          </p>
        </div>

        {/* Action Buttons if Itinerary Active */}
        {currentItinerary && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsReplannerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('planner.replanTrip')}</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{t('planner.saveItinerary')}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              aria-label="Print Itinerary"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Parameters Sidebar & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-20">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            Trip Constraints & Factors
          </h2>

          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {t('planner.selectDestination')}
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} — {city.tagline}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                {t('planner.budget')}
              </span>
              <span className="font-mono text-emerald-400 font-extrabold text-sm">
                ₹{budget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={25000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹2,000 (Shoestring)</span>
              <span>₹25,000 (Luxury)</span>
            </div>
          </div>

          {/* Duration in Days */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {t('planner.days')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setNumberOfDays(d as 1 | 2 | 3)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    numberOfDays === d
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {d} Day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size & Transport Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                {t('planner.groupSize')}
              </label>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={1}>Solo (1)</option>
                <option value={2}>Couple (2)</option>
                <option value={3}>Small Group (3)</option>
                <option value={4}>Family/Group (4)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                {t('planner.transport')}
              </label>
              <select
                value={transportPreference}
                onChange={(e) => setTransportPreference(e.target.value as TransportPreference)}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Public">Public Transit</option>
                <option value="Metro/Walk">Metro / Walk</option>
                <option value="Cab">Cab / Taxi</option>
                <option value="Self-Drive">Self-Drive</option>
              </select>
            </div>
          </div>

          {/* Travel Interests Tag Selectors */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {t('planner.interests')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow'
                        : 'bg-slate-800 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Itinerary Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{t('planner.generating')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>{t('planner.generate')}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Map, Weather Alerts, Itinerary Timeline & Budget Intelligence (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weather & Travel Alerts Banner */}
          <WeatherAdvisoryBanner weatherAlerts={weatherAlerts} travelAlerts={travelAlerts} />

          {/* Interactive Leaflet India Map with Day-wise Route Polylines */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Interactive Destination & Route Map</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                {cityAttractions.length} Attractions Plotted
              </span>
            </div>

            <IndiaMap
              attractions={cityAttractions}
              centerLat={selectedCity?.latitude}
              centerLon={selectedCity?.longitude}
              zoom={11}
              itineraryItems={currentItinerary?.items || []}
              selectedCityName={selectedCity?.name}
              className="h-[380px]"
            />
          </div>

          {/* Budget Intelligence Card */}
          {budgetBreakdown && <BudgetTracker breakdown={budgetBreakdown} />}

          {/* Day Timeline */}
          {currentItinerary && (
            <DayTimeline
              items={currentItinerary.items}
              daysCount={currentItinerary.number_of_days}
            />
          )}
        </div>
      </div>

      {/* Dynamic Replanner Modal */}
      <DynamicReplannerModal
        isOpen={isReplannerOpen}
        onClose={() => setIsReplannerOpen(false)}
      />
    </div>
  );
};
