import React, { useState } from 'react';
import { 
  Sparkles, Compass, MapPin, Calendar, ArrowRight, ShieldCheck, 
  Map, DollarSign, Cloud, Zap, Luggage, Star, Clock, Users 
} from 'lucide-react';
import { TripPlan } from '../types/trip';

interface HeroProps {
  onStartPlanning: (destination?: string) => void;
  onViewSample: (trip: TripPlan) => void;
  sampleTrips: TripPlan[];
}

export const Hero: React.FC<HeroProps> = ({ onStartPlanning, onViewSample, sampleTrips }) => {
  const [quickSearch, setQuickSearch] = useState('');

  const popularDestinations = [
    { name: 'Kyoto, Japan', image: '⛩️', tag: 'Temples & Tea' },
    { name: 'Paris, France', image: '🥐', tag: 'Art & Cuisine' },
    { name: 'Bali, Indonesia', image: '🌴', tag: 'Beaches & Waterfalls' },
    { name: 'Swiss Alps', image: '🏔️', tag: 'Hiking & Chalets' },
    { name: 'Rome, Italy', image: '🏛️', tag: 'History & Gelato' }
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onStartPlanning(quickSearch.trim());
    } else {
      onStartPlanning();
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Background glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-200/50 via-teal-100/40 to-blue-200/40 blur-3xl -z-10 rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-sky-50/80 border border-sky-200/80 shadow-xs text-sky-800 text-xs sm:text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-ping" />
            <Cloud className="w-4 h-4 text-sky-600" />
            <span>Built for Google Cloud Workshop • AI Travel Engine</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Plan Your Dream Adventure in Seconds with{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                WanderWise AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
              Tell our smart assistant where you want to go. Get tailored day-by-day itineraries, interactive Leaflet maps, realistic budget forecasts, and local hidden gems in a snap.
            </p>
          </div>

          {/* Hero Quick Search Box */}
          <div className="max-w-2xl mx-auto">
            <form 
              onSubmit={handleQuickSubmit}
              className="p-2 sm:p-2.5 bg-white/95 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center px-3 w-full sm:w-auto flex-1 text-slate-700">
                <MapPin className="w-5 h-5 text-teal-600 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Where do you want to explore? (e.g. Kyoto, Paris, Bali...)"
                  className="w-full py-2 bg-transparent text-sm sm:text-base font-medium placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-teal-500 via-sky-600 to-sky-700 hover:from-teal-600 hover:to-sky-800 shadow-md shadow-sky-600/25 transition-all duration-200 flex items-center justify-center space-x-2 shrink-0 active:scale-95"
              >
                <span>Generate Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick destination chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 font-medium mr-1">Trending now:</span>
              {popularDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => onStartPlanning(dest.name)}
                  className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-teal-700 border border-slate-200/80 hover:border-teal-300 shadow-xs transition-all flex items-center space-x-1.5 group"
                >
                  <span>{dest.image}</span>
                  <span className="font-medium">{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto border-t border-slate-200/60">
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">10,000+</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">Itineraries Generated</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">120+</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">Global Cities Supported</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">100%</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">Tailored to Your Budget</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.9 / 5</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium">Workshop Rating ⭐</div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Modern Explorers & Tech Enthusiasts
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need for hassle-free travel planning, built with Google Cloud AI principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gemini-Powered Intelligence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Synthesizes timing, distance, local rhythms, and travel styles to formulate sensible day-by-day schedules without burnout.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Interactive OpenStreetMap</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Integrated with Leaflet.js to pinpoint daily monuments, restaurants, and scenic spots with zoomable geographic coordinates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Budget Allocation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automatically forecasts realistic expenditure for lodging, dining, experiences, and transit across your chosen currency.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Starter Itineraries */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Inspiration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Pre-built Sample Trips</h2>
            <p className="text-sm text-slate-600 mt-1">Click any trip below to test the full day-by-day itinerary view right away.</p>
          </div>

          <button
            onClick={() => onStartPlanning()}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            <span>Or plan custom destination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {trip.durationDays} Days • {trip.travelType}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-teal-700 transition-colors">
                      {trip.destination}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium">Est. Total</span>
                    <div className="text-lg font-extrabold text-teal-700">
                      {trip.itinerary.estimatedBudget.currency} {trip.itinerary.estimatedBudget.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {trip.itinerary.overview}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {trip.itinerary.highlights.slice(0, 3).map((hl, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-teal-50/70 text-teal-800 font-medium border border-teal-100/60"
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {trip.durationDays} Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {trip.travelersCount} Traveler(s)
                  </span>
                </div>

                <button
                  onClick={() => onViewSample(trip)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center space-x-1"
                >
                  <span>Open Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop Callout Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-teal-200">
              Google Cloud Workshop Ready
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to generate your custom travel roadmap?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step through our interactive form, choose your budget, pace, and interests, and watch WanderWise AI synthesize your personalized plan.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartPlanning()}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-teal-50 hover:text-teal-900 shadow-lg transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Start Planning Now</span>
              </button>
            </div>
          </div>

          {/* Decorative geometric shapes */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
          <div className="absolute right-16 top-10 opacity-20 pointer-events-none hidden lg:block">
            <Compass className="w-48 h-48 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
};
