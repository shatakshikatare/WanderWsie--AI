import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateGeminiItinerary, regenerateDayWithGemini, TripGenerationRequest, RegenerateDayRequest } from './services/geminiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  res.json({
    status: 'online',
    app: 'WanderWise AI Server',
    version: '1.0.0',
    googleCloudWorkshop: true,
    geminiConfigured: hasKey,
    message: hasKey 
      ? 'Google Gemini API is configured and ready to generate itineraries.' 
      : 'GEMINI_API_KEY is not set. Please add your key to server/.env'
  });
});

// Real AI Itinerary Generation Endpoint
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budget = 'moderate',
      currency = 'USD',
      travelersCount = 1,
      travelType = 'solo',
      interests = [],
      customNotes
    } = req.body;

    // Validation
    if (!destination || typeof destination !== 'string' || !destination.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Destination is required.'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required.'
      });
    }

    const payload: TripGenerationRequest = {
      destination: destination.trim(),
      startDate,
      endDate,
      budget,
      currency,
      travelersCount: Number(travelersCount) || 1,
      travelType,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Culture & History', 'Local Food'],
      customNotes: customNotes ? String(customNotes).trim() : undefined
    };

    console.log(`[AI Request] Generating itinerary for: ${payload.destination} (${payload.travelersCount} travelers, ${payload.budget} budget)`);

    // Call Gemini API
    const itineraryDetails = await generateGeminiItinerary(payload);

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    let durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(durationDays) || durationDays <= 0) durationDays = itineraryDetails.days.length || 3;

    // Package into complete TripPlan object
    const tripPlan = {
      id: 'trip_' + Date.now(),
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      durationDays,
      budget: payload.budget,
      currency: payload.currency,
      travelersCount: payload.travelersCount,
      travelType: payload.travelType,
      interests: payload.interests,
      customNotes: payload.customNotes,
      createdAt: new Date().toISOString(),
      isSaved: false,
      itinerary: itineraryDetails
    };

    console.log(`[AI Success] Generated ${itineraryDetails.days.length} days for ${payload.destination}`);
    return res.json({
      success: true,
      data: tripPlan
    });

  } catch (error: any) {
    console.error('[AI Error]', error);

    if (error.message === 'MISSING_API_KEY') {
      return res.status(503).json({
        success: false,
        errorCode: 'MISSING_API_KEY',
        error: 'Gemini API Key is not configured. Please add your GEMINI_API_KEY to server/.env file. See README for details.'
      });
    }

    // Google API Quota / Key invalid errors
    if (error.status === 400 || error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      return res.status(401).json({
        success: false,
        errorCode: 'INVALID_API_KEY',
        error: 'The provided Gemini API Key is invalid. Please verify the key in server/.env.'
      });
    }

    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        success: false,
        errorCode: 'RATE_LIMIT',
        error: 'Gemini API rate limit reached. Please wait a few seconds before trying again.'
      });
    }

    return res.status(500).json({
      success: false,
      errorCode: 'GENERATION_FAILED',
      error: error.message || 'Failed to generate itinerary with Google Gemini AI. Please check server logs.'
    });
  }
});

// Single Day Regeneration Endpoint
app.post('/api/itinerary/regenerate-day', async (req: Request, res: Response) => {
  try {
    const {
      destination,
      dayNumber,
      date,
      budget = 'moderate',
      currency = 'USD',
      travelersCount = 1,
      travelType = 'solo',
      interests = [],
      customNotes
    } = req.body;

    if (!destination || !dayNumber) {
      return res.status(400).json({
        success: false,
        error: 'Destination and dayNumber are required.'
      });
    }

    const payload: RegenerateDayRequest = {
      destination: String(destination).trim(),
      dayNumber: Number(dayNumber),
      date: date ? String(date) : undefined,
      budget,
      currency,
      travelersCount: Number(travelersCount) || 1,
      travelType,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Culture & History', 'Local Food'],
      customNotes: customNotes ? String(customNotes).trim() : undefined
    };

    console.log(`[AI Day Regen] Regenerating Day ${payload.dayNumber} for ${payload.destination}`);
    const newDayPlan = await regenerateDayWithGemini(payload);

    return res.json({
      success: true,
      data: newDayPlan
    });

  } catch (error: any) {
    console.error('[AI Day Regen Error]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to regenerate day plan with Gemini AI.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 WanderWise AI Express backend running on http://localhost:${PORT}`);
  console.log(`🔍 Health check available at: http://localhost:${PORT}/api/health`);
});
