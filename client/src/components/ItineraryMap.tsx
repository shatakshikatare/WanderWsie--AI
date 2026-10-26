import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { Activity } from '../types/trip';

// Custom Pin Icon using Leaflet HTML DivIcon with Teal & Blue styling
const createCustomIcon = (index: number, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${isSelected ? '#0284c7' : '#0d9488'};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        border: 2px solid white;
        transition: transform 0.2s ease;
      ">
        <span style="
          transform: rotate(45deg);
          font-weight: 700;
          font-size: 13px;
          font-family: sans-serif;
        ">${index}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to dynamically recenter map when destination or selected activity changes
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2
    });
  }, [center, zoom, map]);
  return null;
};

interface ItineraryMapProps {
  center: { lat: number; lng: number };
  destinationName: string;
  activities: Activity[];
  selectedActivityId?: string | null;
  onSelectActivity?: (id: string) => void;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  center,
  destinationName,
  activities,
  selectedActivityId,
  onSelectActivity
}) => {
  const defaultPosition: [number, number] = [center.lat || 35.0116, center.lng || 135.7681];

  // If a specific activity is selected, center on that, else default to destination
  const activeActivity = activities.find(a => a.id === selectedActivityId);
  const activePosition: [number, number] = activeActivity?.coordinates
    ? [activeActivity.coordinates.lat, activeActivity.coordinates.lng]
    : defaultPosition;

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
      {/* Map Header Floating Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/70 flex items-center space-x-2 text-xs font-medium text-slate-700">
        <MapPin className="w-4 h-4 text-teal-600" />
        <span className="font-semibold text-slate-900">{destinationName}</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-500">{activities.length} Waypoints</span>
      </div>

      <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm text-[11px] text-slate-500 font-medium flex items-center space-x-1.5">
        <Navigation className="w-3.5 h-3.5 text-sky-600" />
        <span>OpenStreetMap + Leaflet</span>
      </div>

      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activePosition} zoom={activeActivity ? 15 : 13} />

        {activities.map((act, idx) => {
          if (!act.coordinates) return null;
          const isSelected = act.id === selectedActivityId;
          const pos: [number, number] = [act.coordinates.lat, act.coordinates.lng];

          return (
            <Marker
              key={act.id}
              position={pos}
              icon={createCustomIcon(idx + 1, isSelected)}
              eventHandlers={{
                click: () => onSelectActivity && onSelectActivity(act.id)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-[220px]">
                  <span className="inline-block px-2 py-0.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 rounded">
                    {act.timeSlot} • {act.time}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{act.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.locationName}</p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-teal-600 font-semibold">{act.estimatedCost}</span>
                    <span className="text-slate-400">{act.duration}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
