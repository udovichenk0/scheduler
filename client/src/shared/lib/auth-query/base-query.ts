import { createEffect } from "effector"
import { HttpRequestType, Request } from './type'
export const baseQuery = createEffect(async ({
  request, 
  token
}:{
    request: Request & HttpRequestType, 
    token: string | null}) => {

  const {method, url, headers, body, params, query} = request
  let urlWithParams;
  if(typeof url == 'function' && params){
    urlWithParams = url(params)
  }
  const newUrl = new URL(`${import.meta.env.VITE_ORIGIN_URL}${urlWithParams || url}`)
  if(query){
    for(const [key, value] of Object.entries(query)){
      newUrl.searchParams.set(key, value)
    }
  }
  const response = await fetch(newUrl,{
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