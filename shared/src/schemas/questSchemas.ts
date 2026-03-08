import { z } from "zod"

export const CreateQuestBodySchema = z.object({
    title: z
        .string()
        .nonempty({ message: "Quest title cannot be empty" })
        .max(100, { message: "Quest title is too long" }) // (Should never occur on frontend anyways)
        .transform((val) => {
            return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the title
        })
        .transform((val) => val.replace(/[.!?]/g, '')), // Remove full stops and exclamation/question marks
    description: z
        .string()
        .nonempty({ message: "Quest description cannot be empty" })
        .max(800, { message: "Quest description is too long" }) // (Should never occur on frontend anyways)
        .transform((val) => {
            return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the description
        }),
    coordinates: z.object({
        lat: z.number({ message: "Location (latitude) is missing or invalid" }),
        lng: z.number({ message: "Location (longitude) is missing or invalid" })
    }),
    checkList: z.array(z.object({
        id: z.string().optional(), // Allow junk id field used on the frontend as a rendering key
        title: z
            .string()
            .nonempty({ message: "Empty checklist titles are not allowed"})
            .max(100, { message: "One of your checklist titles is too long" }) // (Should never occur on frontend anyways)
            .transform((val) => {
                return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the title
            })
            .transform((val) => val.replace(/[.!?]/g, '')), // Remove full stops and exclamation/question marks
        description: z
            .string()
            .nonempty({ message: "Empty checklist descriptions are not allowed"})
            .max(800, { message: "One of your checklist descriptions is too long"}) // (Should never occur on frontend anyways)
            .transform((val) => {
                return val[0].toUpperCase() + val.slice(1); // Capitalise first letter of the description
            }),
        difficulty: z.union([
            z.literal(1),
            z.literal(2),
            z.literal(3),
            z.literal(4)
        ], { message: "Difficulty is invalid" }) // (Should never occur on frontend anyways)
    }))
})

export type CreateQuestBody = z.infer<typeof CreateQuestBodySchema>


export const SearchQuestsResponse = z.array(z.object({
    title: z.string(),
    preview: z.string(),
    id: z.string()
})).optional()

export type SearchQuestsResponse = z.infer<typeof SearchQuestsResponse>