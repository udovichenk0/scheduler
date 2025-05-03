import { z } from "zod"

import { getHandledError } from "../lib/error"
// type T z.ZodObject
type E = {
  data: any
  status: number
  headers: Headers
}
export function handleResponse<T extends E, S>(
  response: T,
  schema: z.ZodSchema<S>,
): S {
  const parsedUser = schema.safeParse(response.data)

  if (parsedUser.success) {
    return parsedUser.data
  }

  if (getHandledError(response.data)) {
    throw response.data
  }

  throw parsedUser.error
}
export function throwIfError(data: any) {
  if (getHandledError(data)) {
    throw data
  }
}
