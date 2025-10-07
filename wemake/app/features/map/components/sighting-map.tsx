'use client';

import { useEffect, useState } from 'react';
import type { SightingListItem } from '~/lib/types/sighting.types';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '~/lib/utils/geo.utils';

interface SightingMapProps {
  sightings: SightingListItem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (sighting: SightingListItem) => void;
  onMapMove?: (center: { lat: number; lng: number }, zoom: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  searchRadius?: number;
}

export function SightingMap(props: SightingMapProps) {
  const [ClientComponent, setClientComponent] = useState<any>(null);

  useEffect(() => {
    // Only import the client component in the browser
    if (typeof window !== 'undefined') {
      import('./sighting-map.client').then((mod) => {
        setClientComponent(() => mod.SightingMapClient);
      });
    }
  }, []);

  if (!ClientComponent) {
    return (
      <div
        style={{ height: props.height || '600px', width: '100%' }}
        className="rounded-lg shadow-md flex items-center justify-center bg-gray-100"
      >
        <p className="text-gray-500">지도 로딩 중...</p>
      </div>
    );
  }

  return <ClientComponent {...props} />;
}
