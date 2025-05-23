import dayjs from "dayjs"

import { getToday } from "./get-date"

type InputDate = Date | string
export const isToday = (date: Nullable<InputDate>) => {
  if (!date) return false
  return dayjs(parseDate(date)).isToday()
}

export const isBeforeToday = (date: Nullable<InputDate>) => {
  if (!date) return false
  return parseDate(date) < getToday().toDate()
}
export const isAfterToday = (date: Nullable<InputDate>) => {
  if (!date) return false
  return parseDate(date) > getToday().endOf("date").toDate()
}

export function parseDate(date: InputDate) {
  if (!date) throw new Error("Invalid date")
  if (date instanceof Date) return date
  const d = new Date(date)
  if (d instanceof RangeError || isNaN(d.getTime())) {
    throw new Error("Invalid date")
  }
  return d
}
