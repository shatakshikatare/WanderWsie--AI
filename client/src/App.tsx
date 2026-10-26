import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripForm } from './components/TripForm';
import { ItineraryView } from './components/ItineraryView';
import { SavedTrips } from './components/SavedTrips';
import { WorkshopInfo } from './components/WorkshopInfo';
import { Footer } from './components/Footer';
import { TripPlan, TripFormData } from './types/trip';
import { storageService } from './services/storageService';
import { SAMPLE_TRIPS } from './services/mockItineraryService';
import { apiService, BackendHealthResponse } from './services/apiService';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'plan' | 'itinerary' | 'saved' | 'workshop'>('home');
  const [activeTrip, setActiveTrip] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefillDestination, setPrefillDestination] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<BackendHealthResponse | null>(null);

  // Initialize saved trips on mount & check backend health
  useEffect(() => {
    const existing = storageService.getSavedTrips();
    if (existing.length === 0) {
      SAMPLE_TRIPS.forEach(t => storageService.saveTrip(t));
      setSavedTrips(SAMPLE_TRIPS);
    } else {
      setSavedTrips(existing);
    }

    const lastActive = storageService.getActiveTrip();
    if (lastActive) {
      setActiveTrip(lastActive);
    } else if (SAMPLE_TRIPS.length > 0) {
      setActiveTrip(SAMPLE_TRIPS[0]);
    }

    // Check backend health
    apiService.checkHealth().then(health => {
      setBackendHealth(health);
    });
  }, []);

  // Handle REAL trip generation from backend Express + Google Gemini API
  const handleCreateTrip = async (formData: TripFormData) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      // Call the real Express backend + Gemini API
      const generatedTrip = await apiService.generateItineraryWithAI(formData);
      setActiveTrip(generatedTrip);
      storageService.setActiveTrip(generatedTrip);
      setCurrentTab('itinerary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Failed to generate itinerary with Gemini API:', error);
      setGenerationError(
        error.message || 'An error occurred while connecting to Google Gemini API. Please check your backend connection and .env file.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Save/Bookmark active trip
  const handleSaveActiveTrip = (trip: TripPlan) => {
    storageService.saveTrip(trip);
    setSavedTrips(storageService.getSavedTrips());
    if (activeTrip?.id === trip.id) {
      setActiveTrip({ ...trip, isSaved: true });
    }
  };

  // Delete trip from library
  const handleDeleteTrip = (id: string) => {
    if (window.confirm('Are you sure you want to remove this trip from your saved library?')) {
      storageService.deleteTrip(id);
      setSavedTrips(storageService.getSavedTrips());
      if (activeTrip?.id === id) {
        setActiveTrip(null);
      }
    }
  };

  // Update an edited or regenerated trip
  const handleUpdateTrip = (updatedTrip: TripPlan) => {
    setActiveTrip(updatedTrip);
    storageService.setActiveTrip(updatedTrip);
    if (savedTrips.some(t => t.id === updatedTrip.id)) {
      storageService.saveTrip(updatedTrip);
      setSavedTrips(storageService.getSavedTrips());
    }
  };

  // Open existing trip from sample or saved trips
  const handleOpenTrip = (trip: TripPlan) => {
    setActiveTrip(trip);
    storageService.setActiveTrip(trip);
    setCurrentTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start planning flow
  const handleStartPlanning = (dest?: string) => {
    if (dest) {
      setPrefillDestination(dest);
    } else {
      setPrefillDestination('');
    }
    setGenerationError(null);
    setCurrentTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setGenerationError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedTripsCount={savedTrips.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Hero
            onStartPlanning={handleStartPlanning}
            onViewSample={handleOpenTrip}
            sampleTrips={SAMPLE_TRIPS}
          />
        )}

        {currentTab === 'plan' && (
          <TripForm
            initialDestination={prefillDestination}
            onSubmit={handleCreateTrip}
            isLoading={isGenerating}
            errorMessage={generationError}
            onClearError={() => setGenerationError(null)}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'itinerary' && (
          activeTrip ? (
            <ItineraryView
              trip={activeTrip}
              onBack={() => setCurrentTab('saved')}
              onSaveTrip={handleSaveActiveTrip}
              onUpdateTrip={handleUpdateTrip}
              isSaved={savedTrips.some(t => t.id === activeTrip.id)}
            />
          ) : (
            <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">No active itinerary selected</h2>
              <p className="text-slate-500 text-sm">
                Generate a new itinerary or choose from your saved trips library.
              </p>
              <button
                onClick={() => setCurrentTab('plan')}
                className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700"
              >
                Plan a Trip
              </button>
            </div>
          )
        )}

        {currentTab === 'saved' && (
          <SavedTrips
            trips={savedTrips}
            onSelectTrip={handleOpenTrip}
            onDeleteTrip={handleDeleteTrip}
            onCreateNew={() => handleStartPlanning()}
          />
        )}

        {currentTab === 'workshop' && (
          <WorkshopInfo />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setGenerationError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
