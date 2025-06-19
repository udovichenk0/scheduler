import { Sorts } from "@/entities/task/config.ts"

import { SDate, sdate } from "@/shared/lib/date/lib"

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
  let dayCounter = sdate().date
  return new Array(MIN_DATES_LENGTH).fill(null).map(() => {
    const date = sdate().setDate(dayCounter).startDate()
    dayCounter += 1
    return date
  })
}

export function generateSequentialMonths() {
  const nextMonth = sdate().addDay(MIN_DATES_LENGTH).month + 1
  let monthCounter = nextMonth
  return new Array(MIN_MONTHS_LENGTH).fill(null).map(() => {
    const date = sdate().setMonth(monthCounter).startMonth()
    monthCounter += 1
    return date
  })
}
export function generateDaysOfWeek(int = 0) {
  const date: SDate[] = []
  const days = Array.from({ length: 7 })
  // + 1 because we don't want to include the current day
  let count = int * 7 + 1

  days.forEach(() => {
    date.push(sdate().addDay(count))
    count += 1
  })

  return date
}
