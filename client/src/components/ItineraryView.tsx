import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Bookmark, Share2, 
  Printer, ArrowLeft, Clock, Sparkles, Check, Compass, 
  Navigation, RefreshCw, Edit3, X, Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TripPlan, Activity, DayPlan } from '../types/trip';
import { ItineraryMap } from './ItineraryMap';
import { BudgetOverview } from './BudgetOverview';
import { PackingList } from './PackingList';
import { apiService } from '../services/apiService';

interface ItineraryViewProps {
  trip: TripPlan;
  onBack: () => void;
  onSaveTrip: (trip: TripPlan) => void;
  onUpdateTrip?: (updatedTrip: TripPlan) => void;
  isSaved: boolean;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onBack,
  onSaveTrip,
  onUpdateTrip,
  isSaved
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);

  const currentDay = trip.itinerary.days.find(d => d.dayNumber === selectedDayNumber) || trip.itinerary.days[0];

  const handleSave = () => {
    onSaveTrip(trip);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle Editing an Activity
  const handleSaveEditedActivity = (updatedAct: Activity) => {
    const updatedDays = trip.itinerary.days.map(day => {
      if (day.dayNumber === selectedDayNumber) {
        return {
          ...day,
          activities: day.activities.map(act => act.id === updatedAct.id ? updatedAct : act)
        };
      }
      return day;
    });

    const updatedTrip: TripPlan = {
      ...trip,
      itinerary: {
        ...trip.itinerary,
        days: updatedDays
      }
    };

    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
    setEditingActivity(null);
  };

  // Handle Regenerating a Single Day
  const handleRegenerateCurrentDay = async () => {
    setIsRegeneratingDay(true);
    setRegenError(null);
    try {
      const newDayPlan: DayPlan = await apiService.regenerateSingleDay({
        destination: trip.destination,
        dayNumber: currentDay.dayNumber,
        date: currentDay.date,
        budget: trip.budget,
        currency: trip.currency,
        travelersCount: trip.travelersCount,
        travelType: trip.travelType,
        interests: trip.interests,
        customNotes: trip.customNotes
      });

      const updatedDays = trip.itinerary.days.map(d => 
        d.dayNumber === currentDay.dayNumber ? newDayPlan : d
      );

      const updatedTrip: TripPlan = {
        ...trip,
        itinerary: {
          ...trip.itinerary,
          days: updatedDays
        }
      };

      if (onUpdateTrip) {
        onUpdateTrip(updatedTrip);
      }
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      console.error('Failed to regenerate day:', err);
      setRegenError(err?.message || 'Could not regenerate this day with Gemini.');
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const getTimeSlotColor = (slot: Activity['timeSlot']) => {
    switch (slot) {
      case 'Morning': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Afternoon': return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Evening': return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Night': return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default: return 'bg-teal-50 text-teal-700 border-teal-200/80';
    }
  };

  const getCategoryBadge = (cat: Activity['category']) => {
    switch (cat) {
      case 'sightseeing': return { label: 'Sightseeing', color: 'bg-emerald-50 text-emerald-700' };
      case 'food': return { label: 'Dining', color: 'bg-orange-50 text-orange-700' };
      case 'culture': return { label: 'Culture & Heritage', color: 'bg-teal-50 text-teal-700' };
      case 'adventure': return { label: 'Adventure', color: 'bg-blue-50 text-blue-700' };
      default: return { label: 'Leisure', color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBack}
            className="no-print inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              {trip.durationDays} Days Itinerary
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
              {trip.travelType} Style
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
              {trip.budget} Budget
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {trip.destination}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{trip.startDate} to {trip.endDate}</span>
            <span>•</span>
            <Users className="w-4 h-4 text-slate-400" />
            <span>{trip.travelersCount} Traveler(s)</span>
          </p>
        </div>

        {/* Action Buttons (Hidden during Print) */}
        <div className="no-print flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleSave}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 shadow-xs ${
              isSaved
                ? 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-teal-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved in Library' : 'Save Itinerary'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1"
            title="Share or Copy Link"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-xs"
            title="Export to PDF via Browser Print"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Summary Highlight Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-50 via-teal-50/50 to-white border border-teal-100/80 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Curated Trip Overview</span>
        </div>
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {trip.itinerary.overview}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {trip.itinerary.highlights.map((h, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-white border border-teal-200/60 text-teal-900 font-medium shadow-xs">
              ✦ {h}
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Timeline, Right Map & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Day Tabs & Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Day Selection Tabs (Hidden during Print) */}
          <div className="no-print flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {trip.itinerary.days.map((day) => {
              const active = day.dayNumber === selectedDayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setSelectedDayNumber(day.dayNumber);
                    setSelectedActivityId(null);
                    setRegenError(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Day {day.dayNumber}
                </button>
              );
            })}
          </div>

          {/* Current Day Header Card with Regenerate Button */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                {currentDay.date || `Day ${currentDay.dayNumber}`}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {currentDay.title}
              </h2>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">
                Theme: {currentDay.theme}
              </span>
            </div>

            <div className="no-print flex items-center space-x-2 self-start sm:self-auto">
              <button
                onClick={handleRegenerateCurrentDay}
                disabled={isRegeneratingDay}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                title="Regenerate this specific day using Gemini AI"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingDay ? 'animate-spin text-teal-600' : ''}`} />
                <span>{isRegeneratingDay ? 'Regenerating...' : 'Regenerate Day'}</span>
              </button>
            </div>
          </div>

          {/* Error notice if regeneration failed */}
          {regenError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <span>{regenError}</span>
              <button onClick={() => setRegenError(null)} className="text-rose-900 font-bold ml-2">×</button>
            </div>
          )}

          {/* Activity Cards Timeline */}
          <div className="space-y-4">
            {currentDay.activities.map((act) => {
              const isSelected = act.id === selectedActivityId;
              const catBadge = getCategoryBadge(act.category);

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivityId(act.id)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-300 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getTimeSlotColor(act.timeSlot)}`}>
                        {act.timeSlot} • {act.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${catBadge.color}`}>
                        {catBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {act.duration}
                      </span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {act.estimatedCost}
                      </span>

                      {/* Edit Activity Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingActivity(act);
                        }}
                        className="no-print p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors ml-1"
                        title="Edit Activity Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Activity Title & Location */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {act.title}
                  </h3>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium mt-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="line-clamp-1">{act.locationName}</span>
                    <span className="no-print text-[10px] text-sky-600 font-semibold underline ml-1">
                      (Pin on Map)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {act.description}
                  </p>

                  {/* Pro-tip banner */}
                  {act.tips && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2 text-[11px] text-slate-600">
                      <Compass className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span><strong className="text-slate-800">Traveler Tip:</strong> {act.tips}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Leaflet Map & Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Leaflet Interactive Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600" />
                <span>Interactive Route Map</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Day {selectedDayNumber} Waypoints</span>
            </div>

            <ItineraryMap
              center={trip.itinerary.coordinates}
              destinationName={trip.destination}
              activities={currentDay.activities}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(id) => setSelectedActivityId(id)}
            />
          </div>

          {/* Budget Breakdown Card */}
          <BudgetOverview budget={trip.itinerary.estimatedBudget} />

          {/* Packing & Local Tips */}
          <PackingList
            packingTips={trip.itinerary.packingTips}
            localTips={trip.itinerary.localTips}
            weatherAdvice={trip.itinerary.weatherAdvice}
          />

        </div>

      </div>

      {/* Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Edit Activity Details</h3>
              </div>
              <button
                onClick={() => setEditingActivity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditedActivity(editingActivity);
              }}
              className="space-y-3.5 text-xs text-slate-700"
            >
              <div>
                <label className="font-bold block mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Time Slot</label>
                  <select
                    value={editingActivity.timeSlot}
                    onChange={(e) => setEditingActivity({ ...editingActivity, timeSlot: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Time (e.g. 09:30 AM)</label>
                  <input
                    type="text"
                    value={editingActivity.time}
                    onChange={(e) => setEditingActivity({ ...editingActivity, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Location Name</label>
                  <input
                    type="text"
                    value={editingActivity.locationName}
                    onChange={(e) => setEditingActivity({ ...editingActivity, locationName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Estimated Cost</label>
                  <input
                    type="text"
                    value={editingActivity.estimatedCost}
                    onChange={(e) => setEditingActivity({ ...editingActivity, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingActivity.duration}
                    onChange={(e) => setEditingActivity({ ...editingActivity, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={editingActivity.category}
                    onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Dining / Food</option>
                    <option value="culture">Culture & Heritage</option>
                    <option value="adventure">Adventure</option>
                    <option value="leisure">Leisure</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Traveler Tip</label>
                <input
                  type="text"
                  value={editingActivity.tips || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, tips: e.target.value })}
                  placeholder="e.g. Arrive early for tickets, photography spot..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
