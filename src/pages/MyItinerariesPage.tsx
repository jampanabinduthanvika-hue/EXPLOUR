import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookmarkCheck, 
  Calendar, 
  IndianRupee, 
  MapPin, 
  Trash2, 
  Eye, 
  Plus, 
  Car, 
  Compass, 
  Clock 
} from 'lucide-react';
import { useItineraryStore } from '../store/useItineraryStore';
import { ItineraryRecord } from '../types';

export const MyItinerariesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { savedItineraries, loadSavedItineraries, deleteSavedItinerary, setCurrentItinerary } = useItineraryStore();

  useEffect(() => {
    loadSavedItineraries();
  }, []);

  const handleView = (itinerary: ItineraryRecord) => {
    setCurrentItinerary(itinerary);
    navigate(`/plan?destination=${itinerary.destination_city_id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Persistent Supabase Itinerary Store</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('myTrips.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('myTrips.subtitle')}
          </p>
        </div>

        <Link
          to="/plan"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Itineraries List */}
      {savedItineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItineraries.map((itin) => (
            <div
              key={itin.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60">
                    {itin.number_of_days} Days Plan
                  </span>
                  <span className="text-[11px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {itin.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {itin.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{itin.destination_city_name}</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block">Total Budget</span>
                    <span className="font-bold text-white">₹{itin.total_budget?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400 block">Transport</span>
                    <span className="font-bold text-slate-200">{itin.transport_preference}</span>
                  </div>
                </div>

                {/* Interests Pills */}
                {itin.interests && itin.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {itin.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleView(itin)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('myTrips.viewTrip')}</span>
                </button>

                <button
                  onClick={() => deleteSavedItinerary(itin.id)}
                  aria-label="Delete saved itinerary"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-slate-800 transition-colors"
                  title="Delete Itinerary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <BookmarkCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Itineraries Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('myTrips.noTrips')}
          </p>
          <div className="pt-2">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <span>Build First Itinerary</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
