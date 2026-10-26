import React from 'react';
import { Cloud, Cpu, Database, Server, Globe, Sparkles, Layers, ShieldCheck, Code2 } from 'lucide-react';

export const WorkshopInfo: React.FC = () => {
  const architectureSteps = [
    {
      step: '01',
      title: 'Frontend Client (React + TS + Tailwind)',
      desc: 'Interactive UI with dynamic forms, responsive Tailwind cards, day-wise timeline, and Leaflet + OpenStreetMap geo-coordinates.',
      tech: ['React 18', 'TypeScript', 'Tailwind CSS', 'Leaflet.js', 'Lucide Icons'],
      badge: 'Active & Running'
    },
    {
      step: '02',
      title: 'Backend Middleware (Express + Node.js)',
      desc: 'REST API service handling user validation, prompt orchestration, rate limiting, and trip persistence formatting.',
      tech: ['Node.js', 'Express', 'TypeScript', 'CORS', 'Dotenv'],
      badge: 'Configured & Ready'
    },
    {
      step: '03',
      title: 'Google Cloud & Gemini API',
      desc: 'Structured JSON generation using Google Gemini model prompts with temperature control and schema enforcement.',
      tech: ['Google Gemini API', 'Google Cloud Vertex AI', 'JSON Schema Mode'],
      badge: 'Next Integration Step'
    },
    {
      step: '04',
      title: 'Cloud Deployment (Google Cloud Run)',
      desc: 'Containerized microservice architecture deployed onto serverless Google Cloud Run with custom domain mapping.',
      tech: ['Cloud Run', 'Artifact Registry', 'Google Cloud Storage', 'Cloud Build'],
      badge: 'Workshop Target'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200">
          <Cloud className="w-4 h-4 text-sky-600" />
          <span>Google Cloud Workshop Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How WanderWise AI Works Behind the Scenes
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          This project demonstrates a production-grade full-stack AI application combining modern frontend design with Google Cloud artificial intelligence services.
        </p>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-mono ml-2">architecture-overview.json</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Workshop Blueprint
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Box 1: Client */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">1. Client Layer</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Captures traveler preferences (dates, budget, interests) and renders interactive maps with real-time waypoint rendering.
              </p>
            </div>

            {/* Box 2: Node.js Express */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">2. Express API</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transforms form parameters into optimized system prompts and communicates securely with Google Cloud services.
              </p>
            </div>

            {/* Box 3: Gemini AI */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">3. Google Gemini</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates strict JSON schema with day plans, geocoordinates, realistic budget estimates, and insider safety advice.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Step by step cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {architectureSteps.map((s) => (
          <div
            key={s.step}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-200">{s.step}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {s.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {s.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold border border-teal-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
