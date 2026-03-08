import { Types } from 'mongoose';
import Quest from '../models/questModel';
import { getPlace, Place } from 'utils/placesUtils';
import QuestModel from '../models/questModel';
import { getGeoScore } from 'utils/geoUtils';
import { generateNgrams } from 'utils/naturalLanguageUtils';

export type BBox = [[number, number], [number, number]];

export const questsService = {
    getQuestsWithinBounds: async (bounds: BBox, approvedOnly = true) => {
        const query: any = {
            location: {
                $geoWithin: {
                    $box: bounds
                }
            }
        }

        if (approvedOnly) {
            query.moderatorApproved = true
        };

        const foundQuests = await Quest.find(query).populate('creator', {username: 1})
        return foundQuests;
    },
    findQuestById: async (id: string | Types.ObjectId) => {
        return await Quest.findById(id).populate('creator', {username: 1});
    },
    getUnmoderatedQuestCountForUser: async (userId: string | Types.ObjectId) => {
        const count = await Quest.countDocuments({
            creator: userId,
            moderatorApproved: false
        });
        return count;
    },
    getSearchResultsForQuery: async (query: string) => {
        // Generate ngrams from query
        const ngrams = generateNgrams(query)
        console.log(ngrams)

        // construct a list of places (lat/long/radius coords) that match ngrams in the query
        const placeMatches: Place[] = []
        for (const ngram of ngrams) {
            const place = getPlace(ngram);
            if (place) placeMatches.push(place)
        }
        
        // If no places match, fallback to auckland
        if (placeMatches.length == 0) {
            const aucklandPlace = getPlace('auckland')
            if (aucklandPlace) {
                placeMatches.push(aucklandPlace)
            } else {
                return [] // fatal, auckland doesnt exist for whatever reason
            }
        }
        console.log(placeMatches) // DEBUG

        // Query all quests within the matching places
        const EARTH_RADIUS_KM = 6378.1;
        let foundQuests = await QuestModel.find({
            $or: placeMatches.map(place => ({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [place.lng, place.lat],
                            place.radiusKm / EARTH_RADIUS_KM  // radius must be in radians
                        ]
                    }
                }
            }))
        });

        // If the geo query found less than 5 quests, double the search radius and try again
        if (foundQuests.length < 5) {
            foundQuests = await QuestModel.find({
                $or: placeMatches.map(place => ({
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [place.lng, place.lat],
                                place.radiusKm * 2 / EARTH_RADIUS_KM  // double the radius
                            ]
                        }
                    }
                }))
            });
        }

        // Create a search result list with a truncated text preview, sorted
        type SearchResult = {title: string, preview: string, id: string}
        let searchResultsWithScore: (SearchResult & { score: number })[] = []

        for (const foundQuest of foundQuests) {
            // Format the search result info listing for this quest
            const searchResult: SearchResult = {
                title: foundQuest.title,
                preview: foundQuest.description.slice(0, 150) + '…', // Truncate preview to 100 characters
                id: foundQuest.id
            }

            // Calculate a geo-score indicating how close the quest is to the queried place
            let geoScore = 0;
            for (const place of placeMatches) { 
                // take the highest geo-score calculated from all place matches
                const [questLng, questLat] = foundQuest.location.coordinates
                const newGeoScore = getGeoScore(place.lat, place.lng, questLat, questLng)
                if (newGeoScore > geoScore) geoScore = newGeoScore;
            }

            searchResultsWithScore.push({...searchResult, score: geoScore})
        }

        // Sort & truncate results to max 20 in descending order of score
        searchResultsWithScore = searchResultsWithScore.sort((a, b) => b.score - a.score).slice(0, 20);

        // Remove score from search results
        const searchResults: SearchResult[] = searchResultsWithScore.map((obj) => {
            const {score, ...rest} = obj
            return rest
        })
        
        return searchResults

    }
}