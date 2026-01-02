import { useContext } from 'react';
import { MapRefContext } from './MapContext';
import type { Map } from 'leaflet';

export const useMapRef = (): React.RefObject<Map | null> => {
    const mapRef = useContext(MapRefContext);
    if (!mapRef) {
        throw new Error('useMapRef must be used within a MapRefProvider');
    }
    return mapRef;
};