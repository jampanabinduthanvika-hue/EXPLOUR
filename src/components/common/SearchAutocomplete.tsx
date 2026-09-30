import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Sparkles, X, Clock } from 'lucide-react';
import { getCities, getStates } from '../../services/attractionService';
import { CityRecord, StateRecord } from '../../types';
import { useTranslation } from 'react-i18next';

interface SearchAutocompleteProps {
  placeholder?: string;
  onSelect?: (cityId: string) => void;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  placeholder,
  onSelect,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [states, setStates] = useState<StateRecord[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [c, s] = await Promise.all([getCities(), getStates()]);
      setCities(c);
      setStates(s);
    };
    fetchData();

    if (typeof window !== 'undefined') {
      const recents = localStorage.getItem('explour_recent_searches');
      if (recents) {
        setRecentSearches(JSON.parse(recents));
      }
    }
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: CityRecord) => {
    // Save to recents
    const updated = [city.name, ...recentSearches.filter((s) => s !== city.name)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('explour_recent_searches', JSON.stringify(updated));

    setQuery(city.name);
    setIsOpen(false);

    if (onSelect) {
      onSelect(city.id);
    } else {
      navigate(`/plan?destination=${city.id}`);
    }
  };

  const clearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('explour_recent_searches');
  };

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.tagline.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const popularDestinations = ['Goa', 'Leh', 'Munnar', 'Jaipur', 'Visakhapatnam'];

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t('hero.searchPlaceholder')}
          className="w-full pl-12 pr-10 py-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 focus:border-blue-500 rounded-xl text-slate-100 placeholder-slate-400 text-sm shadow-lg backdrop-blur-sm transition-all outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 max-h-96 overflow-y-auto">
          {/* Query Results */}
          {query.trim().length > 0 ? (
            <div>
              {filteredCities.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> Cities
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                          {city.name}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">{city.tagline}</div>
                      </div>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {city.ideal_days} Days
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredStates.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" /> States & Regions
                  </div>
                  {filteredStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => {
                        navigate(`/explore?state=${state.id}`);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-100">{state.name}</span>
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {state.region} India
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredCities.length === 0 && filteredStates.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-400">
                  No destinations found matching &quot;{query}&quot;. Try exploring Goa, Munnar, or Leh.
                </div>
              )}
            </div>
          ) : (
            /* Idle Suggestions: Recents & Popular */
            <div className="p-3 space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecents}
                      className="text-slate-400 hover:text-slate-300 normal-case font-normal text-xs"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const matched = cities.find((c) => c.name.toLowerCase() === term.toLowerCase());
                          if (matched) handleSelectCity(matched);
                          else setQuery(term);
                        }}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/80 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular In India
                </div>
                <div className="grid grid-cols-2 gap-1.5 px-2">
                  {popularDestinations.map((name) => {
                    const city = cities.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          if (city) handleSelectCity(city);
                        }}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-between group transition-colors"
                      >
                        <span className="text-xs font-medium text-slate-200 group-hover:text-blue-400">
                          {name}
                        </span>
                        <MapPin className="w-3 h-3 text-slate-400 group-hover:text-blue-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
