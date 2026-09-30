import React, { useState } from 'react';
import { Clock, MapPin, IndianRupee, Heart, Plus, Check, Star } from 'lucide-react';
import { AttractionRecord } from '../../types';
import { useItineraryStore } from '../../store/useItineraryStore';

interface AttractionCardProps {
  attraction: AttractionRecord;
  cityName?: string;
  stateName?: string;
  onViewDetails?: (attraction: AttractionRecord) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  cityName,
  stateName,
  onViewDetails,
}) => {
  const { customBucketList, addToCustomBucketList, removeFromCustomBucketList } = useItineraryStore();
  const isAdded = customBucketList.some((a) => a.id === attraction.id);
  const [imgError, setImgError] = useState(false);

  const toggleTripAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) {
      removeFromCustomBucketList(attraction.id);
    } else {
      addToCustomBucketList(attraction);
    }
  };

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(attraction)}
      className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image & Category Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={
            imgError
              ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
              : attraction.image_url
          }
          alt={attraction.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 shadow">
            {attraction.category}
          </span>
        </div>

        <button
          onClick={toggleTripAdd}
          aria-label={isAdded ? 'Remove from trip' : 'Add to trip'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
            isAdded
              ? 'bg-blue-600 text-white border border-blue-400'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-700/60'
          }`}
        >
          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            {cityName || attraction.city_id}
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-300 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {attraction.popularity_score}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {attraction.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {attraction.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {attraction.interest_tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Timings, Duration & Fee */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{attraction.visit_duration} mins</span>
          </div>

          <div className="font-extrabold text-emerald-400">
            {attraction.entry_fee === 0 ? 'Free Entry' : `₹${attraction.entry_fee.toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>
    </div>
  );
};
