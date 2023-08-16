import { createQuery } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"
import { createEffect } from "effector"

import { UserDto } from "../user"
import { userSchema } from "../user/user.dto"

import { authSchema } from "./auth.dto"

const authContract = zodContract(authSchema)
const userContract = zodContract(userSchema)
const signinFx = createEffect(
  async (body: { email: string; password: string }) => {
    const data = await fetch("http://localhost:3000/auth/sign-in", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    })
    const res = await data.json()
    return res
  },
)
export const signinQuery = createQuery({
  effect: signinFx,
  contract: authContract,
})

export const signupFx = createEffect(
  async (body: { email: string; password: string }) => {
    const data = await fetch("http://localhost:3000/auth/sign-up", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    })
    const res = await data.json()
    return res
  },
)
export const signupQuery = createQuery({
  effect: signupFx,
  contract: userContract,
})

export const logoutQuery = createQuery({
  effect: createEffect(async () => {
    const data = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    const res = await data.json()
    return res
  }),
})

type VerifyEmailResponse = {
  user: UserDto
  access_token: string
  refresh_token: string
}
export const verifyQuery = createQuery({
  effect: createEffect<{ code: string; email: string }, VerifyEmailResponse>(
    async ({ code, email }) => {
      const result = await fetch("http://localhost:3000/auth/verify-email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email }),
      })
      return result.json()
    },
  ),
  contract: authContract,
})
