import { describe, expect, test } from "vitest"

import { setQuery, setUrlParams } from "./base-query"

describe("base-query test", () => {
  const baseUrl = "http://localhost:3000/"
  test("add params to url", () => {
    const urlAsString = "user"
    const urlAsFuncWithoutParams = () => `user`
    const stringWithoutParams = setUrlParams(urlAsString)
    const funcWithoutParams = setUrlParams(urlAsFuncWithoutParams)
    const funcWithParams = setUrlParams(({ id }) => `user/${id}`, { id: "1" })

    expect(stringWithoutParams.href).toBe(baseUrl + urlAsString)
    expect(funcWithoutParams.href).toBe(baseUrl + "user")
    expect(funcWithParams.href).toBe(baseUrl + "user/1")
  })
  test("add query to url", () => {
    const url = new URL(baseUrl + "users")
    const urlWithQuery = setQuery(url, { limit: 10, page: 1 })
    const urlWithoutQuery = setQuery(url)

    expect(urlWithQuery.href).toBe(baseUrl + "users?limit=10&page=1")
    expect(urlWithoutQuery.href).toBe(baseUrl + "users")
  })
})
