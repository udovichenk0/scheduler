import { z } from "zod"
import { userSchema } from "../user/user.dto"
export const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  userData: userSchema,
})
export type RefreshType = z.infer<typeof tokenSchema>
