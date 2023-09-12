import { z } from "zod"

import { UserSchema } from "../user/user.dto"
export const TokenSchema = z.object({
  access_token: z.string(),
  userData: UserSchema,
})
export type TokenDto = z.infer<typeof TokenSchema>
