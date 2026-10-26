import { GoogleGenAI } from '@google/genai';

export interface TripGenerationRequest {
  destination: string;
  startDate: string;
  endDate: string;
  durationDays?: number;
  budget: 'budget' | 'moderate' | 'luxury';
  currency: string;
  travelersCount: number;
  travelType: string;
  interests: string[];
  customNotes?: string;
}

export interface Activity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  title: string;
  description: string;
  locationName: string;
  coordinates: {
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

export interface ItineraryDetails {
  overview: string;
  tagline: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  days: DayPlan[];
  estimatedBudget: {
    currency: string;
    total: number;
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
    buffer: number;
  };
  packingTips: string[];
  localTips: string[];
  weatherAdvice: string;
}

/**
 * Robust JSON extractor that retrieves only the JSON payload between the first '{' and last '}'
 */
function extractPureJson(text: string): string {
  let clean = text.trim();
  // Remove markdown code fence if present
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return clean.substring(firstBrace, lastBrace + 1);
  }
  return clean;
}

/**
 * Validates and normalizes the parsed JSON from Gemini to ensure complete structure
 */
function validateAndNormalizeItinerary(raw: any, req: TripGenerationRequest, durationDays: number): ItineraryDetails {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Gemini returned an invalid non-object response');
  }

  // Ensure coordinates
  const lat = typeof raw.coordinates?.lat === 'number' ? raw.coordinates.lat : 26.9124;
  const lng = typeof raw.coordinates?.lng === 'number' ? raw.coordinates.lng : 75.7873;

  // Ensure days array
  let days: DayPlan[] = [];
  if (Array.isArray(raw.days) && raw.days.length > 0) {
    days = raw.days.map((day: any, dIdx: number) => {
      const dayNum = typeof day.dayNumber === 'number' ? day.dayNumber : dIdx + 1;
      const activities: Activity[] = Array.isArray(day.activities) ? day.activities.map((act: any, aIdx: number) => {
        return {
          id: act.id || `d${dayNum}-act-${aIdx + 1}`,
          timeSlot: ['Morning', 'Afternoon', 'Evening', 'Night'].includes(act.timeSlot) 
            ? act.timeSlot 
            : (aIdx === 0 ? 'Morning' : aIdx === 1 ? 'Afternoon' : aIdx === 2 ? 'Evening' : 'Night'),
          time: act.time || '10:00 AM',
          title: act.title || `Explore ${req.destination}`,
          description: act.description || `Discover the culture, atmosphere, and sights of ${req.destination}.`,
          locationName: act.locationName || req.destination,
          coordinates: {
            lat: typeof act.coordinates?.lat === 'number' ? act.coordinates.lat : (lat + (Math.random() - 0.5) * 0.04),
            lng: typeof act.coordinates?.lng === 'number' ? act.coordinates.lng : (lng + (Math.random() - 0.5) * 0.04)
          },
          estimatedCost: act.estimatedCost || 'Free',
          duration: act.duration || '2 hours',
          category: ['sightseeing', 'food', 'adventure', 'culture', 'leisure', 'transport'].includes(act.category) 
            ? act.category 
            : 'sightseeing',
          tips: act.tips || 'Wear comfortable walking shoes and stay hydrated.'
        };
      }) : [];

      return {
        dayNumber: dayNum,
        date: day.date || `Day ${dayNum}`,
        title: day.title || `Day ${dayNum}: Exploring ${req.destination}`,
        theme: day.theme || 'Discovery & Adventure',
        activities
      };
    });
  }

  // Fallback day if empty
  if (days.length === 0) {
    days = [{
      dayNumber: 1,
      date: 'Day 1',
      title: `Welcome to ${req.destination}`,
      theme: 'Arrival & City Walk',
      activities: [{
        id: 'd1-act-1',
        timeSlot: 'Morning',
        time: '10:00 AM',
        title: `Explore Central ${req.destination}`,
        description: `Orientation walk around the historic city center and cultural landmarks.`,
        locationName: req.destination,
        coordinates: { lat, lng },
        estimatedCost: 'Free',
        duration: '2.5 hours',
        category: 'sightseeing',
        tips: 'Start early to beat the heat.'
      }]
    }];
  }

  // Ensure estimated budget
  const b = raw.estimatedBudget || {};
  const total = typeof b.total === 'number' ? b.total : (durationDays * req.travelersCount * (req.budget === 'luxury' ? 300 : req.budget === 'budget' ? 60 : 130));
  const estimatedBudget = {
    currency: b.currency || req.currency || 'USD',
    total: Math.round(total),
    accommodation: Math.round(typeof b.accommodation === 'number' ? b.accommodation : total * 0.42),
    food: Math.round(typeof b.food === 'number' ? b.food : total * 0.28),
    activities: Math.round(typeof b.activities === 'number' ? b.activities : total * 0.16),
    transportation: Math.round(typeof b.transportation === 'number' ? b.transportation : total * 0.09),
    buffer: Math.round(typeof b.buffer === 'number' ? b.buffer : total * 0.05)
  };

  return {
    overview: raw.overview || `A tailored travel plan for ${req.destination} focusing on ${req.interests.join(', ')}.`,
    tagline: raw.tagline || `Experience the true essence of ${req.destination}.`,
    highlights: Array.isArray(raw.highlights) && raw.highlights.length > 0
      ? raw.highlights
      : [`Explore landmark attractions in ${req.destination}`, 'Savor authentic regional cuisine', 'Experience rich local culture'],
    coordinates: { lat, lng },
    days,
    estimatedBudget,
    packingTips: Array.isArray(raw.packingTips) && raw.packingTips.length > 0
      ? raw.packingTips
      : ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Portable battery bank', 'Local currency for small shops'],
    localTips: Array.isArray(raw.localTips) && raw.localTips.length > 0
      ? raw.localTips
      : ['Download offline maps for easy navigation', 'Respect local cultural dress codes at sacred monuments', 'Keep emergency numbers handy'],
    weatherAdvice: raw.weatherAdvice || 'Pleasant weather anticipated; check the local 3-day forecast before heading out.'
  };
}

/**
 * Calls Google Gemini API with intelligent model cascade
 */
export async function generateGeminiItinerary(req: TripGenerationRequest): Promise<ItineraryDetails> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  // Calculate duration
  const start = new Date(req.startDate);
  const end = new Date(req.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  let durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  if (isNaN(durationDays) || durationDays <= 0) durationDays = 3;
  if (durationDays > 10) durationDays = 10; // Cap to 10 days for prompt token limits

  const prompt = `
You are WanderWise AI, an expert travel architect designed for Google Cloud AI solutions.
Create a rich, authentic, and highly personalized day-by-day travel itinerary for:
- Destination: ${req.destination}
- Duration: ${durationDays} days (From ${req.startDate} to ${req.endDate})
- Travelers: ${req.travelersCount} (${req.travelType} travel style)
- Budget Level: ${req.budget} (in ${req.currency})
- Selected Interests: ${req.interests.join(', ')}
${req.customNotes ? `- Traveler Custom Preferences / Dietary: ${req.customNotes}` : ''}

CRITICAL RULES:
1. Provide REAL, accurate geographic coordinates (latitude and longitude) for ${req.destination} and for each specific activity/monument/restaurant so Leaflet OpenStreetMap pins render accurately.
2. For every single day, include 3 to 4 chronological activities covering Morning, Afternoon, Evening, and Night.
3. Include specific local food recommendations, authentic dish names, and top local eateries.
4. Output MUST be ONLY valid, parseable JSON matching the exact schema below. Do not include markdown code block backticks (like \`\`\`json). Output plain JSON.

JSON SCHEMA REQUIREMENT:
{
  "overview": "Engaging 2-3 sentence summary of this personalized journey",
  "tagline": "A catchy, evocative 1-sentence tagline",
  "highlights": ["3 to 5 key highlights"],
  "coordinates": { "lat": number, "lng": number },
  "days": [
    {
      "dayNumber": 1,
      "date": "e.g. Mon, Nov 15",
      "title": "Day 1 Title",
      "theme": "Theme of the day",
      "activities": [
        {
          "id": "d1-act-1",
          "timeSlot": "Morning",
          "time": "09:00 AM",
          "title": "Specific attraction or activity name",
          "description": "Rich 2-3 sentence experiential description with sensory details and historical/cultural context",
          "locationName": "Real place name in ${req.destination}",
          "coordinates": { "lat": number, "lng": number },
          "estimatedCost": "Cost formatted in ${req.currency} or 'Free'",
          "duration": "e.g. 2.5 hours",
          "category": "sightseeing", // One of: sightseeing, food, adventure, culture, leisure, transport
          "tips": "Practical tip (e.g. best photo angle, shoes, ticket booking, timing)"
        }
      ]
    }
  ],
  "estimatedBudget": {
    "currency": "${req.currency}",
    "total": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "transportation": number,
    "buffer": number
  },
  "packingTips": ["4 to 5 essential packing recommendations specific to the climate and culture of ${req.destination}"],
  "localTips": ["4 to 5 insider etiquette, safety, transit, and money-saving tips"],
  "weatherAdvice": "Accurate climate advice for traveling during ${req.startDate}"
}
`;

  const ai = new GoogleGenAI({ apiKey });
  
  // Model priority cascade
  const modelCandidates = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite'
  ];

  let responseText = '';
  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      console.log(`[Gemini AI] Attempting inference with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      if (response && response.text) {
        responseText = response.text;
        console.log(`[Gemini AI] Successfully generated response with model: ${modelName}`);
        break;
      }
    } catch (err: any) {
      console.warn(`[Gemini AI] Model ${modelName} failed:`, err?.message || err);
      lastError = err;
    }
  }

  if (!responseText) {
    throw lastError || new Error('All Gemini model candidates failed to generate content');
  }

  const cleanJson = extractPureJson(responseText);
  const parsed = JSON.parse(cleanJson);
  return validateAndNormalizeItinerary(parsed, req, durationDays);
}

export interface RegenerateDayRequest {
  destination: string;
  dayNumber: number;
  date?: string;
  budget: 'budget' | 'moderate' | 'luxury';
  currency: string;
  travelersCount: number;
  travelType: string;
  interests: string[];
  customNotes?: string;
}

/**
 * Regenerates an individual day plan using Google Gemini AI
 */
export async function regenerateDayWithGemini(req: RegenerateDayRequest): Promise<DayPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const prompt = `
You are WanderWise AI.
Regenerate a FRESH, ALTERNATIVE itinerary specifically for Day ${req.dayNumber} in ${req.destination}.
- Date: ${req.date || `Day ${req.dayNumber}`}
- Travelers: ${req.travelersCount} (${req.travelType} travel style)
- Budget Level: ${req.budget} (in ${req.currency})
- Selected Interests: ${req.interests.join(', ')}
${req.customNotes ? `- Custom Preferences: ${req.customNotes}` : ''}

CRITICAL RULES:
1. Provide REAL, accurate geographic coordinates (latitude and longitude) for each activity in ${req.destination}.
2. Include 3 to 4 chronological activities covering Morning, Afternoon, Evening, and Night.
3. Suggest exciting alternative local gems, eateries, or cultural sights.
4. Output MUST be ONLY valid JSON matching this schema:
{
  "dayNumber": ${req.dayNumber},
  "date": "${req.date || `Day ${req.dayNumber}`}",
  "title": "Captivating Title for Day ${req.dayNumber}",
  "theme": "Thematic Focus for the day",
  "activities": [
    {
      "id": "d${req.dayNumber}-act-1",
      "timeSlot": "Morning",
      "time": "09:00 AM",
      "title": "Specific attraction or activity name",
      "description": "Rich 2-3 sentence experiential description",
      "locationName": "Real landmark or restaurant name in ${req.destination}",
      "coordinates": { "lat": number, "lng": number },
      "estimatedCost": "Cost formatted in ${req.currency} or 'Free'",
      "duration": "e.g. 2.5 hours",
      "category": "sightseeing",
      "tips": "Practical tip"
    }
  ]
}
`;

  const ai = new GoogleGenAI({ apiKey });
  const modelCandidates = [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite'
  ];

  let responseText = '';
  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        }
      });

      if (response && response.text) {
        responseText = response.text;
        break;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  if (!responseText) {
    throw lastError || new Error('Failed to regenerate day with Gemini');
  }

  const cleanJson = extractPureJson(responseText);
  const parsed = JSON.parse(cleanJson);

  // Validate day structure
  const activities: Activity[] = Array.isArray(parsed.activities) ? parsed.activities.map((act: any, idx: number) => ({
    id: act.id || `d${req.dayNumber}-act-${idx + 1}-${Date.now()}`,
    timeSlot: ['Morning', 'Afternoon', 'Evening', 'Night'].includes(act.timeSlot) 
      ? act.timeSlot 
      : (idx === 0 ? 'Morning' : idx === 1 ? 'Afternoon' : idx === 2 ? 'Evening' : 'Night'),
    time: act.time || '10:00 AM',
    title: act.title || `Explore ${req.destination}`,
    description: act.description || `Discover local sights and flavors in ${req.destination}.`,
    locationName: act.locationName || req.destination,
    coordinates: {
      lat: typeof act.coordinates?.lat === 'number' ? act.coordinates.lat : 26.9124,
      lng: typeof act.coordinates?.lng === 'number' ? act.coordinates.lng : 75.7873
    },
    estimatedCost: act.estimatedCost || 'Free',
    duration: act.duration || '2 hours',
    category: ['sightseeing', 'food', 'adventure', 'culture', 'leisure', 'transport'].includes(act.category)
      ? act.category
      : 'sightseeing',
    tips: act.tips || 'Wear comfortable shoes.'
  })) : [];

  return {
    dayNumber: req.dayNumber,
    date: parsed.date || req.date || `Day ${req.dayNumber}`,
    title: parsed.title || `Day ${req.dayNumber}: Rediscovering ${req.destination}`,
    theme: parsed.theme || 'Exploration & Culture',
    activities
  };
}

