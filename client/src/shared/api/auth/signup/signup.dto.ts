import { z } from "zod";
import { userSchema } from "../../user/user.dto";

export const signupSchema = z.object({
    user: userSchema,
    access_token: z.string(),
    refresh_token: z.string()
})