import { SDate, sdate } from "@/shared/lib/date/lib"

import { parseTokens } from "./parser"

type Week = {
  dates: SDate[]
}

type Month = {
  weeks: Week[]
  date: SDate
}

const generateWeek = (startOfWeek: SDate) => {
  const week: Week = { dates: [] }
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.addDay(i)
    week.dates.push(date)
  }
  return week
}

export const generateCalendar = (date: SDate = sdate()) => {
  const months: Month[] = []
  for (let i = 0; i < 5; i++) {
    const startOfMonth = date.startMonth().addMonth(i)

    const lastDate = startOfMonth.endMonth().dayOfMonth
    const day = startOfMonth.day
    const weekCount = Math.floor((lastDate + day) / 7)
    const startOfWeek = startOfMonth.subDay(day)
    const weeks: Week[] = []
    for (let k = 0; k < weekCount; k++) {
      weeks.push(generateWeek(startOfWeek.addWeek(k)))
    }
    months.push({ weeks: weeks, date: startOfMonth })
  }
  return months
}

export function parseDateInput(input: string) {
  const tokens = getTokens(input)
  return parseTokens(tokens)
}

function getTokens(input: string) {
  return input.split(" ")
}
