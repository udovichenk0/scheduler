import { z } from "zod"

import { UserSchema } from "../user/user.dto"

export const AuthSchema = z.object({
  user: UserSchema,
  access_token: z.string(),
})
export type AuthDto = z.infer<typeof AuthSchema>
