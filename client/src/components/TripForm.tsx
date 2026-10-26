import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, MapPin, Users, DollarSign, Heart, 
  Compass, Luggage, Check, ChevronRight, Loader2, ArrowLeft, 
  Info, AlertTriangle, KeyRound, ExternalLink 
} from 'lucide-react';
import { TripFormData, BudgetLevel, TravelStyle } from '../types/trip';

interface TripFormProps {
  initialDestination?: string;
  onSubmit: (formData: TripFormData) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
  onCancel?: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({
  initialDestination = '',
  onSubmit,
  isLoading,
  errorMessage,
  onClearError,
  onCancel
}) => {
  // Today and 4 days later as default dates
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [destination, setDestination] = useState(initialDestination || 'Jaipur, India');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [budget, setBudget] = useState<BudgetLevel>('moderate');
  const [currency, setCurrency] = useState('USD');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelType, setTravelType] = useState<TravelStyle>('couple');
  const [interests, setInterests] = useState<string[]>([
    'Culture & History',
    'Foodie & Dining',
    'Local Hidden Gems'
  ]);
  const [customNotes, setCustomNotes] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Rotate loading steps for visual feedback during Gemini AI processing
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % 4);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const loadingMessages = [
    'Sending request to Google Gemini API backend...',
    'Synthesizing authentic landmarks, regional cuisine & culture...',
    'Calculating accurate OpenStreetMap GPS coordinates...',
    'Assembling morning, afternoon & evening timeline...'
  ];

  // Calculate days duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const calculatedDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const availableInterests = [
    { id: 'Culture & History', label: 'Culture & History', icon: '🏛️' },
    { id: 'Foodie & Dining', label: 'Foodie & Dining', icon: '🍜' },
    { id: 'Nature & Outdoors', label: 'Nature & Outdoors', icon: '🌲' },
    { id: 'Adventure & Sports', label: 'Adventure & Sports', icon: '🧗' },
    { id: 'Relaxation & Spa', label: 'Relaxation & Spa', icon: '💆' },
    { id: 'Nightlife & Drinks', label: 'Nightlife & Drinks', icon: '🍸' },
    { id: 'Photography', label: 'Photography', icon: '📸' },
    { id: 'Shopping & Markets', label: 'Shopping & Markets', icon: '🛍️' },
    { id: 'Art & Architecture', label: 'Art & Architecture', icon: '🎨' },
    { id: 'Local Hidden Gems', label: 'Local Hidden Gems', icon: '💎' }
  ];

  const travelStyles: { id: TravelStyle; label: string; desc: string; icon: string }[] = [
    { id: 'solo', label: 'Solo Explorer', desc: 'Freedom, reflection & self-paced wanderlust', icon: '🎒' },
    { id: 'couple', label: 'Couple / Romance', desc: 'Scenic dining, romantic views & shared moments', icon: '🥂' },
    { id: 'family', label: 'Family Vacation', desc: 'Comfortable pace, kid-friendly spots & safety', icon: '👨‍👩‍👧' },
    { id: 'friends', label: 'Friends Squad', desc: 'Social spots, nightlife & thrill adventures', icon: '🎉' }
  ];

  const budgetOptions: { id: BudgetLevel; title: string; subtitle: string; icon: string }[] = [
    { id: 'budget', title: 'Smart Budget', subtitle: 'Hostels, public transit & authentic street food', icon: '🪙' },
    { id: 'moderate', title: 'Comfort & Balance', subtitle: 'Charming 3-4★ stays, top cafés & curated tours', icon: '✨' },
    { id: 'luxury', title: 'Luxury & Indulgence', subtitle: '5★ boutique hotels, private transfers & fine dining', icon: '💎' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
  ];

  const toggleInterest = (interestId: string) => {
    if (onClearError) onClearError();
    if (interests.includes(interestId)) {
      if (interests.length > 1) {
        setInterests(interests.filter(i => i !== interestId));
      }
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isLoading) return;
    if (onClearError) onClearError();

    onSubmit({
      destination: destination.trim(),
      startDate,
      endDate,
      budget,
      currency,
      travelersCount,
      travelType,
      interests,
      customNotes: customNotes.trim()
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {onCancel && (
          <button
            onClick={onCancel}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to overview</span>
          </button>
        )}
        <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Real-time Google Gemini AI Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Craft Your Personalized Itinerary
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5">
          Provide your trip parameters below. WanderWise AI calls the Google Gemini backend to generate a bespoke, day-by-day itinerary with accurate OpenStreetMap coordinates.
        </p>
      </div>

      {/* Error Callout Banner if Backend Returned an Error */}
      {errorMessage && (
        <div className="mb-6 p-5 rounded-3xl bg-rose-50 border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-rose-900">
                {errorMessage.includes('Gemini API Key') || errorMessage.includes('API_KEY')
                  ? 'Gemini API Key Configuration Required'
                  : 'Trip Generation Issue'}
              </h4>
              <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>

          {(errorMessage.includes('Gemini API Key') || errorMessage.includes('API_KEY') || errorMessage.includes('.env')) && (
            <div className="mt-3 pt-3 border-t border-rose-200/80 pl-8 space-y-2 text-xs text-rose-800">
              <div className="flex items-center gap-2 font-semibold">
                <KeyRound className="w-4 h-4 text-rose-600" />
                <span>Quick Setup Instructions:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700">
                <li>
                  Get your free API key at{' '}
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-0.5"
                  >
                    Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Open the <code className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-mono">server/.env</code> file in your editor.</li>
                <li>Set <code className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-mono">GEMINI_API_KEY=your_key_here</code> and save.</li>
                <li>Click <strong>Generate Itinerary with Gemini</strong> again!</li>
              </ol>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
        
        {/* Section 1: Destination */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              1. Where is your target destination?
            </span>
            <span className="text-xs text-slate-400 font-normal">City or Country</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (onClearError) onClearError();
              }}
              placeholder="e.g. Jaipur, India or Kyoto, Japan or Paris, France"
              className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-base"
            />
            <Compass className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs text-slate-400 self-center mr-1">Try:</span>
            {['Jaipur, India', 'Kyoto, Japan', 'Paris, France', 'Bali, Indonesia', 'Swiss Alps', 'Rome, Italy'].map(dest => (
              <button
                type="button"
                key={dest}
                onClick={() => {
                  setDestination(dest);
                  if (onClearError) onClearError();
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  destination === dest 
                    ? 'bg-teal-50 border-teal-300 text-teal-700 font-bold'
                    : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Dates & Duration */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              2. Trip Dates & Duration
            </label>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              {calculatedDays} Days Duration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">Start Date</span>
              <input
                type="date"
                required
                value={startDate}
                min={todayStr}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (onClearError) onClearError();
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">End Date</span>
              <input
                type="date"
                required
                value={endDate}
                min={startDate || todayStr}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (onClearError) onClearError();
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Travelers & Travel Style */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            3. Who is traveling?
          </label>

          {/* Number of travelers counter */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Total Travelers</span>
              <span className="text-xs text-slate-500">Includes adults and children</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
              >
                -
              </button>
              <span className="w-8 text-center text-lg font-extrabold text-slate-900">
                {travelersCount}
              </span>
              <button
                type="button"
                onClick={() => setTravelersCount(Math.min(12, travelersCount + 1))}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Travel Style Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {travelStyles.map((style) => (
              <div
                key={style.id}
                onClick={() => setTravelType(style.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  travelType === style.id
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{style.label}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{style.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Budget & Currency */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              4. Budget Level & Preferred Currency
            </label>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {budgetOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setBudget(opt.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  budget === opt.id
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="text-2xl mb-2">{opt.icon}</div>
                <h4 className="font-bold text-sm text-slate-900">{opt.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Interests & Vibe */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              5. What are you most interested in?
            </span>
            <span className="text-xs text-slate-400 font-normal">Select 1 or more</span>
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableInterests.map((interest) => {
              const selected = interests.includes(interest.id);
              return (
                <button
                  type="button"
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center space-x-2 transition-all active:scale-95 ${
                    selected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{interest.icon}</span>
                  <span>{interest.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 ml-1 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 6: Custom Notes */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
            <Luggage className="w-4 h-4 text-amber-500" />
            6. Specific preferences, food or accessibility requests? (Optional)
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g. Must try authentic Dal Baati Churma, prefer evening sunset views, traveling with parents..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        {/* Google Gemini Backend Status Indicator */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-start space-x-3 text-xs text-sky-800">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Real-time Gemini Architecture:</span> Submitting this form calls your local Express backend (<code className="bg-sky-100 text-sky-900 px-1 py-0.5 rounded font-mono">POST /api/itinerary/generate</code>), which prompts Google Gemini to assemble realistic timing, day-wise activities, and coordinates.
          </div>
        </div>

        {/* Submit Button & Multi-step Loading Indicator */}
        <div className="pt-2">
          {isLoading ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border border-teal-200 flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex items-center space-x-3 text-teal-800 font-bold text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                <span>Generating Itinerary for {destination}...</span>
              </div>
              <p className="text-xs text-slate-600 font-medium animate-pulse">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!destination.trim()}
              className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-teal-500 via-sky-600 to-sky-700 hover:from-teal-600 hover:to-sky-800 shadow-lg shadow-sky-600/30 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Itinerary with Gemini AI</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
