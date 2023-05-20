import { createQuery } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect } from "effector";
import { signupSchema } from "./signup.dto";

const signupContract = zodContract(signupSchema)

export const signupFx = createEffect(async (body: {email: string, password: string}) => {
    const data = await fetch('http://localhost:3000/auth/sign-up',
    {credentials: 'include', 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)})
    const res = await data.json()
    return res
})

export const signupQuery = createQuery({
    effect: signupFx,
    contract: signupContract,
})