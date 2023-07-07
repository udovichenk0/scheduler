import { createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect } from "effector"
import { $accessToken, refreshFx, setTokenTriggered } from "@/shared/api/token"
import { baseQuery } from "./base-query"
import { Request, Response } from './type'


//TODO validation of the response with zod
//Params extends HttpRequestType
// <Resp, (string & {}) | Request >
export const authQuery = <Resp>({
  request, 
  response
}: {
    request: Request, 
    response: Response<Resp>
}) => {
  const queryFx = attach({
    source: $accessToken,
    mapParams: ({body,params, query}, token) => {
      return {
        token,
        body,
        params,
        query
      }
    },
    effect: createEffect(async ({body,params, query, token}:{
        body?: Record<string, unknown>,
        params?: Record<string, unknown>,
        query?: Record<string, string>,
        token: string | null,
      }) => {
      const response = await baseQuery({request: {...request, body, params, query}, token})
      if(response.statusCode == 401){
        const {access_token} = await refreshFx()
        if(!access_token){
          throw new Error()
        }
        else{
          setTokenTriggered(access_token)
          return await baseQuery({request: {...request, body, params, query}, token: access_token})
        }
      }
      return response
    })
  })
  const headlessQuery = createHeadlessQuery({
    contract: response.contract,
    mapData: response.mapData,
  })
  headlessQuery.__.executeFx.use(queryFx)
  return headlessQuery
}