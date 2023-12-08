import { createQuery } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"
import { createEffect, sample } from "effector"

import { TokenDto, TokenSchema } from "./token.dto"
import { setTokenTriggered } from "./token.model"

const RefreshContract = zodContract(TokenSchema)

export const refreshFx = createEffect<void, TokenDto>(async () => {
  const data = await fetch(import.meta.env.VITE_ORIGIN_URL + "refresh", {
    method: "GET",
    credentials: "include",
  })
  const res = await data.json()
  return res
})

export const refreshQuery = createQuery({
  effect: refreshFx,
  contract: RefreshContract,
  mapData({ result }: { result: TokenDto }) {
    return {
      access_token: result.access_token,
      user: result.userData,
    }
  },
})

sample({
  clock: refreshQuery.finished.success,
  fn: ({ result }) => result.access_token,
  target: setTokenTriggered,
})
