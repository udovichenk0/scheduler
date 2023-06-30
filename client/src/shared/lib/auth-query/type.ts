import { Contract, DynamicallySourcedField } from "@farfetched/core"

type UrlType = (params: Record<string, unknown>) => string 
export type HttpRequestType  = {
    body?: Record<string, unknown>, 
    params?: Record<string, unknown>, 
    query?: Record<string, string>
}

export interface Request {
    method: 'GET' | 'POST',
    url: string | UrlType,
    headers?: Record<string, string | string[]>
}
//!TODO fix later Params extends HttpRequestType
export interface Response <Resp>{
    contract: Contract<unknown, Resp>,
    mapData: DynamicallySourcedField<
    {
        result: Resp, 
        params: unknown
    }, 
    {
        result: Resp, 
        params: unknown
    }, unknown>
}