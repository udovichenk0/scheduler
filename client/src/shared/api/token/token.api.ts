import { createQuery } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect, sample } from "effector";
import { tokenSchema } from "./token.dto";
import { setTokenTriggered } from "./token.model";

const refreshContract = zodContract(tokenSchema)

const refreshFx = createEffect(async () => {
    const data = await fetch('http://localhost:3000/auth/refresh')
    const res = await data.json()
    return res
})

export const refreshQuery = createQuery({
    effect: refreshFx,
    contract: refreshContract
})

sample({
  clock: refreshQuery.finished.success,
  fn: ({result}) => result.access_token,
  target: setTokenTriggered  
})
