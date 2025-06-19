import { describe, expect, test } from "vitest"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import weekday from "dayjs/plugin/weekday"
import isBetween from "dayjs/plugin/isBetween"
import { extend } from "dayjs"

import { getToday, sdate } from "./lib"

extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)
extend(weekday)
extend(isBetween)

describe("parseDate function", () => {
  test("should return Date", () => {
    const dateFromStr = sdate("Thu May 02 2024 00:00:00")
    const y = dateFromStr.year
    const m = dateFromStr.month
    const d = dateFromStr.date
    const hh = dateFromStr.hour
    const mm = dateFromStr.minute
    expect(y).toBe(2024)
    expect(m).toBe(4)
    expect(d).toBe(2)
    expect(hh).toBe(0)
    expect(mm).toBe(0)
  })
})

describe("isToday function", () => {
  test("should tell if its today", () => {
    expect(sdate().isToday).toBeTruthy()
    expect(
      getToday().setHour(23).setMinute(59).setSecond(59).isToday,
    ).toBeTruthy()
    expect(getToday().subDay(1).isToday).toBeFalsy()
  })
})

describe("isBeforeToday function", () => {
  test("should tell if its before specific date", () => {
    expect(getToday().isBeforeToday).toBeFalsy()
    expect(getToday().setMinute(59).setSecond(59).isBeforeToday).toBeFalsy()
    expect(
      getToday().subDay(1).setHour(23).setMinute(59).setSecond(59)
        .isBeforeToday,
    ).toBeTruthy()
  })
})

describe("isAfterToday function", () => {
  test("should tell if its after specific date", () => {
    expect(getToday().addDay(1).isAfterToday).toBeTruthy()
    expect(
      getToday().setHour(23).setMinute(59).setSecond(59).isAfterToday,
    ).toBeFalsy()
    expect(getToday().subDay(1).isAfterToday).toBeFalsy()
  })
})

describe("", () => {
  test("date creation", () => {
    const dateFromString = sdate("10/10/2025")
    const dateFromDate = sdate(new Date("10/10/2025"))
    expect(dateFromString.toString()).toBe(dateFromDate.toString())
  })
  test("get date parts", () => {
    const date = sdate(new Date("5/14/2025 10:15"))
    const year = date.year
    const month = date.month
    const dayOfMonth = date.date
    const hour = date.hour
    const minute = date.minute

    expect(year).toBe(2025)
    expect(month).toBe(4)
    expect(dayOfMonth).toBe(14)
    expect(hour).toBe(10)
    expect(minute).toBe(15)
  })
})
describe("comparsion", () => {
  test("with single date", () => {
    const today = sdate()
    const tomorrow = sdate(new Date()).addDay(1)
    console.log(tomorrow.isTomorrow)

    expect(today.isToday).toBeTruthy()
    expect(tomorrow.isTomorrow).toBeTruthy()
  })
  test("isSame", () => {
    const before = sdate("5/9/2025")
    const after = sdate("5/10/2025")

    const dateWithTime = sdate("5/9/2025 23:59:59")

    expect(before.isBeforeDate(after)).toBeTruthy()
    expect(dateWithTime.isBeforeDate(after)).toBeTruthy()
    expect(after.isAfterDate(before)).toBeTruthy()
    expect(
      sdate("5/9/2025 10:10:10").isBefore(sdate("5/9/2025 10:10:11")),
    ).toBeTruthy()
  })
  test("isSameOrAfter isSameOrBefore", () => {
    const before = sdate("5/9/2025")
    const after = sdate("5/10/2025")
    const sameAfter = sdate("5/10/2025")

    expect(before.isSameDateOrBefore(after)).toBeTruthy()
    expect(after.isSameDateOrBefore(sameAfter)).toBeTruthy()
    expect(after.isSameDateOrBefore(before)).toBeFalsy()

    expect(after.isSameDateOrAfter(before)).toBeTruthy()
    expect(after.isSameDateOrAfter(sameAfter)).toBeTruthy()
    expect(before.isSameDateOrAfter(after)).toBeFalsy()
  })

  test("isSame date part", () => {
    const date = sdate("5/9/2025")
    const date2 = sdate("6/8/2026 10:10:10")
    const date3 = sdate("6/8/2027")

    expect(date.isSameDate(date2)).toBeFalsy()
    expect(date.isSameDate(date)).toBeTruthy()

    expect(date.isSameYear(date2)).toBeFalsy()
    expect(date.isSameYear(date)).toBeTruthy()

    expect(date.isSameMonth(date2)).toBeFalsy()
    expect(date.isSameMonth(date)).toBeTruthy()
    expect(date2.isSameMonth(date3)).toBeFalsy()
  })
})

describe("date operations", () => {
  test("addition", () => {
    const date = sdate("5/1/2025")
    const add1daydate = date.addDay(1)
    const add1monthdate = date.addMonth(1)
    const add1year = date.addYear(1)
    expect(add1daydate.date).toBe(2)
    expect(add1monthdate.month).toBe(5) // 0-11
    expect(add1year.year).toBe(2026)
  })
  test("subtract", () => {
    const date = sdate("5/3/2025")

    const sub1day = date.subDay(1)
    expect(sub1day.date).toBe(2)
  })
})
