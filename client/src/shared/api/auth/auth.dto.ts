import { z } from "zod"

export const SessionUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  verified: z.boolean(),
  created_at: z.string()
})

export const UserDto = z.object({
  id: z.string(),
  email: z.string().email(),
  verified: z.boolean(),
  created_at: z.string()
})


export const EmailTakenDtoSchema = z.object({
  exists: z.boolean()
})

export type SessionUserDto = z.infer<typeof SessionUserSchema>