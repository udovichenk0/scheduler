import { createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect } from "effector"
import {
  $accessToken,
  refreshFx,
  setTokenTriggered,
  RefreshType,
} from "@/shared/api/token"
import { baseQuery } from "./base-query"
import { Request, Response, HttpRequestType } from "./type"

let refreshPromiseQueue: Promise<RefreshType> | null = null

export const authQuery = <Resp, Params extends HttpRequestType | void>({
  request,
  response,
}: {
  request: Request
  response: Response<Resp, Params>
}) => {
  const queryFx = attach({
    source: $accessToken,
    mapParams: ({ body, params, query }, token) => {
      return {
        token,
        body,
        params,
        query,
      }
    },
    effect: createEffect(
      async ({
        body,
        params,
        query,
        token,
      }: {
        body?: Record<string, unknown>
        params?: Record<string, unknown>
        query?: Record<string, string>
        token: string | null
      }) => {
        const response = await baseQuery({
          request: { ...request, body, params, query },
          token,
        })
        if (response.statusCode == 401) {
          if (!refreshPromiseQueue) {
            refreshPromiseQueue = refreshFx()
            const { access_token } = await refreshPromiseQueue
            if (!access_token) {
              throw new Error()
            } else {
              setTokenTriggered(access_token)
              return baseQuery({
                request: { ...request, body, params, query },
                token: access_token,
              })
            }
          } else {
            refreshPromiseQueue.then(({ access_token }) => {
              return baseQuery({
                request: { ...request, body, params, query },
                token: access_token,
              })
            })
          }
        }
        return response
      },
    ),
  })
  const headlessQuery = createHeadlessQuery({
    contract: response.contract,
    mapData: response.mapData,
  })
  headlessQuery.__.executeFx.use(queryFx)
  return headlessQuery
}
