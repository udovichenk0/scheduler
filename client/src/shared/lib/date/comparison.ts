import dayjs from "dayjs"

import { getToday } from "./get-today"

type InputDate = Date | string
export const isToday = (date: Nullable<InputDate>) => {
  if (!date) return false
  return dayjs(parseDate(date)).isToday()
}
export const isBeforeToday = (date: InputDate) => {
  return parseDate(date) < getToday()
}
export const isAfterToday = (date: InputDate) => {
  return parseDate(date) > getToday()
}

function parseDate(date: InputDate) {
  if (!date) throw Error("Invalid date")
  if (date instanceof Date) return date
  if (new Date(date) instanceof RangeError) {
    throw Error("Invalid date")
  }
  return new Date(date)
}
