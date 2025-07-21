import { Types } from 'mongoose';
import User from '../models/userModel';
import Quest from '../models/questModel';
import Completion from '../models/completionModel';

export const completionsService = {
    logNewCompletion: async (completedQuest: string, userId: string, checkListIndex: number, comment: string) => {
        const quest = await Quest.findOne({_id: completedQuest});
        if (!quest) {
            return { success: false, data: "Invalid quest id" };
        }

        const existingCompletion = await Completion.findOne({completer: userId, completedQuest: quest?.id, checkListIndex: checkListIndex});
        if (existingCompletion) {
            return { success: false, data: "A completion for this quest checklist item already exists" };
        }

        const newCompletion = new Completion({
            completedQuest,
            completer: userId,
            checkListIndex,
            comment: comment,
        });
        await newCompletion.save();

        return {success: true, data: "Completion logged"};
    },
    findCompletions: async (completedQuest: string | undefined, completer: string | undefined, cursor: string | undefined, limit: number | undefined) => {
        const query: any = {}
        if (cursor) query._id = { $lt: new Types.ObjectId(cursor) };
        if (completedQuest) query.completedQuest = completedQuest;
        if (completer) query.completer = completer;
        if (!limit) limit = 20; // default fallback limit
        const foundCompletions = await Completion.find(query).populate('completer', {username: 1}).sort({ _id: -1 }).limit(limit);
        return foundCompletions;
    }

}