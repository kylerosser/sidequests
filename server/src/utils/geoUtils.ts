// Convert degrees to radians
const toRad = (deg: number): number => deg * Math.PI / 180;

// Compute distance between two coordinates using the Haversine formula
const haversineDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number => {

	const R = 6371; // Earth's radius in km

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) *
		Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.asin(Math.sqrt(a));

	return R * c; // distance in km
};

// Convert a distance to a normalized geo score [0,1]
const distanceToGeoScore = (
	distanceKm: number,
	scaleKm = 30
): number => {

	// Exponential decay: closer locations score much higher
	return Math.exp(-distanceKm / scaleKm);
};

// Full helper: compute geo score directly from coordinates
export const getGeoScore = (
	queryLat: number,
	queryLon: number,
	questLat: number,
	questLon: number,
	scaleKm = 30
): number => {

	// Compute great-circle distance
	const distance = haversineDistance(
		queryLat,
		queryLon,
		questLat,
		questLon
	);

	// Convert distance → score
	return distanceToGeoScore(distance, scaleKm);
};