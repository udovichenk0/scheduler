import { Request } from "./type"



export const baseQueryTest = async <T>({
    params,
    request,
    token,
  }: {
    params?: T
    request: Request<T>
    token: Nullable<string>
  }) => {
    const { method, url, headers, body, query } = request

    const newUrl = getUrl(url, params)
    const urlWithQuery = setQuery(newUrl, query, params)
    const jsonBody = getJsonBody(body, params)
    const response = await fetch(urlWithQuery, {
      credentials: "include",
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: jsonBody,
    })
    const data = await response.json()
    return data
  }

export function getJsonBody<T>(body?: ((data: T) => Record<string, unknown>), params?: T){
  if(!body) return
  if(!params) throw Error("There is no params")
  const data = body(params)
  return JSON.stringify(data)
}

export function setQuery<P>(url: URL, query?: (d: P) => Record<string, unknown>, params?: P) {
  const urlWithQuery = new URL(url)
  if (query && params) {
    const a = query(params)
    for (const [key, value] of Object.entries(a)) {
      if(typeof value == 'string' || typeof value == 'number'){
        urlWithQuery.searchParams.set(key, value.toString())
      }
    }
  }
  return urlWithQuery
}
export function getUrl<T>(url: string | ((p: T) => string) | (() => string), params?: T){
  if(typeof url == 'string') {
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${url}`)
  }
  else if(url.length && params) {
    const withParams = url(params)
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${withParams}`)
  }
  const u = (url as (() => string))()
  return new URL(`${import.meta.env.VITE_ORIGIN_URL}${u}`)
}
