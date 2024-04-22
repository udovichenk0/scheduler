import { describe, expect, test } from "vitest"

import { getJsonBody, getUrl, setQuery } from "./lib"

describe("SetQuery", () => {
  const baseUrl = "http://localhost:3000/"
  test("Should add query to url", () => {
    const url = new URL(baseUrl + "users")
    const params = {
      limit: 10,
      page: 1,
    }
    const urlWithQuery = setQuery(
      url,
      (d) => ({ limit: d.limit, page: d.page }),
      params,
    )
    const urlWithoutQuery = setQuery(url)

    expect(urlWithQuery.href).toBe(baseUrl + "users?limit=10&page=1")
    expect(urlWithoutQuery.href).toBe(baseUrl + "users")
  })
  test("Should exclude undefined params", () => {
    const url = new URL(baseUrl + "users")
    const params = {
      limit: undefined,
      page: 1,
    }
    const urlWithQuery = setQuery(
      url,
      (d) => ({ limit: d.limit, page: d.page }),
      params,
    )
    const urlWithoutQuery = setQuery(url)

    expect(urlWithQuery.href).toBe(baseUrl + "users?page=1")
    expect(urlWithoutQuery.href).toBe(baseUrl + "users")
  })
})

describe("GetJsonBody", () => {
  test("Should return json body", () => {
    const body = {
      limit: 10,
      page: 1,
    }
    const jsonBody = getJsonBody((data) => data, body)
    expect(jsonBody).toBe(JSON.stringify(body))
  })
  test("Should return nested json body", () => {
    const body = {
      limit: 10,
      page: 1,
      nested: {
        value: 1,
        nestedAgain: {
          value: "value",
        },
      },
    }
    const jsonBody = getJsonBody((data) => data, body)
    expect(jsonBody).toBe(JSON.stringify(body))
  })
  test("Should return selected json fields from body", () => {
    const data = {
      limit: 10,
      page: 1,
      nested: {
        value: 1,
        nestedAgain: {
          value: "value",
        },
      },
    }
    const expectedData = {
      limit: data.limit,
      nestedAgain: data.nested.nestedAgain,
    }
    const jsonBody = getJsonBody(
      (body) => ({
        limit: body.limit,
        nestedAgain: body.nested.nestedAgain,
      }),
      data,
    )
    expect(jsonBody).toBe(JSON.stringify(expectedData))
  })
  test("Should ignore undefined values", () => {
    const data = {
      limit: 10,
      page: 1,
      nested: {
        value: 1,
        nestedAgain: {
          value: "value",
        },
      },
    }
    const expectedData = {
      limit: data.limit,
    }
    const jsonBody = getJsonBody(
      (body) => ({
        limit: body.limit,
        //@ts-ignore
        nestedAgain: body.nested.nestedAgainsd,
      }),
      data,
    )
    expect(jsonBody).toBe(JSON.stringify(expectedData))
  })
  test("Should throw an error if no params with body method", () => {
    const jsonBody = () =>
      getJsonBody((body) => ({
        //@ts-expect-error
        limit: body.limit,
        //@ts-expect-error
        nestedAgain: body.nested.nestedAgain,
      }))
    expect(jsonBody).toThrowError("There is no params")
  })
})

describe("GetUrl", () => {
  test("Should return url with url as string", () => {
    const url = getUrl("/user").href
    expect(url).toBe(import.meta.env.VITE_ORIGIN_URL + "user")
  })
  test("Should return url with url as func", () => {
    const url = getUrl(() => "user").href
    expect(url).toBe(import.meta.env.VITE_ORIGIN_URL + "user")
  })
  test("Should return url with params", () => {
    const params = {
      userId: "1",
    }
    const url = getUrl((p) => "user/" + p.userId, params).href
    expect(url).toBe(import.meta.env.VITE_ORIGIN_URL + "user/1")
  })
})
