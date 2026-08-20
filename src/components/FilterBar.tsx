import React from 'react';
import { Film, Sparkles, TrendingUp, Clapperboard, Calendar } from 'lucide-react';

export type MovieFilterCategory = 'all' | 'now_showing' | 'trending' | 'imax' | 'advance';

interface FilterBarProps {
  activeCategory: MovieFilterCategory;
  onSelectCategory: (category: MovieFilterCategory) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedFormat: string;
  onSelectFormat: (fmt: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedLanguage,
  onSelectLanguage,
  selectedGenre,
  onSelectGenre,
  selectedFormat,
  onSelectFormat,
}) => {
  const categories: { id: MovieFilterCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Movies', icon: Film },
    { id: 'now_showing', label: 'Now Showing', icon: Sparkles },
    { id: 'trending', label: 'Trending & Hits', icon: TrendingUp },
    { id: 'imax', label: 'IMAX & 3D', icon: Clapperboard },
    { id: 'advance', label: 'Advance Booking', icon: Calendar },
  ];

  const languages = ['All', 'Telugu', 'Hindi', 'Tamil', 'English', 'Malayalam', 'Kannada'];
  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Superhero', 'Crime'];
  const formats = ['All', 'Laser IMAX', 'Dolby Atmos', '4DX', 'ScreenX', '3D', '2D'];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 px-3 sm:px-6 space-y-2">
      {/* Movie Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs shadow-rose-200 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Genre, Language & Format Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        {/* Genre Pill Selection */}
        <span className="text-slate-400 font-medium text-[11px] shrink-0">Genre:</span>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => onSelectGenre(g)}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs font-medium whitespace-nowrap ${
              selectedGenre === g
                ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {g}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

        {/* Language Selection */}
        <span className="text-slate-400 font-medium text-[11px] shrink-0">Language:</span>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelectLanguage(lang)}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs font-medium whitespace-nowrap ${
              selectedLanguage === lang
                ? 'bg-rose-50 text-rose-700 border border-rose-300 font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {lang}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

        {/* Format Selection */}
        <span className="text-slate-400 font-medium text-[11px] shrink-0">Format:</span>
        {formats.map((fmt) => (
          <button
            key={fmt}
            onClick={() => onSelectFormat(fmt)}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs font-medium whitespace-nowrap ${
              selectedFormat === fmt
                ? 'bg-sky-50 text-sky-700 border border-sky-300 font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
    </div>
  );
};
