import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Star, 
  ChevronRight, 
  X, 
  Compass, 
  Users
} from 'lucide-react';
import { MediaItem, AIRecommendationResponse, Currency } from '../types';
import { MOCK_MEDIA } from '../data/mockData';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
  currentCity: string;
  currency: Currency;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  currentCity,
  currency,
}) => {
  const [tab, setTab] = useState<'matchmaker' | 'chat'>('matchmaker');

  // Matchmaker Questionnaire State
  const [selectedMood, setSelectedMood] = useState<string>('Mind-Bending & Epic Visuals');
  const [selectedGroup, setSelectedGroup] = useState<'solo' | 'couple' | 'friends' | 'family'>('friends');
  const [selectedBudget, setSelectedBudget] = useState<'budget' | 'standard' | 'luxury'>('luxury');
  const [selectedGenre, setSelectedGenre] = useState<string>('Sci-Fi');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendationResponse | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: `Hello! I'm your Cinema AI Concierge. Ask me for movie recommendations, IMAX seating tips, or snack combos for tonight's shows in ${currentCity}!`,
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  if (!isOpen) return null;

  const moods = [
    'Mind-Bending & Epic Visuals',
    'High Adrenaline & Mass Action',
    'Wholesome Comedy & Family Entertainer',
    'Romantic & Emotional Drama',
    'Edge-of-the-Seat Crime & Mystery',
    'Mythological Grandeur & Fantasy',
  ];

  const handleRunMatchmaker = async () => {
    setIsGenerating(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          genres: [selectedGenre],
          groupType: selectedGroup,
          budgetLevel: selectedBudget,
          city: currentCity,
          mediaCatalog: MOCK_MEDIA.map((m) => ({
            id: m.id,
            title: m.title,
            genres: m.genres,
            languages: m.languages,
            formats: m.formats,
            rating: m.rating,
            description: m.description,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data);
      }
    } catch (err) {
      console.error('AI matchmaker error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: data.reply || 'I am happy to assist your cinema experience.' },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'For the best acoustic clarity, pick Laser IMAX or Dolby Atmos with Row E-G recliners!' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 my-6 text-slate-900 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">AI Cinema Assistant</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                  AI Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Personalized mood-based recommendations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setTab('matchmaker')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  tab === 'matchmaker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Vibe Matcher
              </button>
              <button
                onClick={() => setTab('chat')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  tab === 'chat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Chat
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {tab === 'matchmaker' ? (
            <div className="space-y-4">
              {/* Question 1: Mood */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-600" />
                  <span>1. What kind of vibe or mood are you craving tonight?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer ${
                        selectedMood === m
                          ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Group & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>2. Who is attending with you?</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['solo', 'couple', 'friends', 'family'] as const).map((grp) => (
                      <button
                        key={grp}
                        onClick={() => setSelectedGroup(grp)}
                        className={`p-2 rounded-xl border text-center text-xs font-medium capitalize transition cursor-pointer ${
                          selectedGroup === grp
                            ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {grp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>3. Experience Tier</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['budget', 'standard', 'luxury'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedBudget(tier)}
                        className={`p-2 rounded-xl border text-center text-xs font-medium capitalize transition cursor-pointer ${
                          selectedBudget === tier
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Trigger */}
              <button
                onClick={handleRunMatchmaker}
                disabled={isGenerating}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Analyzing Catalog with AI...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Find Tailored Shows for Me</span>
                  </>
                )}
              </button>

              {/* AI Results Presentation */}
              {aiResult && (
                <div className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in">
                  {/* Analysis Box */}
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 space-y-1">
                    <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Recommendation</span>
                    </div>
                    <p className="text-xs text-purple-950 leading-relaxed">
                      {aiResult.vibeAnalysis}
                    </p>
                    {aiResult.summaryAdvice && (
                      <div className="text-[11px] text-purple-700 font-medium">
                        💡 {aiResult.summaryAdvice}
                      </div>
                    )}
                  </div>

                  {/* Recommendation Cards */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Curated Matches
                    </div>

                    {Array.isArray(aiResult?.recommendations) && aiResult.recommendations.map((rec) => {
                      const mediaObj = MOCK_MEDIA.find((m) => m.id === rec.mediaId) || MOCK_MEDIA[0];
                      if (!mediaObj) return null;

                      return (
                        <div
                          key={rec.mediaId}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 hover:border-slate-300 transition shadow-2xs"
                        >
                          <img
                            src={mediaObj.posterUrl}
                            alt={mediaObj.title}
                            className="w-16 h-22 rounded-xl object-cover shrink-0 border border-slate-200"
                          />

                          <div className="flex-1 flex flex-col justify-between space-y-1.5">
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-sm text-slate-900">{mediaObj.title}</h4>
                                <div className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                                  {rec.matchScore}% Match
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                {rec.whyYouWillLoveIt}
                              </p>
                            </div>

                            <div className="pt-1.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-slate-500">Format:</span>
                                <span className="px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 font-mono font-medium">
                                  {rec.suggestedFormat}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  onSelectMedia(mediaObj);
                                  onClose();
                                }}
                                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                              >
                                <span>Book Show</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Chat Interface */
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 text-xs leading-relaxed ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-rose-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-purple-700">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2.5 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about movies, best seats, theaters..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
