import { createEffect } from "effector"

import { HttpRequestType, Request, UrlFuncTypeWithParams } from "./type"
export const baseQuery = createEffect(
  async ({
    request,
    token,
  }: {
    request: Request & HttpRequestType
    token: Nullable<string>
  }) => {
    const { method, url, headers, body, params, query } = request

    const urlWithParams = setUrlParams(url, params)
    const urlWithQueryAndParams = setQuery(urlWithParams, query)

    const response = await fetch(urlWithQueryAndParams, {
      credentials: "include",
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return data
  },
)

export function setUrlParams(
  url: UrlFuncTypeWithParams | string,
  params?: Record<string, unknown>,
) {
  if (typeof url == "string") {
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${url}`)
  }
  if (typeof url === "function" && params) {
    const urlWithParams = url(params)
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${urlWithParams}`)
  }
  return new URL(`${import.meta.env.VITE_ORIGIN_URL}${url({})}`)
}

export function setQuery(url: URL, query?: Record<string, string | number>) {
  const urlWithQuery = new URL(url)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      urlWithQuery.searchParams.set(key, value.toString())
    }
  }
  return urlWithQuery
}
