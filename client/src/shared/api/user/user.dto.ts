import { z } from "zod"
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  verified: z.boolean(),
})

export type UserDto = z.infer<typeof userSchema>
