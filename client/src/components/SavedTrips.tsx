import React from 'react';
import { 
  Bookmark, Calendar, Users, DollarSign, Trash2, ArrowRight, 
  MapPin, PlusCircle, Sparkles, Compass, CheckCircle2 
} from 'lucide-react';
import { TripPlan } from '../types/trip';

interface SavedTripsProps {
  trips: TripPlan[];
  onSelectTrip: (trip: TripPlan) => void;
  onDeleteTrip: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedTrips: React.FC<SavedTripsProps> = ({
  trips,
  onSelectTrip,
  onDeleteTrip,
  onCreateNew
}) => {
  // Aggregate stats
  const totalDays = trips.reduce((acc, t) => acc + t.durationDays, 0);
  const uniqueDestinations = new Set(trips.map(t => t.destination)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Travel Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Saved Itineraries
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review, manage, or reopen your personalized travel plans anytime.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-600 hover:to-sky-700 shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{trips.length}</span>
            <span className="block text-xs text-slate-500 font-medium">Saved Trips</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{uniqueDestinations}</span>
            <span className="block text-xs text-slate-500 font-medium">Unique Destinations</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{totalDays}</span>
            <span className="block text-xs text-slate-500 font-medium">Total Travel Days Mapped</span>
          </div>
        </div>
      </div>

      {/* Trips List / Empty State */}
      {trips.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved itineraries yet</h3>
          <p className="text-sm text-slate-500">
            Create your first AI-generated trip with WanderWise AI. You can bookmark and view all your saved journeys right here.
          </p>
          <div className="pt-2">
            <button
              onClick={onCreateNew}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all inline-flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                    {trip.durationDays} Days • {trip.travelType}
                  </span>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Saved Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trip.startDate} to {trip.endDate}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {trip.itinerary.overview}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {trip.itinerary.highlights.slice(0, 2).map((hl, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Budget</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {trip.itinerary.estimatedBudget.currency} {trip.itinerary.estimatedBudget.total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onSelectTrip(trip)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-sky-700 bg-white border border-sky-200 hover:bg-sky-50 shadow-xs transition-colors flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
