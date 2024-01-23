import { createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect } from "effector"

import { tokenService, tokenApi, TokenDto } from "@/shared/api/token"

import { baseQueryTest } from "./base-query"
import { Request, Response } from "./type"

let refreshPromiseQueue: Nullable<Promise<TokenDto>> = null

export const authQuery = <Resp, P = void>({
  request,
  response,
}: {
  request: Request<P>
  response: Response<Resp, P>
}) => {
  const queryFx = attach({
    source: tokenService.$accessToken,
    mapParams: (params:P, token) => {
      return {
        token,
        params,
      }
    },
    effect: createEffect(
      async ({
        params,
        token,
      }: {
        params?: P 
        token: Nullable<string>
      }) => {
        const response = await baseQueryTest({
          params,
          request: { ...request },
          token,
        })
        if (response.statusCode == 401) {
          if (!refreshPromiseQueue) {
            refreshPromiseQueue = tokenApi.refreshFx()
            const { access_token } = await refreshPromiseQueue
            if (access_token) {
              return retrySetTokenAndResetQueueWithParams(
                request,
                access_token,
                params,
              )
            } else {
              throw new Error()
            }
          } else {
            return retryAfterTokenRefreshWithParams(request, params)
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

function retryAfterTokenRefreshWithParams<P>(request: Request<P>, params?: P) {
  if (refreshPromiseQueue) {
    refreshPromiseQueue.then(({ access_token }) => {
      return baseQueryTest({
        params,
        request,
        token: access_token,
      })
    })
  }
}
function retrySetTokenAndResetQueueWithParams<P>(
  request: Request<P>,
  access_token: string,
  params?: P,
) {
  refreshPromiseQueue = null
  tokenService.setTokenTriggered(access_token)
  return baseQueryTest({
    request,
    params,
    token: access_token,
  })
}


// function retryAfterTokenRefresh(request: Request & HttpRequestType) {
//   if (refreshPromiseQueue) {
//     refreshPromiseQueue.then(({ access_token }) => {
//       return baseQuery({
//         request,
//         token: access_token,
//       })
//     })
//   }
// }
// function retrySetTokenAndResetQueue(
//   request: Request & HttpRequestType,
//   access_token: string,
// ) {
//   refreshPromiseQueue = null
//   tokenService.setTokenTriggered(access_token)
//   return baseQuery({
//     request: request,
//     token: access_token,
//   })
// }
