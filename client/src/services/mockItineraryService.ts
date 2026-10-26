import { TripFormData, TripPlan, DayPlan, Activity } from '../types/trip';

// Popular coordinates for Leaflet Maps
const DESTINATION_COORDS: Record<string, { lat: number; lng: number; tagline: string; highlights: string[] }> = {
  paris: {
    lat: 48.8566,
    lng: 2.3522,
    tagline: 'The City of Light, art, fashion, and haute cuisine.',
    highlights: ['Eiffel Tower & Seine Cruise', 'The Louvre & Montmartre', 'Sainte-Chapelle & Latin Quarter', 'Champs-Élysées & Arc de Triomphe']
  },
  kyoto: {
    lat: 35.0116,
    lng: 135.7681,
    tagline: 'Ancient temples, peaceful bamboo groves, and timeless Japanese traditions.',
    highlights: ['Fushimi Inari Taisha Torii gates', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)', 'Gion geisha district at dusk']
  },
  bali: {
    lat: -8.4095,
    lng: 115.1889,
    tagline: 'Tropical paradise of volcanic landscapes, lush rice terraces, and serene beaches.',
    highlights: ['Ubud Monkey Forest & Rice Terraces', 'Tanah Lot Sunset Temple', 'Mount Batur Sunrise Trek', 'Seminyak Beach & Beach Clubs']
  },
  tokyo: {
    lat: 35.6762,
    lng: 139.6503,
    tagline: 'Ultra-modern skyscrapers seamlessly blended with historic shrines and vibrant subcultures.',
    highlights: ['Shinjuku & Shibuya Crossing', 'Senso-ji Temple in Asakusa', 'Akihabara Electric Town', 'TeamLab Planets Digital Art']
  },
  rome: {
    lat: 41.9028,
    lng: 12.4964,
    tagline: 'The Eternal City with thousands of years of art, architecture, and world-class pasta.',
    highlights: ['The Colosseum & Roman Forum', 'Vatican City & Sistine Chapel', 'Trevi Fountain & Spanish Steps', 'Trastevere Culinary Walk']
  },
  'new york': {
    lat: 40.7128,
    lng: -74.0060,
    tagline: 'The bustling metropolis that never sleeps, packed with iconic sights, Broadway, and diverse food.',
    highlights: ['Central Park & The Met', 'Times Square & Broadway', 'High Line & Chelsea Market', 'Brooklyn Bridge at Golden Hour']
  },
  switzerland: {
    lat: 46.8182,
    lng: 8.2275,
    tagline: 'Breathtaking Alpine peaks, crystal-clear glacial lakes, and charming mountain chalets.',
    highlights: ['Jungfraujoch Top of Europe', 'Lake Lucerne Scenic Cruise', 'Zermatt & Matterhorn views', 'Interlaken Adventure Hub']
  }
};

export const generateSmartItinerary = async (formData: TripFormData): Promise<TripPlan> => {
  // Simulate AI latency for realistic Google Cloud Gemini inference feel
  await new Promise(resolve => setTimeout(resolve, 1600));

  const start = new Date(formData.startDate || Date.now());
  const end = new Date(formData.endDate || Date.now() + 4 * 24 * 60 * 60 * 1000);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  let durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  if (isNaN(durationDays) || durationDays <= 0) durationDays = 4;
  if (durationDays > 10) durationDays = 10; // Cap default display to 10 days for performance

  const lowerDest = formData.destination.trim().toLowerCase();
  const matchedKey = Object.keys(DESTINATION_COORDS).find(k => lowerDest.includes(k));
  const destinationMeta = matchedKey ? DESTINATION_COORDS[matchedKey] : {
    lat: 40.4168,
    lng: -3.7038,
    tagline: `An unforgettable journey tailored for ${formData.travelType} exploring ${formData.destination}.`,
    highlights: [
      `Historic landmark discovery in ${formData.destination}`,
      `Authentic local food tasting and market trails`,
      `Scenic panoramic viewpoints and hidden gems`,
      `Cultural immersion and community encounters`
    ]
  };

  // Generate day-by-day plan
  const days: DayPlan[] = [];
  const interests = formData.interests.length > 0 ? formData.interests : ['Culture & History', 'Local Food', 'Scenic Views'];

  const budgetMultipliers = {
    budget: 65,
    moderate: 140,
    luxury: 320
  };
  const baseDailyPerPerson = budgetMultipliers[formData.budget] || 120;
  const travelers = Math.max(1, formData.travelersCount);
  const totalEstimated = baseDailyPerPerson * durationDays * travelers;

  for (let i = 1; i <= durationDays; i++) {
    const currentDayDate = new Date(start);
    currentDayDate.setDate(start.getDate() + (i - 1));
    const dateString = currentDayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLng = (Math.random() - 0.5) * 0.05;
    const currentCoord = {
      lat: destinationMeta.lat + offsetLat,
      lng: destinationMeta.lng + offsetLng
    };

    let theme = 'Arrival & First Impressions';
    if (i === 1) theme = 'Arrival, Check-in & Neighborhood Walk';
    else if (i === durationDays) theme = 'Golden Memories, Souvenir Shopping & Departure';
    else if (i % 3 === 0) theme = `Deep Dive: ${interests[i % interests.length] || 'Heritage'}`;
    else if (i % 2 === 0) theme = `Outdoor Escapes & Culinary Delights`;
    else theme = `Hidden Gems & Local Experiences`;

    const activities: Activity[] = [
      {
        id: `d${i}-act-1`,
        timeSlot: 'Morning',
        time: '09:00 AM',
        title: i === 1 ? `Welcome to ${formData.destination}` : `Morning Exploration: Iconic Landmarks`,
        description: i === 1 
          ? `Check in to your stay, grab a freshly brewed local beverage and take an easy walking orientation around the central plaza.`
          : `Beat the mid-day queues by heading early to the city's celebrated scenic spots. Perfect time for photography and crisp morning light.`,
        locationName: `${formData.destination} Historic Center`,
        coordinates: currentCoord,
        estimatedCost: formData.budget === 'luxury' ? 'Free (Guided Private Walk)' : 'Free',
        duration: '2.5 hours',
        category: 'sightseeing',
        tips: 'Wear comfortable walking sneakers; carry a refillable water bottle.'
      },
      {
        id: `d${i}-act-2`,
        timeSlot: 'Afternoon',
        time: '01:00 PM',
        title: `Curated Lunch & Foodie Walk`,
        description: `Indulge in authentic regional delicacies recommended by locals. Savor top-rated artisanal recipes and specialty street food or bistro fare.`,
        locationName: `Old Town Artisan District`,
        coordinates: { lat: currentCoord.lat + 0.01, lng: currentCoord.lng - 0.01 },
        estimatedCost: `${formData.currency} ${Math.round(25 * (formData.budget === 'luxury' ? 2.5 : 1))}`,
        duration: '1.5 hours',
        category: 'food',
        tips: 'Ask for the chef special of the day or local seasonal recommendation.'
      },
      {
        id: `d${i}-act-3`,
        timeSlot: 'Evening',
        time: '04:30 PM',
        title: `${interests[(i + 1) % interests.length] || 'Cultural Arts'} Immersion`,
        description: `Explore renowned galleries, local artisan ateliers, or relax at scenic viewpoints watching the golden hour bathe the city.`,
        locationName: `Panoramic City Overlook & Artisan Alley`,
        coordinates: { lat: currentCoord.lat - 0.015, lng: currentCoord.lng + 0.01 },
        estimatedCost: `${formData.currency} ${Math.round(18 * (formData.budget === 'luxury' ? 2 : 1))}`,
        duration: '2.5 hours',
        category: 'culture',
        tips: 'Sunset timing is best around 5:45 PM; great for memory-capturing photos.'
      },
      {
        id: `d${i}-act-4`,
        timeSlot: 'Night',
        time: '08:00 PM',
        title: `Atmospheric Dinner & Nightwalk`,
        description: `Wind down your day with an ambient dinner, listening to live local music or strolling illuminated avenues.`,
        locationName: `Riverside Promenade & Dining Quarter`,
        coordinates: { lat: currentCoord.lat + 0.005, lng: currentCoord.lng + 0.015 },
        estimatedCost: `${formData.currency} ${Math.round(35 * (formData.budget === 'luxury' ? 3 : 1))}`,
        duration: '2 hours',
        category: 'leisure',
        tips: 'Reservations recommended on weekend evenings.'
      }
    ];

    days.push({
      dayNumber: i,
      date: dateString,
      title: `Day ${i}: ${theme}`,
      theme,
      activities
    });
  }

  const newTrip: TripPlan = {
    id: 'trip_' + Date.now(),
    destination: formData.destination,
    startDate: formData.startDate,
    endDate: formData.endDate,
    durationDays,
    budget: formData.budget,
    currency: formData.currency,
    travelersCount: formData.travelersCount,
    travelType: formData.travelType,
    interests: formData.interests,
    customNotes: formData.customNotes,
    createdAt: new Date().toISOString(),
    isSaved: false,
    itinerary: {
      overview: `A personalized ${durationDays}-day curated itinerary in ${formData.destination} crafted specifically for ${formData.travelersCount} ${formData.travelType} traveler(s) with a focus on ${interests.join(', ')}.`,
      tagline: destinationMeta.tagline,
      highlights: destinationMeta.highlights,
      coordinates: {
        lat: destinationMeta.lat,
        lng: destinationMeta.lng
      },
      days,
      estimatedBudget: {
        currency: formData.currency,
        total: totalEstimated,
        accommodation: Math.round(totalEstimated * 0.42),
        food: Math.round(totalEstimated * 0.28),
        activities: Math.round(totalEstimated * 0.16),
        transportation: Math.round(totalEstimated * 0.09),
        buffer: Math.round(totalEstimated * 0.05)
      },
      packingTips: [
        'Universal power adapter and compact portable charger',
        'Comfortable footwear for city walking and cobble streets',
        'Lightweight weather-proof jacket or compact umbrella',
        'Local currency pocket cash for street markets and tips',
        'Digital & physical photocopies of passport and travel insurance'
      ],
      localTips: [
        'Tap-to-pay credit/debit cards are widely accepted for transit and meals.',
        'Download offline Google Maps of the city before landing.',
        'Major museums often offer free or discounted evening entry on certain weekdays.',
        'Keep emergency contacts and embassy details bookmarked on your smartphone.'
      ],
      weatherAdvice: 'Mild and pleasant conditions expected. Layering your clothing is recommended for morning and evening temperature drops.'
    }
  };

  return newTrip;
};

// Initial realistic starter trips to showcase in the Dashboard
export const SAMPLE_TRIPS: TripPlan[] = [
  {
    id: 'sample_kyoto_01',
    destination: 'Kyoto, Japan',
    startDate: '2026-11-10',
    endDate: '2026-11-15',
    durationDays: 5,
    budget: 'moderate',
    currency: 'USD',
    travelersCount: 2,
    travelType: 'couple',
    interests: ['Culture & History', 'Foodie & Dining', 'Photography', 'Nature & Outdoors'],
    createdAt: '2026-10-20T10:00:00.000Z',
    isSaved: true,
    itinerary: {
      overview: 'Experience the mystical beauty of Kyoto: from thousand-gate shrines and Arashiyama bamboo forests to serene matcha ceremonies and traditional Gion streets.',
      tagline: 'Ancient temples, peaceful bamboo groves, and timeless Japanese traditions.',
      highlights: [
        'Fushimi Inari Taisha early morning Torii path',
        'Arashiyama Sagano Bamboo Path & Monkey Park',
        'Kinkaku-ji (The Golden Pavilion) reflection',
        'Evening stroll in historic Gion Shirakawa'
      ],
      coordinates: { lat: 35.0116, lng: 135.7681 },
      days: [
        {
          dayNumber: 1,
          date: 'Tue, Nov 10',
          title: 'Day 1: Arrival, Tea Tasting & Gion Walk',
          theme: 'Historic Welcome to Ancient Capital',
          activities: [
            {
              id: 'k1-1',
              timeSlot: 'Morning',
              time: '10:00 AM',
              title: 'Shinkansen Arrival & Ryokan Check-in',
              description: 'Arrive at Kyoto Station, transfer to traditional Ryokan in Higashiyama, and receive warm matcha hospitality.',
              locationName: 'Higashiyama District',
              coordinates: { lat: 34.9948, lng: 135.7850 },
              estimatedCost: 'Free',
              duration: '2 hours',
              category: 'sightseeing'
            },
            {
              id: 'k1-2',
              timeSlot: 'Afternoon',
              time: '01:30 PM',
              title: 'Kiyomizu-dera Temple & Ninenzaka Streets',
              description: 'Climb up the wooden terrace of Kiyomizu-dera overlooking maple trees, followed by traditional sweet shops along preserved cobbled lanes.',
              locationName: 'Kiyomizu-dera',
              coordinates: { lat: 34.9949, lng: 135.7850 },
              estimatedCost: '$8 entrance',
              duration: '3 hours',
              category: 'culture'
            },
            {
              id: 'k1-3',
              timeSlot: 'Evening',
              time: '06:00 PM',
              title: 'Authentic Kaiseki Dinner in Gion',
              description: 'A multi-course seasonal Japanese dining experience paired with local sake.',
              locationName: 'Gion Hanamikoji',
              coordinates: { lat: 35.0037, lng: 135.7770 },
              estimatedCost: '$65 per person',
              duration: '2 hours',
              category: 'food'
            }
          ]
        },
        {
          dayNumber: 2,
          date: 'Wed, Nov 11',
          title: 'Day 2: Sacred Gates & Golden Pavilion',
          theme: 'Spiritual Wonders & Zen Gardens',
          activities: [
            {
              id: 'k2-1',
              timeSlot: 'Morning',
              time: '07:30 AM',
              title: 'Fushimi Inari Shrine Hike',
              description: 'Walk through thousands of vermilion torii gates stretching up Mount Inari before tourist crowds arrive.',
              locationName: 'Fushimi Inari Taisha',
              coordinates: { lat: 34.9671, lng: 135.7727 },
              estimatedCost: 'Free',
              duration: '3 hours',
              category: 'adventure'
            },
            {
              id: 'k2-2',
              timeSlot: 'Afternoon',
              time: '01:00 PM',
              title: 'Nishiki Food Market Tasting',
              description: 'Sample skewers of grilled seafood, matcha ice cream, tamagoyaki omelet, and pickled vegetables.',
              locationName: 'Nishiki Market',
              coordinates: { lat: 35.0050, lng: 135.7649 },
              estimatedCost: '$25 tasting',
              duration: '2 hours',
              category: 'food'
            },
            {
              id: 'k2-3',
              timeSlot: 'Evening',
              time: '04:00 PM',
              title: 'Kinkaku-ji (Golden Pavilion)',
              description: 'Gaze upon the top two floors covered in shimmering gold leaf over the mirror pond.',
              locationName: 'Kinkaku-ji',
              coordinates: { lat: 35.0394, lng: 135.7292 },
              estimatedCost: '$5 entrance',
              duration: '2 hours',
              category: 'sightseeing'
            }
          ]
        }
      ],
      estimatedBudget: {
        currency: 'USD',
        total: 1450,
        accommodation: 620,
        food: 410,
        activities: 230,
        transportation: 120,
        buffer: 70
      },
      packingTips: [
        'Easy slip-on shoes for temple entry rituals',
        'JR Pass or reloadable IC Card (Suica/Pasmo/ICOCA)',
        'Pocket Wi-Fi or eSIM for instant translation',
        'Modest clothes covering shoulders and knees for shrines'
      ],
      localTips: [
        'Do not eat or drink while walking on historic streets.',
        'Cash is still required at small shrines and vintage eateries.',
        'Buses are great, but the subway is faster during rush hours.'
      ],
      weatherAdvice: 'Crisp autumn weather with brilliant red maple leaves. Light jacket recommended.'
    }
  },
  {
    id: 'sample_paris_02',
    destination: 'Paris, France',
    startDate: '2026-12-05',
    endDate: '2026-12-09',
    durationDays: 4,
    budget: 'luxury',
    currency: 'EUR',
    travelersCount: 2,
    travelType: 'couple',
    interests: ['Culture & History', 'Foodie & Dining', 'Art & Museums', 'Shopping'],
    createdAt: '2026-10-22T14:30:00.000Z',
    isSaved: true,
    itinerary: {
      overview: 'Romantic Parisian getaway highlighting world-famous masterworks, Michelin-starred cuisine, and breathtaking Seine views.',
      tagline: 'The City of Light, art, fashion, and haute cuisine.',
      highlights: [
        'Sunset Champagne Cruise on the Seine',
        'Private Tour of The Louvre & Musée d’Orsay',
        'Montmartre Bohemian Artists Square & Sacré-Cœur',
        'Evening dinner overlooking the illuminated Eiffel Tower'
      ],
      coordinates: { lat: 48.8566, lng: 2.3522 },
      days: [
        {
          dayNumber: 1,
          date: 'Sat, Dec 5',
          title: 'Day 1: Classic Parisian Elegance',
          theme: 'Icons of the Seine',
          activities: [
            {
              id: 'p1-1',
              timeSlot: 'Morning',
              time: '09:30 AM',
              title: 'Café de Flore Breakfast & St. Germain Walk',
              description: 'Fresh croissants, café au lait, and browsing antique bookshops in the artistic Latin quarter.',
              locationName: 'Saint-Germain-des-Prés',
              coordinates: { lat: 48.8540, lng: 2.3330 },
              estimatedCost: '€35',
              duration: '2 hours',
              category: 'food'
            },
            {
              id: 'p1-2',
              timeSlot: 'Afternoon',
              time: '01:00 PM',
              title: 'Louvre Masterpieces & Tuileries Garden',
              description: 'Marvel at the Mona Lisa, Venus de Milo, and stroll through the royal Tuileries gardens.',
              locationName: 'Musée du Louvre',
              coordinates: { lat: 48.8606, lng: 2.3376 },
              estimatedCost: '€22',
              duration: '3.5 hours',
              category: 'culture'
            },
            {
              id: 'p1-3',
              timeSlot: 'Night',
              time: '07:30 PM',
              title: 'Seine River Cruise & Sparkling Eiffel Tower',
              description: 'Bateaux-Mouches river cruise as the Eiffel Tower glitters on the top of the hour.',
              locationName: 'Port de la Bourdonnais',
              coordinates: { lat: 48.8584, lng: 2.2945 },
              estimatedCost: '€45',
              duration: '2.5 hours',
              category: 'sightseeing'
            }
          ]
        }
      ],
      estimatedBudget: {
        currency: 'EUR',
        total: 2100,
        accommodation: 980,
        food: 580,
        activities: 310,
        transportation: 130,
        buffer: 100
      },
      packingTips: [
        'Chic smart-casual attire for evenings',
        'Comfortable stylish walking boots',
        'Compact umbrella for winter showers'
      ],
      localTips: [
        'Always greet store staff with a friendly "Bonjour" when entering.',
        'Book museum tickets at least 2 weeks in advance.'
      ],
      weatherAdvice: 'Cool European winter weather. Warm coats and scarves recommended.'
    }
  }
];
