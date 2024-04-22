import { Contract, DynamicallySourcedField } from "@farfetched/core"

export type DataRecord<P> = (data: P) => Record<string, unknown>

export interface Request<P> {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  url: string | ((data: P) => string) | (() => string)
  headers?: Record<string, string | string[]>
  body?: DataRecord<P>
  query?: DataRecord<P>
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
