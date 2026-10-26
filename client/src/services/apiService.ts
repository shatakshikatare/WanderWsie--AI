import { TripFormData, TripPlan, DayPlan } from '../types/trip';

const API_BASE = 'http://localhost:5000/api';

export interface BackendHealthResponse {
  status: string;
  app: string;
  version: string;
  googleCloudWorkshop: boolean;
  geminiConfigured: boolean;
  message: string;
}

export const apiService = {
  // Check health and whether Gemini API Key is configured on the backend
  checkHealth: async (): Promise<BackendHealthResponse | null> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend server not reachable at localhost:5000:', err);
      return null;
    }
  },

  // Call the real Express backend + Gemini API endpoint
  generateItineraryWithAI: async (formData: TripFormData): Promise<TripPlan> => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/itinerary/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (networkError: any) {
      throw new Error(
        'Unable to reach WanderWise AI backend server. Please make sure the backend is running on port 5000.'
      );
    }

    const data = await res.json();

    if (!res.ok || !data.success) {
      const errorMessage = data.error || 'Failed to generate itinerary with Google Gemini AI.';
      const errorCode = data.errorCode || 'UNKNOWN_ERROR';
      const customErr: any = new Error(errorMessage);
      customErr.code = errorCode;
      throw customErr;
    }

    return data.data as TripPlan;
  },

  // Regenerate a single day with Gemini AI
  regenerateSingleDay: async (payload: {
    destination: string;
    dayNumber: number;
    date?: string;
    budget: string;
    currency: string;
    travelersCount: number;
    travelType: string;
    interests: string[];
    customNotes?: string;
  }): Promise<DayPlan> => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/itinerary/regenerate-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (networkError: any) {
      throw new Error('Unable to connect to backend server for day regeneration.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to regenerate day with Gemini AI.');
    }

    return data.data as DayPlan;
  }
};
