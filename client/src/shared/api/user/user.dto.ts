import { z } from 'zod'
export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    verified: z.boolean()
})

export type UserDto = z.infer<typeof UserSchema>
