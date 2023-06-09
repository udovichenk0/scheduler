import { createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect } from "effector"
import { $accessToken, refreshFx, setTokenTriggered } from "@/shared/api/token"
import { baseQuery } from './base-query'
import { Request, Response } from './type'
export const authQuery = (request: Request, response: Response) => {
    const queryFx = attach({
        source: $accessToken,
        mapParams: ({body}, token) => {
            return {
                token,
                body
            }
        },
        effect: createEffect(async ({token, body}:{
            token: string | null,
            body: Record<string, unknown>
        }) => {
            try {
              return await baseQuery({request: {...request, body}, token})
            } catch (error:any) {
                console.log(error)
              if(error.status == 401){
                  const {access_token} = await refreshFx()
                  if(access_token){
                    throw new Error()
                  }
                  else{
                      setTokenTriggered(access_token)
                      return await baseQuery({request: {...request, body}, token})
                  }
              }
            }
      })
    })
    const headlessQuery = createHeadlessQuery({
        contract: response.contract,
        mapData: response.mapData,
    })
    headlessQuery.__.executeFx(queryFx)
    return headlessQuery
}