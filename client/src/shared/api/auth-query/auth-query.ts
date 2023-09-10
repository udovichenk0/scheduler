import { createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect } from "effector"

import {
  $accessToken,
  refreshFx,
  setTokenTriggered,
  TokenDto,
} from "@/shared/api/token"

import { baseQuery } from "./base-query"
import { Request, Response, HttpRequestType } from "./type"

let refreshPromiseQueue: Nullable<Promise<TokenDto>> = null

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
        token: Nullable<string>
      }) => {
        const response = await baseQuery({
          request: { ...request, body, params, query },
          token,
        })
        if (response.statusCode == 401) {
          if (!refreshPromiseQueue) {
            refreshPromiseQueue = refreshFx()
            const { access_token } = await refreshPromiseQueue
            if (access_token) {
              return retrySetTokenAndResetQueue(
                { ...request, body, params, query },
                access_token,
              )
            } else {
              throw new Error()
            }
          } else {
            return retryAfterTokenRefresh({ ...request, body, params, query })
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

function retryAfterTokenRefresh(request: Request & HttpRequestType) {
  if (refreshPromiseQueue) {
    refreshPromiseQueue.then(({ access_token }) => {
      return baseQuery({
        request,
        token: access_token,
      })
    })
  }
}
function retrySetTokenAndResetQueue(
  request: Request & HttpRequestType,
  access_token: string,
) {
  refreshPromiseQueue = null
  setTokenTriggered(access_token)
  return baseQuery({
    request: request,
    token: access_token,
  })
}
