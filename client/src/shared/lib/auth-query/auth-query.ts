import { Contract, DynamicallySourcedField, createHeadlessQuery } from "@farfetched/core"
import { attach, createEffect, sample } from "effector"
import { $accessToken, refreshFx, setTokenTriggered } from "@/shared/api/token"
import { baseQuery } from "./base-query"
import { Request } from './type'
interface Response <Resp>{
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

export const authQuery = <Resp>({
    request, 
    response
}: {
    request: Request, 
    response: Response<Resp>
}) => {
    const queryFx = attach({
        source: $accessToken,
        mapParams: ({body}:{body?: Record<string, unknown>} = {}, token: string | null) => {
            return {
                token,
                body
            }
        },
        effect: createEffect(async ({body, token}:{
            body?: Record<string, unknown>,
            token: string | null,
        }) => {
            try {
                return await baseQuery({request: {...request, body}, token})
            } catch (error:any) {
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
    sample({
        clock: queryFx.doneData,
        fn: (d) => console.log(d)
    })
    const headlessQuery = createHeadlessQuery({
        contract: response.contract,
        mapData: response.mapData,
    })
    headlessQuery.__.executeFx.use(queryFx)
    return headlessQuery
}