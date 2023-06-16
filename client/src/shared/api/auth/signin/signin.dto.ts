import { z } from "zod";
import { userSchema } from "../../user/user.dto";

export const signinSchema = z.object({
  user: userSchema,
  access_token: z.string(),
  refresh_token: z.string()
})