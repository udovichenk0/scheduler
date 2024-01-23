import { Contract, DynamicallySourcedField } from "@farfetched/core"

export type UrlFuncTypeWithParams = (params: Record<string, unknown>) => string

export interface Request <P>{
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  url: string | ((data: P) => string) | (() => string)
  headers?: Record<string, string | string[]>
  body?: ((data: P) => Record<string, unknown>)
  query?: ((data: P) => Record<string, unknown>)
}
export interface Response<Resp , Params> {
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
