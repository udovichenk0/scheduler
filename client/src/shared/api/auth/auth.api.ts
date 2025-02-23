import { createQuery } from "@farfetched/core"

import { SessionUserSchema } from "./auth.dto"
import { getAuthSession, getEmailExists, postAuthResend, postAuthSignin, postAuthSignout, postAuthSignup, postAuthVerify } from "../scheduler"
import { getAuthSessionResponse, getEmailExistsResponse, postAuthSigninResponse, postAuthSignupResponse } from "../zod"
import { handleResponse, throwIfError } from "../lib"
import { AuthEmailCredsBody, Email, PostAuthResendBody, PostAuthVerifyBody } from '../scheduler.schemas';
import { getHandledError } from "@/shared/lib/error"

export const tokenQuery = createQuery({
  handler: async ({ code, state }: {code: string, state: string}) => {
    const response = await fetch(import.meta.env.VITE_ORIGIN_URL + `api/auth/token?code=${code}&state=${state}`, {
      credentials: "include"
    })
    const s = await response.json()
    const user = SessionUserSchema.safeParse(s)
    if(user.success){
      return user.data
    }
    throw user.error
  }
})

export const checkSession = createQuery({
  handler: async () => {
    const response = await getAuthSession({credentials: "include"})
    return handleResponse(response, getAuthSessionResponse)
  }
})

export const signIn = createQuery({
  handler: async ({email, password}: AuthEmailCredsBody) => {
    const response = await postAuthSignin({email, password}, {credentials: "include"})
    return handleResponse(response, postAuthSigninResponse)
  }
})

export const signUp = createQuery({
  handler: async ({email, password}: AuthEmailCredsBody) => {
    const response = await postAuthSignup({email, password}, {credentials: "include"})
    return handleResponse(response, postAuthSignupResponse)
  }
})

export const checkVerifiedEmailExists = createQuery({
  handler: async (email: Email) => {
    const response = await getEmailExists({email})
    return handleResponse(response, getEmailExistsResponse)
  }
})

export const signOut = createQuery({
  handler: async () => {
    const response = await postAuthSignout({credentials: "include"})
    if(getHandledError(response.data)){
      throw response.data
    }
  }
})

export const verifyEmailQuery = createQuery({
  handler: async ({code, userId}: PostAuthVerifyBody) => {
    const response = await postAuthVerify({code, userId}, {credentials: "include"})
    throwIfError(response.data)
  }
})

export const resendCodeQuery = createQuery({
  handler: async ({userId, email}: PostAuthResendBody) => {
    const response = await postAuthResend({userId, email})
    throwIfError(response.data)
  }
})