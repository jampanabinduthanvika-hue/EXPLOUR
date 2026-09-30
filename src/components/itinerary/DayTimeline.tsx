import React, { useState } from 'react';
import { Clock, MapPin, IndianRupee, Utensils, Navigation, CheckCircle, Info } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface DayTimelineProps {
  items: ItineraryItem[];
  daysCount: number;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({ items, daysCount }) => {
  const [activeDay, setActiveDay] = useState(1);

  const dayItems = items.filter((item) => item.day_number === activeDay);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white">Daily Itinerary Schedule</h3>
          <p className="text-xs text-slate-400">Sequenced to minimize transit time and maximize opening hour convenience</p>
        </div>
        <div className="flex gap-1.5 bg-slate-800 p-1 rounded-xl">
          {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDay === d
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {dayItems.map((item, index) => {
          const isMeal = item.activity_type === 'meal';
          const isAttraction = item.activity_type === 'attraction';

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                  isMeal
                    ? 'bg-emerald-500'
                    : index === 0
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isMeal
                    ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700/60'
                    : 'bg-slate-800/70 border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.start_time} - {item.end_time}
                    </span>
                    <span className="text-xs text-slate-400">({item.duration_minutes} mins)</span>
                  </div>

                  <div className="text-xs font-bold text-emerald-400">
                    {item.cost === 0 ? 'Free Entry' : `₹${item.cost.toLocaleString('en-IN')}`}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* Attraction Image if available */}
                  {item.attraction && (
                    <img
                      src={item.attraction.image_url}
                      alt={item.attraction.name}
                      className="w-full md:w-32 h-24 object-cover rounded-lg border border-slate-700/80 shrink-0"
                    />
                  )}

                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {isMeal ? <Utensils className="w-4 h-4 text-emerald-400" /> : <MapPin className="w-4 h-4 text-blue-400" />}
                      {item.attraction?.name || item.custom_title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.attraction?.description || item.notes}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                      {item.attraction && (
                        <span className="bg-slate-700/70 text-slate-200 px-2 py-0.5 rounded">
                          {item.attraction.category}
                        </span>
                      )}
                      {item.transport_type && (
                        <span className="flex items-center gap-1 bg-slate-700/70 text-slate-200 px-2 py-0.5 rounded">
                          <Navigation className="w-3 h-3 text-amber-400" />
                          via {item.transport_type}
                        </span>
                      )}
                      {item.travel_time_from_prev && item.travel_time_from_prev > 0 && (
                        <span className="text-slate-400">
                          ~{item.travel_time_from_prev} mins transit
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
