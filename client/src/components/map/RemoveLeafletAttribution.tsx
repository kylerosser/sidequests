import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export const RemoveLeafletAttribution = () => {
  const map = useMap();

  useEffect(() => {
    map.attributionControl.setPrefix(false);
  }, [map]);

  return null;
}