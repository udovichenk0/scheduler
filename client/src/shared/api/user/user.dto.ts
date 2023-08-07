import { z } from "zod"
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified: z.boolean(),
})

export type UserDto = z.infer<typeof userSchema>
