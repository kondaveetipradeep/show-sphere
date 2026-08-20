import React from 'react';
import { Film, Flame, Frown } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onQuickBook: (item: MediaItem) => void;
  title?: string;
  subtitle?: string;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items = [],
  onSelectMedia,
  onQuickBook,
  title = 'Now Showing',
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 max-w-sm mx-auto space-y-3 px-4">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
          <Frown className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Movies Found</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          No shows match your active filters. Try clearing some language or format filters.
        </p>
      </div>
    );
  }

  const trendingItems = safeItems.filter((i) => i?.trending);

  return (
    <div className="px-3.5 sm:px-4 py-2 space-y-5 pb-12">
      {/* Trending Rail (Horizontal swipe on mobile) */}
      {trendingItems.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Trending Blockbusters</span>
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Swipe &rarr;</span>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5 snap-x">
            {trendingItems.map((item) => (
              <div key={item.id} className="min-w-[145px] sm:min-w-[180px] max-w-[180px] shrink-0 snap-start">
                <MediaCard
                  item={item}
                  onSelect={onSelectMedia}
                  onQuickBook={onQuickBook}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Section Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-1.5">
            <Film className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            <span className="text-rose-600 font-bold">{safeItems.length}</span> movies
          </div>
        </div>

        {/* 2-Column Mobile Grid, 3-5 on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {safeItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onSelect={onSelectMedia}
              onQuickBook={onQuickBook}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
