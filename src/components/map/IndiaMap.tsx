import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { AttractionRecord, ItineraryItem } from '../../types';
import { useItineraryStore } from '../../store/useItineraryStore';

interface IndiaMapProps {
  attractions: AttractionRecord[];
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
  itineraryItems?: ItineraryItem[];
  selectedCityName?: string;
  onAttractionClick?: (attraction: AttractionRecord) => void;
  className?: string;
}

// Category Pin Color Mapping
const getCategoryColor = (category: string): { bg: string; border: string } => {
  switch (category) {
    case 'Beach':
      return { bg: '#2563EB', border: '#1D4ED8' }; // Blue
    case 'Heritage':
      return { bg: '#EA580C', border: '#C2410C' }; // Orange
    case 'Nature':
      return { bg: '#16A34A', border: '#15803D' }; // Green
    case 'Adventure':
      return { bg: '#9333EA', border: '#7E22CE' }; // Purple
    case 'Religious':
      return { bg: '#EAB308', border: '#CA8A04' }; // Gold
    case 'Shopping':
      return { bg: '#64748B', border: '#475569' }; // Gray
    case 'Food':
      return { bg: '#DC2626', border: '#B91C1C' }; // Red
    default:
      return { bg: '#0284C7', border: '#0369A1' };
  }
};

const DAY_ROUTE_COLORS = ['#3B82F6', '#10B981', '#A855F7', '#F59E0B'];

export const IndiaMap: React.FC<IndiaMapProps> = ({
  attractions,
  centerLat = 20.5937,
  centerLon = 78.9629,
  zoom = 5,
  itineraryItems = [],
  selectedCityName,
  onAttractionClick,
  className = 'h-[500px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylinesLayerRef = useRef<L.LayerGroup | null>(null);
  const { addToCustomBucketList } = useItineraryStore();

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Dark / Slate styled OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      polylinesLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map reference or cleanup
    };
  }, []);

  // Update Center, Markers and Routes when attractions or items change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !polylinesLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    polylinesLayerRef.current.clearLayers();

    if (attractions.length === 0) return;

    const bounds = L.latLngBounds([]);

    // 1. Add Attraction Markers
    attractions.forEach((attr) => {
      const { bg } = getCategoryColor(attr.category);

      // Custom SVG Marker with category color
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${bg};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([attr.latitude, attr.longitude], { icon: customIcon });

      // Rich popup content
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 220px; max-width: 260px; color: #0f172a; padding: 2px;">
          <img 
            src="${attr.image_url}" 
            alt="${attr.name}" 
            style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;"
          />
          <div style="font-weight: 700; font-size: 13px; line-height: 1.3; margin-bottom: 3px;">${attr.name}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: ${bg}; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
              ${attr.category}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #16a34a;">
              ${attr.entry_fee === 0 ? 'Free Entry' : `₹${attr.entry_fee}`}
            </span>
          </div>
          <p style="font-size: 11px; color: #475569; line-height: 1.4; margin: 0 0 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${attr.description}
          </p>
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">
            🕒 ${attr.opening_time} - ${attr.closing_time} • ⏱️ ${attr.visit_duration} mins
          </div>
          <button 
            id="add-btn-${attr.id}" 
            style="
              width: 100%; 
              padding: 6px; 
              background: #2563eb; 
              color: white; 
              font-size: 11px; 
              font-weight: 600; 
              border: none; 
              border-radius: 4px; 
              cursor: pointer;
            "
          >
            + Add To Trip
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`add-btn-${attr.id}`);
        if (btn) {
          btn.onclick = () => {
            addToCustomBucketList(attr);
            btn.innerText = '✓ Added to Trip';
            btn.style.backgroundColor = '#16a34a';
          };
        }
      });

      marker.on('click', () => {
        if (onAttractionClick) onAttractionClick(attr);
      });

      marker.addTo(markersLayerRef.current!);
      bounds.extend([attr.latitude, attr.longitude]);
    });

    // 2. Draw Day-wise Itinerary Route Lines if provided
    if (itineraryItems.length > 0) {
      // Group items by day
      const dayGroups: { [day: number]: [number, number][] } = {};

      itineraryItems.forEach((item) => {
        if (item.attraction) {
          if (!dayGroups[item.day_number]) dayGroups[item.day_number] = [];
          dayGroups[item.day_number].push([
            item.attraction.latitude,
            item.attraction.longitude,
          ]);
        }
      });

      Object.entries(dayGroups).forEach(([dayStr, coordinates]) => {
        const dayNum = parseInt(dayStr, 10);
        if (coordinates.length > 1) {
          const color = DAY_ROUTE_COLORS[(dayNum - 1) % DAY_ROUTE_COLORS.length];
          const polyline = L.polyline(coordinates, {
            color: color,
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8',
          });
          polyline.bindTooltip(`Day ${dayNum} Route Path`, { sticky: true });
          polyline.addTo(polylinesLayerRef.current!);
        }
      });
    }

    // Auto-recenter smoothly
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (centerLat && centerLon) {
      map.setView([centerLat, centerLon], zoom);
    }
  }, [attractions, itineraryItems, centerLat, centerLon, zoom]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Legend */}
      <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 z-10 text-[11px] shadow-lg space-y-1">
        <div className="font-semibold text-slate-200 mb-1 border-b border-slate-800 pb-1">
          {selectedCityName ? `${selectedCityName} Map` : 'Pin Legend'}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Beach
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Heritage
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Nature
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Adventure
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Religious
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Shopping
          </div>
        </div>
      </div>
    </div>
  );
};
