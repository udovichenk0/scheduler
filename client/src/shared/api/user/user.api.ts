import { createQuery } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"
import { createEffect } from "effector"

import { UserSchema } from "./user.dto"
const UserContract = zodContract(UserSchema)
export const getUserQuery = createQuery({
  effect: createEffect(async (email: string) => {
    const response = await fetch(
      import.meta.env.VITE_ORIGIN_URL + `user?email=${email}`,
      {
        method: "GET",
      },
    )
    const result = await response.json()
    if (result.status >= 400) {
      throw result
    }
    return result
  }),
  contract: UserContract,
})
