import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { type LatLngBoundsExpression, type LatLng, divIcon } from 'leaflet';
import { RemoveLeafletAttribution } from '../map/RemoveLeafletAttribution';
import { FormLabel } from '../common/FormLabel';
import { FormShortTextInput } from '../common/FormShortTextInput';

const newZealandBounds: LatLngBoundsExpression = [
  [-48, 166 - 5], // SW
  [-33, 179 + 5], // NE
];

const NZ_CENTER: [number, number] = [-41, 174]; // neutral map center

const customIcon = divIcon({
  className: "",
  html: `
    <div class="shadow-md rounded-full">
      <div class="quest-marker transition-transform duration-200 ease-in-out w-[20px] h-[20px] bg-sq-primary border-2 border-white rounded-full"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function ClickPicker({ onPick }: { onPick: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

const PRECISION = 6; // tweak to 5 if you prefer

export const LocationStep = () => {
  // start blank
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');

  const position = useMemo<[number, number] | null>(() => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
      return [latNum, lngNum];
    }
    return null;
  }, [lat, lng]);

  const handlePick = useCallback((ll: LatLng) => {
    setLat(ll.lat.toFixed(PRECISION));
    setLng(ll.lng.toFixed(PRECISION));
  }, []);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => setLat(e.target.value);
  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => setLng(e.target.value);

  const formatIfNumber = (value: string, min: number, max: number) => {
    const n = parseFloat(value);
    if (!Number.isNaN(n) && n >= min && n <= max) return n.toFixed(PRECISION);
    return value;
  };

  return (
    <>
      <div>
        <div>
          <h1 className="text-2xl font-bold">Select the location of your quest</h1>
          <p className="text-md mb-2">
            Select the exact coordinates of where your quest takes place using the coordinate picker below.
          </p>
          <p className="text-md mb-4">
            If your quest involves multiple locations, choose the trailhead or starting point.
          </p>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <FormLabel htmlFor="latitude" text="Latitude" />
              <FormShortTextInput
                autoComplete="off"
                name="latitude"
                id="latitude"
                value={lat}
                onChange={handleLatChange}
                onBlur={() => setLat(v => formatIfNumber(v, -90, 90))}
                placeholder="e.g. -36.916043"
                inputMode="decimal"
              />
            </div>
            <div className="flex-1">
              <FormLabel htmlFor="longitude" text="Longitude" />
              <FormShortTextInput
                autoComplete="off"
                name="longitude"
                id="longitude"
                value={lng}
                onChange={handleLngChange}
                onBlur={() => setLng(v => formatIfNumber(v, -180, 180))}
                placeholder="e.g. 174.755381"
                inputMode="decimal"
              />
            </div>
          </div>
        </div>

        <MapContainer
          className="w-full aspect-square bg-sq-tint-lighter rounded-xl overflow-hidden"
          center={position ?? NZ_CENTER}
          zoom={position ? 11 : 6}
          minZoom={6}
          maxZoom={18}
          scrollWheelZoom={true}
          touchZoom="center"
          doubleClickZoom={false}
          maxBounds={newZealandBounds}
          maxBoundsViscosity={1.0}
        >
          <RemoveLeafletAttribution />
          <TileLayer
            attribution='Map data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
          />

          <ClickPicker onPick={handlePick} />

          {position && (
            <Marker
              position={position}
              draggable
              icon={customIcon}
              eventHandlers={{
                dragend: (e) => {
                  const ll = e.target.getLatLng() as LatLng;
                  handlePick(ll);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
    </>
  );
};
