import { describe, expect, test } from "vitest"
import isTodayjs from "dayjs/plugin/isToday"
import { extend } from "dayjs"

import { isAfterToday, isBeforeToday, isToday, parseDate } from "./"

extend(isTodayjs)

describe("parseDate function", () => {
  test("should return Date", () => {
    const dateFromStr = parseDate("Thu May 02 2024 00:00:00")
    const y = dateFromStr.getFullYear()
    const m = dateFromStr.getMonth()
    const d = dateFromStr.getDate()
    const hh = dateFromStr.getHours()
    const mm = dateFromStr.getMinutes()
    const ss = dateFromStr.getSeconds()
    expect(y).toBe(2024)
    expect(m).toBe(4)
    expect(d).toBe(2)
    expect(hh).toBe(0)
    expect(mm).toBe(0)
    expect(ss).toBe(0)
  })
  test("should throw an error on invalid date", () => {
    expect(() => parseDate("invalid date")).toThrowError("Invalid date")
  })
})

describe("isToday function", () => {
  test("should tell if its today", () => {
    expect(isToday("Thu May 02 2024 00:00:00")).toBeTruthy()
    expect(isToday("Thu May 02 2024 23:59:59")).toBeTruthy()
    expect(isToday("Thu May 01 2024 23:59:59")).toBeFalsy()
  })
})

describe.only("isBeforeToday function", () => {
  test("should tell if its before specific date", () => {
    expect(isBeforeToday("Thu May 02 2024 00:00:00")).toBeFalsy()
    expect(isBeforeToday("Thu May 02 2024 23:59:59")).toBeFalsy()
    expect(isBeforeToday("Thu May 01 2024 23:59:59")).toBeTruthy()
  })
})

describe.only("isAfterToday function", () => {
  test("should tell if its before specific date", () => {
    expect(isAfterToday("Thu May 03 2024 00:00:00")).toBeTruthy()
    expect(isAfterToday("Thu May 02 2024 23:59:59")).toBeFalsy()
    expect(isAfterToday("Thu May 01 2024 23:59:59")).toBeFalsy()
  })
})
