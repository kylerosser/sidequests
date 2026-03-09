"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questsService = void 0;
const questModel_1 = __importDefault(require("../models/questModel"));
const placesUtils_1 = require("utils/placesUtils");
const questModel_2 = __importDefault(require("../models/questModel"));
const geoUtils_1 = require("utils/geoUtils");
const naturalLanguageUtils_1 = require("utils/naturalLanguageUtils");
exports.questsService = {
    getQuestsWithinBounds: (bounds_1, ...args_1) => __awaiter(void 0, [bounds_1, ...args_1], void 0, function* (bounds, approvedOnly = true) {
        const query = {
            location: {
                $geoWithin: {
                    $box: bounds
                }
            }
        };
        if (approvedOnly) {
            query.moderatorApproved = true;
        }
        ;
        const foundQuests = yield questModel_1.default.find(query).populate('creator', { username: 1 });
        return foundQuests;
    }),
    findQuestById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield questModel_1.default.findById(id).populate('creator', { username: 1 });
    }),
    getUnmoderatedQuestCountForUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield questModel_1.default.countDocuments({
            creator: userId,
            moderatorApproved: false
        });
        return count;
    }),
    getSearchResultsForQuery: (query) => __awaiter(void 0, void 0, void 0, function* () {
        // Generate ngrams from query
        const ngrams = (0, naturalLanguageUtils_1.generateNgrams)(query);
        // construct a list of places (lat/long/radius coords) that match ngrams in the query
        const placeMatches = [];
        for (const ngram of ngrams) {
            const place = (0, placesUtils_1.getPlace)(ngram);
            if (place)
                placeMatches.push(place);
        }
        // If no places match, fallback to auckland
        if (placeMatches.length == 0) {
            const aucklandPlace = (0, placesUtils_1.getPlace)('auckland');
            if (aucklandPlace) {
                placeMatches.push(aucklandPlace);
            }
            else {
                return []; // fatal, auckland doesnt exist for whatever reason
            }
        }
        // Query all quests within the matching places
        const EARTH_RADIUS_KM = 6378.1;
        let foundQuests = yield questModel_2.default.find({
            $or: placeMatches.map(place => ({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [place.lng, place.lat],
                            place.radiusKm / EARTH_RADIUS_KM // radius must be in radians
                        ]
                    }
                }
            }))
        });
        // If the geo query found less than 5 quests, double the search radius and try again
        if (foundQuests.length < 5) {
            foundQuests = yield questModel_2.default.find({
                $or: placeMatches.map(place => ({
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [place.lng, place.lat],
                                place.radiusKm * 2 / EARTH_RADIUS_KM // double the radius
                            ]
                        }
                    }
                }))
            });
        }
        let searchResultsWithScore = [];
        for (const foundQuest of foundQuests) {
            // Format the search result info listing for this quest
            const searchResult = {
                title: foundQuest.title,
                preview: foundQuest.description.slice(0, 150) + '…', // Truncate preview to 100 characters
                id: foundQuest.id
            };
            // Calculate a geo-score indicating how close the quest is to the queried place
            let geoScore = 0;
            for (const place of placeMatches) {
                // take the highest geo-score calculated from all place matches
                const [questLng, questLat] = foundQuest.location.coordinates;
                const newGeoScore = (0, geoUtils_1.getGeoScore)(place.lat, place.lng, questLat, questLng);
                if (newGeoScore > geoScore)
                    geoScore = newGeoScore;
            }
            // Calculate a text-score using average TF (term frequency) across query ngrams
            let words = foundQuest.title + ' ' + foundQuest.description;
            for (const checkListItem of foundQuest.checkList) {
                words += (checkListItem.title + ' ' + checkListItem.description);
            }
            const questNgrams = (0, naturalLanguageUtils_1.generateNgrams)(words);
            let textScore = 0;
            for (const ngram of ngrams) {
                const tf = questNgrams.filter(g => g === ngram.toLowerCase()).length / ngrams.length;
                textScore += tf;
            }
            textScore /= ngrams.length; // average TF across query ngrams
            searchResultsWithScore.push(Object.assign(Object.assign({}, searchResult), { score: geoScore * 0.25 + textScore * 0.75 }));
        }
        // Sort & truncate results to max 20 in descending order of score
        searchResultsWithScore = searchResultsWithScore.sort((a, b) => b.score - a.score).slice(0, 20);
        // Remove score from search results
        const searchResults = searchResultsWithScore.map((obj) => {
            const { score } = obj, rest = __rest(obj, ["score"]);
            return rest;
        });
        return searchResults;
    })
};
