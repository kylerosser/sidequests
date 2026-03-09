"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlace = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load JSON at module initialization
const PLACES_FILE = path_1.default.resolve(__dirname, "places_data.json");
// Load the JSON file
const rawData = fs_1.default.readFileSync(PLACES_FILE, "utf-8");
const placesData = JSON.parse(rawData);
const getPlace = (alias) => {
    return placesData[alias];
};
exports.getPlace = getPlace;
