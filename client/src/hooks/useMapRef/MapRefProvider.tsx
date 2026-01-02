import { useRef } from 'react';
import { MapRefContext } from './MapContext';
import { Map } from 'leaflet';

export function MapRefProvider({ children }: React.PropsWithChildren)  {
  const mapRef = useRef<Map | null>(null);
  return (
    <MapRefContext.Provider value={mapRef}>
      {children}
    </MapRefContext.Provider>
  );
}
