import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { MapPin, List, Home, Trash2 } from 'lucide-react';

// =================================================================
// 1. TYPE DEFINITIONS
// =================================================================

// ⚠️ Note: We rely on the Leaflet library being loaded globally as 'L' via the <script> tag.
// For a proper TypeScript project setup with Node modules, you'd use 'import * as L from 'leaflet''
// and 'npm install @types/leaflet'. For this single-file TSX example, we'll use a type assertion for 'L'.
declare global {
  interface Window {
    L: typeof import('leaflet');
  }
}

// Type for a saved map point
interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  label: string;
}

// Props for routing/navigation
interface NavigationProps {
  onNavigate: (page: 'home' | 'map' | 'saved') => void;
}

// Props for Map/Saved pages
interface MapContentProps extends NavigationProps {
  points: MapPoint[];
  setPoints: React.Dispatch<React.SetStateAction<MapPoint[]>>;
}

// Type for the Leaflet Marker instance
type LeafletMarker = import('leaflet').Marker | null;

// Define the key for Local Storage
const STORAGE_KEY = 'mapPoints';

// =================================================================
// 2. COMPONENTS (with types)
// =================================================================

// Home Page Component
const HomePage: FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Map Point Saver</h1>
        <p className="text-gray-600 mb-8">Save and manage your favorite locations in South Korea on an interactive map</p>
        <div className="space-y-4">
          <button 
            onClick={() => onNavigate('map')}
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Open Map
          </button>
          <button 
            onClick={() => onNavigate('saved')}
            className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            View Saved Points
          </button>
        </div>
      </div>
    </div>
  );
}

// Map Page Component
const MapPage: FC<MapContentProps> = ({ points, setPoints, onNavigate }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').Marker[]>([]);
  const [label, setLabel] = useState<string>('');
  const [tempMarker, setTempMarker] = useState<LeafletMarker>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Load Leaflet resources
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    script.onload = () => {
      setIsMapReady(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize and manage map instance and click handler (Reruns when tempMarker changes)
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current) return;

    // Use type assertion for the global L object
    const L = window.L;
    const map = L.map(mapRef.current).setView([37.5665, 126.9780], 7);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const southKoreaBounds = L.latLngBounds(
      [33.0, 124.5], // Southwest coordinates
      [43.0, 132.0]  // Northeast coordinates
    );
    map.setMaxBounds(southKoreaBounds);
    map.on('drag', function() {
      map.panInsideBounds(southKoreaBounds, { animate: false });
    });

    mapInstanceRef.current = map;

    // Map click handler function
    const handleClick = (e: import('leaflet').LeafletMouseEvent) => {
      if (tempMarker) {
        return; 
      }

      // Create temporary marker (yellow icon)
      const marker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);

      setTempMarker(marker);
      setLabel('');
    };

    map.on('click', handleClick);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleClick);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapReady, tempMarker]); // tempMarker dependency ensures the click handler has the current state

  // Update permanent markers when points change
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const L = window.L;

    // Clear existing permanent markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new permanent markers (red icon)
    points.forEach(point => {
      const marker = L.marker([point.lat, point.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`<strong>${point.label}</strong><br>Lat: ${point.lat.toFixed(4)}<br>Lng: ${point.lng.toFixed(4)}`);
      markersRef.current.push(marker);
    });
  }, [points, isMapReady]);

  const savePoint = () => {
    if (tempMarker && label.trim()) {
      // Type casting tempMarker to ensure getLatLng exists
      const latlng = (tempMarker as import('leaflet').Marker).getLatLng();
      const newPoint: MapPoint = {
        id: Date.now(),
        lat: latlng.lat,
        lng: latlng.lng,
        label: label.trim()
      };
      setPoints([...points, newPoint]);
      
      // Remove temp marker after saving
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tempMarker);
      }
      setTempMarker(null); // Reset to allow next click
      setLabel('');
    }
  };

  const cancelPoint = () => {
    if (tempMarker && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(tempMarker);
    }
    setTempMarker(null); // Reset to allow next click
    setLabel('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="font-semibold">Home</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">South Korea Map</h1>
          <button 
            onClick={() => onNavigate('saved')}
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <List className="w-5 h-5 mr-2" />
            <span className="font-semibold">Saved ({points.length})</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-4">Click anywhere on the map to add a point in South Korea</p>
          
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-lg border-4 border-gray-300"
          >
            {!isMapReady && (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>

          {/* Save point form */}
          {tempMarker && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">Add a label for this point:</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter location name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && label.trim() && savePoint()}
                />
                <button
                  onClick={savePoint}
                  disabled={!label.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelPoint}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Saved Points Page Component
const SavedPointsPage: FC<MapContentProps> = ({ points, setPoints, onNavigate }) => {
  const deletePoint = (id: number) => {
    setPoints(points.filter(point => point.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="font-semibold">Home</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Saved Points</h1>
          <button 
            onClick={() => onNavigate('map')}
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <MapPin className="w-5 h-5 mr-2" />
            <span className="font-semibold">Map</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Saved Locations</h2>
          
          {points.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No saved points yet</p>
              <button 
                onClick={() => onNavigate('map')}
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Go to map to add some →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {points.map((point) => (
                <div key={point.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" fill="currentColor" />
                    <div>
                      <p className="font-semibold text-gray-800">{point.label}</p>
                      <p className="text-sm text-gray-500">
                        Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePoint(point.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                    title="Delete point"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  // Load points from localStorage on initial render
  const [points, setPoints] = useState<MapPoint[]>(() => {
    try {
      const savedPoints = localStorage.getItem(STORAGE_KEY);
      return savedPoints ? JSON.parse(savedPoints) : [];
    } catch (error) {
      console.error('Could not load points from local storage', error);
      return [];
    }
  });
  
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'saved'>('home');

  // Save points to localStorage whenever the 'points' state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
    } catch (error) {
      console.error('Could not save points to local storage', error);
    }
  }, [points]);

  const navigate = (page: 'home' | 'map' | 'saved') => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'map' && <MapPage points={points} setPoints={setPoints} onNavigate={navigate} />}
      {currentPage === 'saved' && <SavedPointsPage points={points} setPoints={setPoints} onNavigate={navigate} />}
    </>
  );
}