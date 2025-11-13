import * as z from "zod"

export const envConfig = z.object({
    JWT_SECRET_KEY: z.string().min(64, {
        message: "Your jwt secret key must be equal to or greater than 64 characters"
    }),
    JWT_EXPIRY: z.string(),
    MONGODB_URI: z.string(),
    PORT: z.coerce.number(),
});








