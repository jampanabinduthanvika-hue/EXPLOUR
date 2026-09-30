import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, RotateCcw, Search, Check } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { StateRecord, CityRecord, AttractionCategory } from '../../types';

interface FilterBarProps {
  states: StateRecord[];
  cities: CityRecord[];
}

export const FilterBar: React.FC<FilterBarProps> = ({ states, cities }) => {
  const {
    searchQuery,
    selectedState,
    selectedCity,
    selectedCategory,
    maxBudget,
    selectedInterests,
    onlyOpenNow,
    sortBy,
    setSearchQuery,
    setSelectedState,
    setSelectedCity,
    setSelectedCategory,
    setMaxBudget,
    toggleInterest,
    setOnlyOpenNow,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const categories: (AttractionCategory | 'All')[] = [
    'All',
    'Beach',
    'Heritage',
    'Nature',
    'Adventure',
    'Religious',
    'Shopping',
    'Culture',
    'Food',
  ];

  const popularTags = ['Sunset', 'Fort', 'Caves', 'UNESCO', 'Trekking', 'Lake', 'Boating', 'Palace'];

  const availableCities = selectedState === 'All'
    ? cities
    : cities.filter((c) => c.state_id === selectedState);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Search & Primary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, keyword..."
            className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:border-blue-500 outline-none"
          />
        </div>

        {/* State select */}
        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All States (11 States/UTs)</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City select */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Cities</option>
            {availableCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort select */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="popularity">Sort: Most Popular</option>
            <option value="cheapest">Sort: Budget Friendly (Low Fee)</option>
            <option value="duration">Sort: Shortest Duration</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interest Tags & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-400 mr-1">Interests:</span>
          {popularTags.map((tag) => {
            const active = selectedInterests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all ${
                  active
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};
