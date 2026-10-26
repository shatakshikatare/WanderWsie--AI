import { TripPlan } from '../types/trip';

const STORAGE_KEY = 'wanderwise_saved_trips';
const RECENT_VIEW_KEY = 'wanderwise_active_trip';

export const storageService = {
  // Get all saved trips from localStorage
  getSavedTrips: (): TripPlan[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load trips from local storage:', e);
      return [];
    }
  },

  // Save a new trip or update existing
  saveTrip: (trip: TripPlan): void => {
    try {
      const trips = storageService.getSavedTrips();
      const existingIndex = trips.findIndex(t => t.id === trip.id);
      
      const tripToSave = { ...trip, isSaved: true };
      
      if (existingIndex >= 0) {
        trips[existingIndex] = tripToSave;
      } else {
        trips.unshift(tripToSave);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trip to local storage:', e);
    }
  },

  // Delete a saved trip by id
  deleteTrip: (id: string): void => {
    try {
      const trips = storageService.getSavedTrips();
      const filtered = trips.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete trip from local storage:', e);
    }
  },

  // Check if trip is saved
  isTripSaved: (id: string): boolean => {
    const trips = storageService.getSavedTrips();
    return trips.some(t => t.id === id);
  },

  // Store active/currently viewed trip in session/local storage
  setActiveTrip: (trip: TripPlan): void => {
    try {
      localStorage.setItem(RECENT_VIEW_KEY, JSON.stringify(trip));
    } catch (e) {
      console.error('Failed to set active trip:', e);
    }
  },

  // Get active/currently viewed trip
  getActiveTrip: (): TripPlan | null => {
    try {
      const data = localStorage.getItem(RECENT_VIEW_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }
};
