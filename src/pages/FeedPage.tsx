import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Plus, Filter, Sparkles, RefreshCw, MapPin } from 'lucide-react';
import { getTravelUpdates } from '../../src/services/feedService';
import { TravelUpdateRecord } from '../types';
import { UpdateCard } from '../components/feed/UpdateCard';
import { NewPostModal } from '../components/feed/NewPostModal';
import { CITIES_DATA } from '../data/statesAndCities';

export const FeedPage: React.FC = () => {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<TravelUpdateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const categories = ['All', 'Tourism', 'Weather', 'Traffic', 'Festival', 'User Tip', 'Safety'];

  const fetchFeed = async () => {
    setLoading(true);
    const data = await getTravelUpdates(selectedCategory, selectedCity);
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedCategory, selectedCity]);

  const handlePostCreated = (newUpdate: TravelUpdateRecord) => {
    setUpdates([newUpdate, ...updates]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-400 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
            <span>Live Crowdsourced & Official Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('feed.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('feed.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('feed.postUpdate')}</span>
        </button>
      </div>

      {/* Filter and City bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Category horizontal pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* City Filter */}
        <div className="shrink-0 flex items-center gap-2">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-1.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Indian Cities</option>
            {CITIES_DATA.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchFeed}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Radio className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No travel updates yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Be the first traveler or local guide to broadcast an alert for this region!
          </p>
        </div>
      )}

      {/* New Post Modal */}
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        onCreated={handlePostCreated}
      />
    </div>
  );
};
