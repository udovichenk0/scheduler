import { describe, expect, test } from "vitest"
import isTodayjs from "dayjs/plugin/isToday"
import dayjs, { extend } from "dayjs"

import { isAfterToday, isBeforeToday, isToday, parseDate } from "./comparison"
import { getToday } from "./get-date"

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
    expect(isToday(getToday().toDate())).toBeTruthy()
    expect(
      isToday(dayjs(getToday()).add(59, "minute").add(59, "second").toDate()),
    ).toBeTruthy()
    expect(isToday(dayjs(getToday()).subtract(1, "day").toDate())).toBeFalsy()
  })
})

describe("isBeforeToday function", () => {
  test("should tell if its before specific date", () => {
    console.log(getToday())
    expect(isBeforeToday(getToday().toDate())).toBeFalsy()
    expect(
      isBeforeToday(
        dayjs(getToday()).add(59, "minute").add(59, "second").toDate(),
      ),
    ).toBeFalsy()
    expect(isBeforeToday("Thu May 01 2024 23:59:59")).toBeTruthy()
  })
})

describe("isAfterToday function", () => {
  test("should tell if its after specific date", () => {
    expect(isAfterToday(dayjs(getToday()).add(1, "day").toDate())).toBeTruthy()
    expect(
      isAfterToday(
        dayjs(getToday()).add(59, "minute").add(59, "second").toDate(),
      ),
    ).toBeFalsy()
    expect(
      isAfterToday(dayjs(getToday()).subtract(1, "day").toDate()),
    ).toBeFalsy()
  })
})
