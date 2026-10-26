import React from 'react';
import { Compass, Sparkles, Heart, Globe, Cloud, Code } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'plan' | 'itinerary' | 'saved' | 'workshop') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">WanderWise AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering travelers worldwide with intelligent, personalized itineraries, interactive maps, and budget transparency built for the Google Cloud workshop series.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-800 text-teal-400 text-[11px] font-medium border border-slate-700">
              <Cloud className="w-3.5 h-3.5" />
              <span>Designed for Google Cloud & Gemini AI Hackathons</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-white transition-colors">
                  Plan Itinerary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('saved')} className="hover:text-white transition-colors">
                  Saved Trips Library
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workshop')} className="hover:text-white transition-colors">
                  Google Cloud Tech Stack
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Built With</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'TypeScript', 'Tailwind CSS', 'Leaflet Maps', 'Node.js', 'Express', 'Google Gemini'].map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700/80">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} WanderWise AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the Google Cloud Developer Workshop
          </p>
        </div>

      </div>
    </footer>
  );
};
