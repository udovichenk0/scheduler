import { createQuery } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"
import { createEffect } from "effector"

import { UserSchema } from "../user/user.dto"

import { AuthDto, AuthSchema } from "./auth.dto"

const AuthContract = zodContract(AuthSchema)
const UserContract = zodContract(UserSchema)

const signinFx = createEffect(
  async (body: { email: string; password: string }) => {
    const data = await fetch(
      import.meta.env.VITE_ORIGIN_URL + "auth/sign-in",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
      },
    )
    const res = await data.json()
    return res
  },
)
export const signinQuery = createQuery({
  effect: signinFx,
  contract: AuthContract,
})

export const signupFx = createEffect(
  async (body: { email: string; password: string }) => {
    const data = await fetch(
      import.meta.env.VITE_ORIGIN_URL + "auth/sign-up",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
      },
    )
    const res = await data.json()
    return res
  },
)
export const signupQuery = createQuery({
  effect: signupFx,
  contract: UserContract,
})

export const logoutQuery = createQuery({
  effect: createEffect(async () => {
    const data = await fetch(import.meta.env.VITE_ORIGIN_URL + "auth/logout", {
      method: "POST",
      credentials: "include",
    })
    const res = await data.json()
    return res
  }),
})

export const verifyQuery = createQuery({
  effect: createEffect<{ code: string; email: string }, AuthDto>(
    async ({ code, email }) => {
      const result = await fetch(
        import.meta.env.VITE_ORIGIN_URL + "auth/verify-email",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, email }),
        },
      )
      return result.json()
    },
  ),
  contract: AuthContract,
})
