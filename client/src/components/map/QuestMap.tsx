import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngBoundsExpression } from 'leaflet'

import { RemoveLeafletAttribution } from './RemoveLeafletAttribution';

const newZealandBounds: LatLngBoundsExpression = [
  [-48, 166-5],  // SW
  [-33, 179+5],  // NE
];

export const QuestMap = () => {
    
    return (
        <MapContainer 
            className="h-screen w-screen z-0" 
            center={[-36.85, 174.77]} 
            zoom={15}
            minZoom={6}
            maxZoom={18}
            scrollWheelZoom={true}
            zoomControl={false}
            touchZoom="center"
            maxBounds={newZealandBounds}
            maxBoundsViscosity={1.0}
        >
            <RemoveLeafletAttribution />
            <TileLayer
                attribution='Map data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
            />
            <Marker position={[-36.85, 174.77]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}