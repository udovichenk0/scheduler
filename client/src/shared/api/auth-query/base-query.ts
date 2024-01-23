import { getUrl, setQuery, getJsonBody } from "./lib"
import { Request } from "./type"



export const baseQuery = async <P>({
    params,
    request,
    token,
  }: {
    params?: P
    request: Request<P>
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
