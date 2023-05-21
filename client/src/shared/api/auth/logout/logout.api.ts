import { createQuery } from "@farfetched/core";
import { createEffect } from "effector/effector.mjs";

const logoutFx = createEffect(async () => {
    const data = await fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        credentials: 'include',
    })
    const res = await data.json()
    return res
})

export const logoutQuery = createQuery({
    effect: logoutFx
})