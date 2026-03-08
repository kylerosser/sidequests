import fs from "fs";
import path from "path";

// Load JSON at module initialization
const PLACES_FILE = path.resolve(__dirname, "places_data.json");

interface Place {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

// Load the JSON file
const rawData = fs.readFileSync(PLACES_FILE, "utf-8");
const placesData: Record<string, Place> = JSON.parse(rawData);

export const getPlace = (alias: string): Place | undefined => {
  return placesData[alias];
};