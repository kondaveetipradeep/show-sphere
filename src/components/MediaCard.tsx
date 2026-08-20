import React from 'react';
import { Star, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  onQuickBook: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect, onQuickBook }) => {
  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
      onClick={() => onSelect(item)}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Subtle Top & Bottom Gradient Overlay for tags */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {item.badge ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {item.badge.split(' ')[0]}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-white/90 text-slate-800 text-[10px] font-bold shadow-sm backdrop-blur-sm">
              {item.censorRating}
            </span>
          )}

          {item.likesCount && (
            <div className="px-2 py-0.5 rounded-md bg-white/90 text-rose-600 text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
              <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
              <span>{item.likesCount}</span>
            </div>
          )}
        </div>

        {/* Bottom Poster Rating Tag */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1 bg-black/75 px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10 text-white">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-xs">{item.rating}</span>
            <span className="text-[10px] text-slate-300">/10</span>
          </div>

          <span className="text-[10px] text-white font-mono bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {item.votesCount}
          </span>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 line-clamp-1 transition-colors">
            {item.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1 mt-0.5 text-[11px] text-slate-500">
            <span>{(item.genres || []).slice(0, 2).join(' • ')}</span>
            <span>•</span>
            <span className="text-slate-700 font-medium">{(item.languages || []).slice(0, 2).join(', ')}</span>
          </div>
        </div>

        {/* Formats and Quick Book */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-hidden">
            {(item.formats || []).slice(0, 2).map((fmt) => (
              <span 
                key={fmt}
                className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-700 font-medium whitespace-nowrap border border-slate-200"
              >
                {fmt}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickBook(item);
            }}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-sm shadow-rose-200"
          >
            <span>Book</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
