import dayjs, { Dayjs } from "dayjs"

import { Sorts } from "@/entities/task/config.ts"

export const MIN_DATES_LENGTH = 14
export const MIN_MONTHS_LENGTH = 3

export const SORT_CONFIG = [
  Sorts.DEFAULT,
  Sorts.BY_ALPHABET.ASC,
  Sorts.BY_ALPHABET.DESC,
  Sorts.BY_TIME.ASC,
  Sorts.BY_TIME.DESC,
]

export function generateSequentialDates() {
  let dayCounter = dayjs().date()
  return new Array(MIN_DATES_LENGTH).fill(null).map(() => {
    const date = dayjs().date(dayCounter).startOf("date")
    dayCounter += 1
    return date
  })
}

export function generateSequentialMonths() {
  const nextMonth = dayjs().add(MIN_DATES_LENGTH, "day").month() + 1
  let monthCounter = nextMonth
  return new Array(MIN_MONTHS_LENGTH).fill(null).map(() => {
    const date = dayjs().month(monthCounter).startOf("month")
    monthCounter += 1
    return date
  })
}
export function generateDaysOfWeek(int = 0) {
  const date: Dayjs[] = []
  const days = Array.from({ length: 7 })
  // + 1 because we don't want to include the current day
  let count = int * 7 + 1

  days.forEach(() => {
    date.push(dayjs().add(count, "day"))
    count += 1
  })

  return date
}
