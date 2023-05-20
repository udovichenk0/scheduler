import { z } from 'zod'
export const tokenSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string()
})