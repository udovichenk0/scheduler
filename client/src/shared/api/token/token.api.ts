import { createQuery } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"
import { createEffect, sample } from "effector"

import { TokenDto, tokenSchema } from "./token.dto"
import { setTokenTriggered } from "./token.model"

const refreshContract = zodContract(tokenSchema)

export const refreshFx = createEffect<void, TokenDto>(async () => {
  const data = await fetch("http://localhost:3000/refresh", {
    method: "GET",
    credentials: "include",
  })
  const res = await data.json()
  return res
})
export const refreshQuery = createQuery({
  effect: refreshFx,
  contract: refreshContract,
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
