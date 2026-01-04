export const NZ_BOUNDS = [
  [-48, 166 - 5], // SW
  [-33, 179 + 5], // NE
] as const;

// Checks if coordinates are within the bounds of NZ
export const coordsInNZ = (lat: number, lng: number) => {
  const [[southLat, westLng], [northLat, eastLng]] = NZ_BOUNDS;
  return (
    lat >= southLat &&
    lat <= northLat &&
    lng >= westLng &&
    lng <= eastLng
  );
}