"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQuestsResponse = exports.CreateQuestBodySchema = void 0;
const zod_1 = require("zod");
exports.CreateQuestBodySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .nonempty({ message: "Quest title cannot be empty" })
        .max(100, { message: "Quest title is too long" }) // (Should never occur on frontend anyways)
        .transform((val) => {
        return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the title
    })
        .transform((val) => val.replace(/[.!?]/g, '')), // Remove full stops and exclamation/question marks
    description: zod_1.z
        .string()
        .nonempty({ message: "Quest description cannot be empty" })
        .max(800, { message: "Quest description is too long" }) // (Should never occur on frontend anyways)
        .transform((val) => {
        return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the description
    }),
    coordinates: zod_1.z.object({
        lat: zod_1.z.number({ message: "Location (latitude) is missing or invalid" }),
        lng: zod_1.z.number({ message: "Location (longitude) is missing or invalid" })
    }),
    checkList: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().optional(), // Allow junk id field used on the frontend as a rendering key
        title: zod_1.z
            .string()
            .nonempty({ message: "Empty checklist titles are not allowed" })
            .max(100, { message: "One of your checklist titles is too long" }) // (Should never occur on frontend anyways)
            .transform((val) => {
            return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the title
        })
            .transform((val) => val.replace(/[.!?]/g, '')), // Remove full stops and exclamation/question marks
        description: zod_1.z
            .string()
            .nonempty({ message: "Empty checklist descriptions are not allowed" })
            .max(800, { message: "One of your checklist descriptions is too long" }) // (Should never occur on frontend anyways)
            .transform((val) => {
            return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the description
        }),
        difficulty: zod_1.z.union([
            zod_1.z.literal(1),
            zod_1.z.literal(2),
            zod_1.z.literal(3),
            zod_1.z.literal(4)
        ], { message: "Difficulty is invalid" }) // (Should never occur on frontend anyways)
    }))
});
exports.SearchQuestsResponse = zod_1.z.array(zod_1.z.object({
    title: zod_1.z.string(),
    preview: zod_1.z.string(),
    id: zod_1.z.string()
})).optional();
