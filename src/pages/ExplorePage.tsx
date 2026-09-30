import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, Sparkles, Filter, MapPin } from 'lucide-react';
import { getAttractions, getStates, getCities } from '../services/attractionService';
import { AttractionRecord, StateRecord, CityRecord } from '../types';
import { AttractionCard } from '../components/explore/AttractionCard';
import { FilterBar } from '../components/explore/FilterBar';
import { AttractionDetailModal } from '../components/explore/AttractionDetailModal';
import { useFilterStore } from '../store/useFilterStore';

export const ExplorePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialParamState = searchParams.get('state') || 'All';

  const [attractions, setAttractions] = useState<AttractionRecord[]>([]);
  const [states, setStates] = useState<StateRecord[]>([]);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionRecord | null>(null);

  const {
    searchQuery,
    selectedState,
    selectedCity,
    selectedCategory,
    selectedInterests,
    sortBy,
    setSelectedState,
  } = useFilterStore();

  useEffect(() => {
    if (initialParamState && initialParamState !== 'All') {
      setSelectedState(initialParamState);
    }
  }, [initialParamState]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [attrs, sts, cts] = await Promise.all([
        getAttractions(),
        getStates(),
        getCities(),
      ]);
      setAttractions(attrs);
      setStates(sts);
      setCities(cts);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter and sort attractions
  const filteredAttractions = attractions
    .filter((attr) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = attr.name.toLowerCase().includes(q);
        const matchesDesc = attr.description.toLowerCase().includes(q);
        const matchesTag = attr.interest_tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // State filter
      if (selectedState !== 'All' && attr.state_id !== selectedState) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All' && attr.city_id !== selectedCity) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && attr.category !== selectedCategory) {
        return false;
      }

      // Interest tags filter
      if (selectedInterests.length > 0) {
        const hasMatchingInterest = selectedInterests.some((interest) =>
          attr.interest_tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase()))
        );
        if (!hasMatchingInterest) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.entry_fee - b.entry_fee;
      }
      if (sortBy === 'duration') {
        return a.visit_duration - b.visit_duration;
      }
      // default: popularity
      return b.popularity_score - a.popularity_score;
    });

  const getCityName = (cityId: string) => {
    return cities.find((c) => c.id === cityId)?.name || cityId;
  };

  const getStateName = (stateId: string) => {
    return states.find((s) => s.id === stateId)?.name || stateId;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Indian Heritage & Natural Wonders</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t('explore.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {t('explore.subtitle')}
        </p>
      </div>

      {/* Filter Bar Component */}
      <FilterBar states={states} cities={cities} />

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredAttractions.length}</strong> of {attractions.length} authentic Indian attractions
        </span>
        {selectedState !== 'All' && (
          <span className="text-blue-400 font-medium">
            Filtering in {getStateName(selectedState)}
          </span>
        )}
      </div>

      {/* Attraction Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredAttractions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              cityName={getCityName(attraction.city_id)}
              stateName={getStateName(attraction.state_id)}
              onViewDetails={(attr) => setSelectedAttraction(attr)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No attractions found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, state, or category filters to find matching destinations across India.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AttractionDetailModal
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </div>
  );
};
