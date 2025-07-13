import { useState } from 'react'
import { useMapEvents, Marker, Popup } from 'react-leaflet'
import { LatLng } from 'leaflet';

export const CurrentLocationMarker = () => {
    const [position, setPosition] = useState<LatLng | null>(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(location) {
            setPosition(location.latlng);
            map.flyTo(location.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}