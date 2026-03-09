"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeoScore = void 0;
// Convert degrees to radians
const toRad = (deg) => deg * Math.PI / 180;
// Compute distance between two coordinates using the Haversine formula
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c; // distance in km
};
// Convert a distance to a normalized geo score [0,1]
const distanceToGeoScore = (distanceKm, scaleKm = 30) => {
    // Exponential decay: closer locations score much higher
    return Math.exp(-distanceKm / scaleKm);
};
// Full helper: compute geo score directly from coordinates
const getGeoScore = (queryLat, queryLon, questLat, questLon, scaleKm = 30) => {
    // Compute great-circle distance
    const distance = haversineDistance(queryLat, queryLon, questLat, questLon);
    // Convert distance → score
    return distanceToGeoScore(distance, scaleKm);
};
exports.getGeoScore = getGeoScore;
