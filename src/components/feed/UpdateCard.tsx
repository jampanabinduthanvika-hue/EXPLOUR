import React, { useState } from 'react';
import { Heart, CheckCircle2, MapPin, Share2, MessageCircle, AlertTriangle, Radio, Sparkles } from 'lucide-react';
import { TravelUpdateRecord } from '../../types';
import { toggleLikeUpdate } from '../../services/feedService';

interface UpdateCardProps {
  update: TravelUpdateRecord;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  const [likes, setLikes] = useState(update.likes_count);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!isLiked) {
      setIsLiked(true);
      const count = await toggleLikeUpdate(update.id, likes);
      setLikes(count);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tourism':
        return 'text-blue-400 bg-blue-950/70 border-blue-800/60';
      case 'Weather':
        return 'text-amber-400 bg-amber-950/70 border-amber-800/60';
      case 'Traffic':
        return 'text-rose-400 bg-rose-950/70 border-rose-800/60';
      case 'Festival':
        return 'text-purple-400 bg-purple-950/70 border-purple-800/60';
      case 'Safety':
        return 'text-emerald-400 bg-emerald-950/70 border-emerald-800/60';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <article className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all duration-200 space-y-3">
      {/* Header: Author & Timestamp */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400 shrink-0">
            {update.author_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{update.author_name}</span>
              {update.is_verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              )}
              <span className="text-xs text-slate-400">{update.author_handle}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="font-medium text-slate-300">{update.author_role}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                {update.city}
              </span>
              <span>•</span>
              <span>{update.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Category Pill */}
        <span
          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(
            update.category
          )}`}
        >
          {update.category}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line pl-1">
        {update.content}
      </p>

      {/* Engagement Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-800/80 text-xs text-slate-400 pl-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors group ${
            isLiked ? 'text-rose-500' : 'hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : 'group-hover:scale-110'} transition-transform`} />
          <span className="font-semibold">{likes}</span>
        </button>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
          }}
          className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          title="Copy link to clipboard"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};
