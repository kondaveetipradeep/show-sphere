import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Star, ChevronRight } from 'lucide-react';
import { MediaItem, Currency } from '../types';

interface HeroBannerProps {
  items?: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onQuickBook?: (item: MediaItem) => void;
  currency?: Currency;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ items = [], onSelectMedia }) => {
  const featured = (items && items.length > 0 ? items : []).filter((i) => i.featured);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const current = featured[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 rounded-2xl sm:rounded-3xl shadow-md select-none">
      {/* Background Image with Gradients */}
      <div className="relative h-[320px] sm:h-[380px] md:h-[420px] w-full">
        <img
          src={current.bannerUrl}
          alt={current.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ease-out brightness-[0.55]"
        />

        {/* Ambient Gradients for high readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 px-4 sm:px-6 flex flex-col justify-end pb-5 sm:pb-7">
          <div className="max-w-xl space-y-2 sm:space-y-2.5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {current.badge && (
                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  {current.badge}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-amber-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {current.rating}/10
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-md text-slate-200 text-[10px] font-mono uppercase">
                {current.censorRating}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-sky-950/70 border border-sky-400/40 text-sky-200 text-[10px] font-medium">
                {current.formats[0]}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {current.title}
            </h1>

            {/* Formats & Languages */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-200">
              <span className="text-rose-300 font-semibold">{current.languages.join(', ')}</span>
              <span>•</span>
              <span>{Math.floor(current.durationMinutes / 60)}h {current.durationMinutes % 60}m</span>
              <span>•</span>
              <span className="text-slate-300">{current.genres.slice(0, 2).join(', ')}</span>
            </div>

            {/* Description */}
            <p className="text-slate-200 text-xs line-clamp-2 leading-relaxed max-w-lg">
              {current.description}
            </p>

            {/* Call to action buttons */}
            <div className="flex items-center gap-2 pt-1.5">
              <button
                onClick={() => onSelectMedia(current)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <span>Book Tickets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectMedia(current)}
                className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-white fill-white" />
                <span className="hidden sm:inline">Trailer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute right-4 bottom-4 flex items-center gap-1.5 z-10">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-4 bg-rose-500' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
