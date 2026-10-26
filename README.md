# 🌍 WanderWise AI — Smart Travel Itinerary Planner

[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Workshop%20Project-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-API%20Integrated-8E75C2?logo=googlegemini&logoColor=white)](https://aistudio.google.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An intelligent, full-stack travel itinerary planner built for the **Google Cloud Developer Workshop**. Powered by **Google Gemini AI**, **React**, **Express**, and **Leaflet & OpenStreetMap**, WanderWise AI synthesizes deeply personalized, day-by-day travel roadmaps with real-world geographic coordinates, budget forecasts, and insider cultural recommendations.

---

## 📸 Overview & Key Highlights

* **Personalized AI Planning**: Generates customized itineraries based on destination, dates, budget level, traveler count, travel style (solo, couple, family, friends), and specific interests.
* **Interactive OpenStreetMap & Leaflet**: Pinpoints daily landmarks, restaurants, and scenic spots with custom numbered map pins and auto-focusing waypoint views.
* **Day-by-Day Chronological Timeline**: Breaks down daily activities into **Morning**, **Afternoon**, **Evening**, and **Night** slots with estimated costs, durations, and pro tips.
* **Activity Editing & Day Regeneration**: Users can fine-tune individual activities or click **"Regenerate Day"** to request fresh AI recommendations for a specific day.
* **Dynamic Budget Allocation**: Visual percentage breakdown across lodging, dining, tours, transit, and contingency buffers in multiple global currencies (`$ USD`, `₹ INR`, `€ EUR`, `£ GBP`, `¥ JPY`, etc.).
* **Packing & Weather Advisory**: AI-generated climate predictions and interactive packing checklists tailored to the target destination.
* **Local Storage Persistence**: Save journeys to a personal travel library that persists across page refreshes.
* **PDF / Print Export**: Formatted print layout enabling one-click export to PDF directly from the browser.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend Client                      │
│      React 18 + TypeScript + Tailwind CSS + Leaflet     │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (Reverse Proxy)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Express Backend                      │
│             Node.js + REST API Validation              │
└──────────────────────────┬─────────────────────────────┘
                           │ Google Gen AI SDK
                           ▼
┌────────────────────────────────────────────────────────┐
│                Google Gemini AI Engine                 │
│         Structured JSON Schema & Temperature 0.7       │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript | Component-based, type-safe user interface |
| **Styling** | Tailwind CSS, Lucide Icons | Responsive design, blue & teal palette, animations |
| **Maps** | Leaflet.js, React-Leaflet, OpenStreetMap | Interactive waypoint rendering & GPS geocoding |
| **Backend** | Node.js, Express, TypeScript | RESTful API, input validation, request orchestration |
| **AI Model** | Google Gemini API (`@google/genai`) | Structured day-wise itinerary synthesis |
| **Storage** | Browser LocalStorage | Offline-ready trip bookmarking & state persistence |

---

## 📁 Repository Structure

```
WanderWise-AI/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Navbar, Hero, TripForm, ItineraryView, LeafletMap, etc.
│   │   ├── services/           # apiService (backend communication), storageService
│   │   ├── types/              # TypeScript interfaces for trips, activities & budgets
│   │   ├── App.tsx             # Main view controller
│   │   ├── index.css           # Tailwind styles & print media rules
│   │   └── main.tsx            # React application entry
│   ├── index.html              # Leaflet CSS & Google Fonts
│   ├── vite.config.ts          # Vite configuration with /api reverse proxy
│   ├── tailwind.config.js      # Custom brand palette
│   └── package.json
│
├── server/                     # Backend API Service
│   ├── src/
│   │   ├── services/           # geminiService (Gemini API SDK integration)
│   │   └── index.ts            # Express server routes & error handling
│   ├── .env.example            # Safe environment template
│   ├── tsconfig.json           # Server TypeScript configuration
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore                  # Excludes .env, node_modules & build directories
├── package.json                # Root helper scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (version **18.x** or later recommended)
* `npm` (bundled with Node.js)
* A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/<your-username>/WanderWise-AI.git
cd WanderWise-AI
```

---

### Step 2: Configure Environment Variables

1. Copy the sample environment file into the `server/` directory:
   ```bash
   cp .env.example server/.env
   ```
2. Open `server/.env` in your text editor:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```
3. Replace `your_gemini_api_key_here` with your secret key from Google AI Studio.

> 🔒 **Security Notice**: Never commit `server/.env` to GitHub. The `.gitignore` file is pre-configured to ensure all `.env` files remain strictly local.

---

### Step 3: Install Dependencies

Install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

cd ..
```

---

### Step 4: Run the Application

You can start the backend and frontend in two separate terminal windows:

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```
*The Express backend will start at: `http://localhost:5000`*

#### Terminal 2 — Start the Frontend Application:
```bash
cd client
npm run dev
```
*The React application will start at: `http://localhost:5173`*

Open **`http://localhost:5173`** in your browser to start exploring and planning!

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns server health and confirms if `GEMINI_API_KEY` is configured. |
| `POST` | `/api/itinerary/generate` | Generates a full multi-day itinerary with coordinates, budget, and activities. |
| `POST` | `/api/itinerary/regenerate-day` | Generates a fresh, alternative schedule for a specific single day. |

---

## 🧪 Building for Production

To verify TypeScript types and create optimized production bundles:

```bash
# Build backend
cd server && npm run build

# Build frontend
cd ../client && npm run build
```

---

## 🤝 Acknowledgments

* **Google Cloud Developer Community** — For the workshop challenge and guidelines.
* **Google AI Studio & Gemini Team** — For state-of-the-art generative intelligence.
* **OpenStreetMap & Leaflet** — For open-source, community-driven interactive mapping.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
