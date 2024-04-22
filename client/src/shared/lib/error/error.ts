export const UNEXPECTED_ERROR_MESSAGE =
  "setting.synchronization.error.unexpected"

type Response = {
  error: {
    response: {
      code: number
      message: string
    }
  }
}
export function isHttpError(error: number) {
  return (response: any) => {
    const r = response as Response
    return r.error?.response?.code ? r.error.response.code == error : false
  }
}

export function isError(response: any) {
  return !!response.error
}

export function isNoError(response: any) {
  return !isError(response)
}

export function generateError(code: number, message: string) {
  return {
    response: {
      code,
      message,
    },
    status: code,
    options: {},
    message,
  }
}
