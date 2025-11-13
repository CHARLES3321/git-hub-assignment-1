import * as z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(6, {
        message: "The name field is required"
    }),
    email: z.email({ message: "The email field is required"}),
    password: z.string().min(6, { message: 'Your password must be either 6 characters or greater than 6 characters in length'})
});