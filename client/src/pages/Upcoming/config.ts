import dayjs from "dayjs"

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
export const MIN_DATES_LENGTH = 14
export const MIN_MONTHS_LENGTH = 3
export function generateRemainingDaysOfMonth() {
  let dayCounter = dayjs().date()
  return new Array(MIN_DATES_LENGTH).fill(null).map(() => {
    const date = dayjs().date(dayCounter).startOf("date")
    dayCounter += 1
    return date
  })
}

export function generateRemainingMonthsOfYear() {
  const nextMonth = dayjs().add(MIN_DATES_LENGTH, "day").month() + 1
  let monthCounter = nextMonth
  return new Array(MIN_MONTHS_LENGTH).fill(null).map(() => {
    const date = dayjs().month(monthCounter).startOf("month")
    monthCounter += 1
    return date
  })
}
