import { z } from "zod"

export const ErrorSchema = z.object({
  status: z.number(),
  error: z.string(),
  message: z.string()
})

export type Error = z.infer<typeof ErrorSchema>