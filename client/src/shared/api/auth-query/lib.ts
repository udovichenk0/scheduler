import { DataRecord } from "./type"

export function getJsonBody<P>(body?: DataRecord<P>, params?: P) {
  if (!body) return
  if (!params) throw Error("There is no params")
  const data = body(params)
  return JSON.stringify(data)
}

export function setQuery<P>(url: URL, query?: DataRecord<P>, params?: P) {
  const urlWithQuery = new URL(url)
  if (query && params) {
    const a = query(params)
    for (const [key, value] of Object.entries(a)) {
      if (typeof value == "string" || typeof value == "number") {
        urlWithQuery.searchParams.set(key, value.toString())
      }
    }
  }
  return urlWithQuery
}
export function getUrl<P>(
  url: string | ((p: P) => string) | (() => string),
  params?: P,
) {
  if (typeof url == "string") {
    const path = extractSlash(url)
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${path}`)
  } else if (url.length && params) {
    const path = extractSlash(url(params))
    return new URL(`${import.meta.env.VITE_ORIGIN_URL}${path}`)
  }
  const path = extractSlash((url as () => string)())
  return new URL(`${import.meta.env.VITE_ORIGIN_URL}${path}`)
}

function extractSlash(path: string) {
  if (path[0] == "/") return path.slice(1)
  return path
}
