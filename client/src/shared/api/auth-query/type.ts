import { Contract, DynamicallySourcedField } from "@farfetched/core"

export type UrlFuncTypeWithParams = (params: Record<string, unknown>) => string
type UrlFuncWithoutParams = () => string
export type HttpRequestType = {
  body?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, string>
}
export interface Request {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  url: string | UrlFuncTypeWithParams | UrlFuncWithoutParams
  headers?: Record<string, string | string[]>
}
export interface Response<Resp, Params> {
  contract: Contract<unknown, Resp>
  mapData: DynamicallySourcedField<
    {
      result: Resp
      params: Params
    },
    Resp,
    unknown
  >
}
