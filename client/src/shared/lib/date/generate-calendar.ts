import { sdate } from "./lib"

export const generateCalendar = (
  year = sdate().year,
  month = sdate().month,
) => {
  const firstDayOfMonth = sdate(new Date(year, month)).day

  let current = 0 - firstDayOfMonth
  return Array.from({ length: 35 }).map(() => {
    current += 1
    return sdate(new Date(year, month, current))
  })
}
