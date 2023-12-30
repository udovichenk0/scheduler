import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified: z.boolean(),
})
export const GetUserDto = UserSchema.or(z.object({
  error: z.string(),
  message: z.string()
}))

export type UserDto = z.infer<typeof UserSchema>
export type GetUserDto = z.infer<typeof GetUserDto>