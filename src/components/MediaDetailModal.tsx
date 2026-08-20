import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Clock, 
  Calendar, 
  Play, 
  Volume2, 
  X
} from 'lucide-react';
import { MediaItem, Showtime, Venue, Currency } from '../types';
import { ShowtimeSelector } from './ShowtimeSelector';

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem | null;
  currentCity: string;
  currency: Currency;
  userLocation: any;
  isLocating?: boolean;
  onDetectLocation?: () => void;
  onSelectShowtime: (showtime: Showtime, venue: Venue) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  isOpen,
  onClose,
  media,
  currentCity,
  currency,
  userLocation,
  isLocating,
  onDetectLocation,
  onSelectShowtime,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !media) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      {/* Tap outside on desktop to close */}
      <div className="hidden sm:block flex-1" onClick={onClose} />

      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full mx-auto overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 text-slate-900 max-h-[92vh] flex flex-col relative">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md border border-white/20 shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Drag handle for mobile */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-30 w-10 h-1 bg-white/60 rounded-full" />

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Backdrop Banner */}
          <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-slate-900">
            <img
              src={media.bannerUrl || media.posterUrl}
              alt={media.title}
              className="w-full h-full object-cover object-top opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Trailer Overlay Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={media.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-rose-600 ml-0.5" />
                </div>
                <span>Play Trailer</span>
              </a>
            </div>

            {/* Bottom Floating Info Tag */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.2 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider">
                    {media.type.toUpperCase()}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-black/60 text-slate-200 font-mono text-[9px] backdrop-blur-sm border border-white/20">
                    {media.censorRating}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {media.title}
                </h1>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-xl border backdrop-blur-md transition cursor-pointer ${
                  isLiked
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Body Info */}
          <div className="p-4 sm:p-5 space-y-5">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{media.rating}/10</div>
                  <div className="text-[10px] text-slate-500 font-mono">{media.votesCount} votes</div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">{media.durationMinutes}m</div>
                  <div className="text-[10px] text-slate-500 font-mono">Duration</div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono truncate max-w-[80px]">{(media.formats || [])[0]}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Format</div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Synopsis
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {media.description}
              </p>
            </div>

            {/* Cast & Crew Carousel */}
            {media.cast && media.cast.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Starring Cast
                </h3>
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {media.cast.map((person, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center w-16 shrink-0 space-y-1">
                      <img
                        src={person.image || (person as any).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                        alt={person.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                      <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{person.name}</div>
                      <div className="text-[9px] text-slate-500 line-clamp-1">{person.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Showtimes & Venue Selector Section */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Showtimes in {currentCity}</span>
                </h3>
              </div>

              <ShowtimeSelector
                media={media}
                currentCity={currentCity}
                currency={currency}
                userLocation={userLocation}
                isLocating={isLocating}
                onDetectLocation={onDetectLocation}
                onSelectShowtime={(st, vn) => {
                  onSelectShowtime(st, vn);
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
