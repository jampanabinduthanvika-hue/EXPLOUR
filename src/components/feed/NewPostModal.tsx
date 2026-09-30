import React, { useState } from 'react';
import { X, Send, MapPin, Sparkles } from 'lucide-react';
import { createTravelUpdate } from '../../services/feedService';
import { TravelUpdateRecord } from '../../types';
import { CITIES_DATA } from '../../data/statesAndCities';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (update: TravelUpdateRecord) => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [city, setCity] = useState(CITIES_DATA[0].name);
  const [category, setCategory] = useState<'Tourism' | 'Weather' | 'Traffic' | 'Festival' | 'User Tip' | 'Safety'>('User Tip');
  const [authorName, setAuthorName] = useState('Local Explorer');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const record = await createTravelUpdate({
        author_name: authorName,
        author_handle: `@${authorName.toLowerCase().replace(/\s+/g, '_')}`,
        author_role: 'Traveler',
        city,
        category,
        content,
        is_verified: false,
      });

      onCreated(record);
      setContent('');
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Send className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">Post Real-Time Travel Intelligence</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Tourism', 'Weather', 'Traffic', 'Festival', 'User Tip', 'Safety'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Update Details</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Traffic clear on Ooty ghat road today. Toy train tickets available on spot at platform 1..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
