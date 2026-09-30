import React from 'react';
import { X, Clock, MapPin, IndianRupee, Navigation, Plus, Check, Star, Compass, ArrowRight } from 'lucide-react';
import { AttractionRecord } from '../../types';
import { useItineraryStore } from '../../store/useItineraryStore';
import { useNavigate } from 'react-router-dom';

interface AttractionDetailModalProps {
  attraction: AttractionRecord | null;
  onClose: () => void;
}

export const AttractionDetailModal: React.FC<AttractionDetailModalProps> = ({
  attraction,
  onClose,
}) => {
  const navigate = useNavigate();
  const { customBucketList, addToCustomBucketList, removeFromCustomBucketList } = useItineraryStore();

  if (!attraction) return null;

  const isAdded = customBucketList.some((a) => a.id === attraction.id);

  const toggleBucket = () => {
    if (isAdded) {
      removeFromCustomBucketList(attraction.id);
    } else {
      addToCustomBucketList(attraction);
    }
  };

  const handlePlanForCity = () => {
    onClose();
    navigate(`/plan?destination=${attraction.city_id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image */}
        <div className="relative h-64 w-full bg-slate-800">
          <img
            src={attraction.image_url}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded bg-blue-600 text-white shadow">
              {attraction.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              {attraction.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Timings: <strong>{attraction.opening_time} - {attraction.closing_time}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Visit Duration: <strong>{attraction.visit_duration} mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>Entry Fee: <strong>{attraction.entry_fee === 0 ? 'Free' : `₹${attraction.entry_fee}`}</strong></span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-slate-400">Overview</h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {attraction.description}
            </p>
          </div>

          {/* Logistics breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Estimated Local Transit</span>
              <span className="font-bold text-white">~₹{attraction.transport_cost} (from center)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Popularity Rating</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {attraction.popularity_score} / 100
              </span>
            </div>
          </div>

          {/* Interest Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-slate-400">Themes & Activities</h4>
            <div className="flex flex-wrap gap-2">
              {attraction.interest_tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={toggleBucket}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isAdded
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAdded ? 'Added to Itinerary Bucket' : 'Add to Trip Bucket'}
            </button>

            <button
              onClick={handlePlanForCity}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Build Complete Itinerary Here</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
