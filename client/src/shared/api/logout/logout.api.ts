import { createQuery } from "@farfetched/core";
import { createEffect } from "effector/effector.mjs";

const logoutFx = createEffect(async () => {
    const data = await fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    })
})

export const logoutQuery = createQuery({
    effect: logoutFx
})