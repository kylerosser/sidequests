import type { Map } from 'leaflet';
import { createContext } from 'react';

export const MapRefContext = createContext<React.RefObject<Map | null> | null>(null);