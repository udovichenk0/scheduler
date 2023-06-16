import { createQuery } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect } from "effector";
import { signinSchema } from "./signin.dto";

const signinContract = zodContract(signinSchema)


const signinFx = createEffect(async (body: {email: string, password: string}) => {
  const data = await fetch('http://localhost:3000/auth/sign-in',
    {credentials: 'include', 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)})
  const res = await data.json()
  return res
})
export const signinQuery = createQuery({
  effect: signinFx,
  contract: signinContract,
})