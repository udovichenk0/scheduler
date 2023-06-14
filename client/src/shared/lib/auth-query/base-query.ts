import { createEffect } from "effector"
import { Request } from './type'
export const baseQuery = createEffect(async ({
    request, 
    token
}:{
    request: Request & {body?: Record<string, unknown>}, 
    token: string | null}) => {
        const {method, url, headers, body} = request
        const response = await fetch(`http://localhost:3000/${url}`,{
            credentials: 'include',
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...headers
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return data
}) 