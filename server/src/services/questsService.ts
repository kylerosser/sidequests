import { Types } from 'mongoose';
import Quest from '../models/questModel';

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

        const foundQuests = await Quest.find(query).populate('creator', 'username')

        return foundQuests;
    },
    findQuestById: async (id: string | Types.ObjectId) => {
        return await Quest.findById(id);
    }
}