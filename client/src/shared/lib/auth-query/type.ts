import { Contract, DynamicallySourcedField } from "@farfetched/core"

export interface Request {
    method: 'GET' | 'POST',
    url: string,
    headers?: Record<string, string | string[]>
}
export interface Response {
    contract: Contract<unknown, any>,
    mapData: DynamicallySourcedField<any, any, any>
}