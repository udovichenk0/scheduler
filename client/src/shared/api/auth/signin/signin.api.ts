import { createEffect } from "effector";

export const signinFx = createEffect(async (body: {email: string, password: string}) => {
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
