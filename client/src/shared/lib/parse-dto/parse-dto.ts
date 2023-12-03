import { z } from "zod"

export const parseDto = <S>(schema: z.ZodType<S>, data: unknown) => {
  const parsed = schema.safeParse(data)
  if (parsed.success) return parsed.data
  throw {
    data,
    message: 'Response was considered as invalid against a given contract'
  }
}