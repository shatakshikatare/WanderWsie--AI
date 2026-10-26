export type BudgetLevel = 'budget' | 'moderate' | 'luxury';

export type TravelStyle = 'solo' | 'couple' | 'family' | 'friends';

export interface Activity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  title: string;
  description: string;
  locationName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  estimatedCost: string;
  duration: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'leisure' | 'transport';
  tips?: string;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  title: string;
  theme: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  currency: string;
  total: number;
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  buffer: number;
}

export interface ItineraryDetails {
  overview: string;
  tagline: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  days: DayPlan[];
  estimatedBudget: BudgetBreakdown;
  packingTips: string[];
  localTips: string[];
  weatherAdvice: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  budget: BudgetLevel;
  currency: string;
  travelersCount: number;
  travelType: TravelStyle;
  interests: string[];
  customNotes?: string;
  createdAt: string;
  isSaved?: boolean;
  itinerary: ItineraryDetails;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: BudgetLevel;
  currency: string;
  travelersCount: number;
  travelType: TravelStyle;
  interests: string[];
  customNotes?: string;
}
