import { Query } from "@farfetched/core"
import { sample } from "effector"

type Error = {
  error: string,
  description: string
}

export const UNEXPECTED_ERROR_MESSAGE = 'setting.synchronization.error.unexpected'

export const 
  invalid_code = 'invalid',
  invalid_password = 'invalid',
  invalid = 'invalid', 
  expired = 'expired'

export const getErrorMessage = <P,D,E>(api: Query<P, D, E>, errorType: string) => {
  return (
    sample({
      clock: api.finished.failure,
      filter: ({ error }) => (error as Error).error == errorType,
      fn: ({ error }) => (error as Error).description
    })
  )
}
export const isHttpErrorType = (error: any, errorType: string) => error.error == errorType