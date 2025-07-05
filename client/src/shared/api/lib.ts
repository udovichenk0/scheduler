import * as z from "zod"

import { getHandledError } from "../lib/error"
// type T z.ZodObject
type E = {
  data: any
  status: number
  headers: Headers
}
export function handleResponse<T extends E, S>(
  response: T,
  schema: z.Schema<S>,
): S {
  const parsed = schema.safeParse(response.data)
  console.log(parsed)
  if (parsed.success) {
    return parsed.data
  }

  if (getHandledError(response.data)) {
    throw response.data
  }

  throw parsed.error
}
export function throwIfError(data: any) {
  if (getHandledError(data)) {
    throw data
  }
}
