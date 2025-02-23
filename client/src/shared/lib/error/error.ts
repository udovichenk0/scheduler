import { Error } from "@/shared/api/type"

export const UNEXPECTED_ERROR_MESSAGE =
  "setting.synchronization.error.unexpected"

export function isErrorMessageValid(message: string){
  return ({error}: {error: any}) => {
    const err = getHandledError(error)
    if(!err){
      return false
    }
    return err.message === message
  }
}

export function isHttpError(status: number){
  return ({error}: {error: any}) => {
    const err = getHandledError(error)
    if(!err){
      return false
    }
    return err.status === status
  }
}

export function getHandledError(error: any): Error | null {
  const err = error as Error
  if(!!err?.error && !!err?.message){
    return err
  }
  return null
}