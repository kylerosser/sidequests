"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordsInNZ = exports.NZ_BOUNDS = void 0;
exports.NZ_BOUNDS = [
    [-48, 166 - 5], // SW
    [-33, 179 + 5], // NE
];
// Checks if coordinates are within the bounds of NZ
const coordsInNZ = (lat, lng) => {
    const [[southLat, westLng], [northLat, eastLng]] = exports.NZ_BOUNDS;
    return (lat >= southLat &&
        lat <= northLat &&
        lng >= westLng &&
        lng <= eastLng);
};
exports.coordsInNZ = coordsInNZ;
