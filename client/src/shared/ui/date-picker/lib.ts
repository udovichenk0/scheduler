import dayjs, { Dayjs } from "dayjs"

import { parseTokens } from "./parser"

type Week = {
  dates: Dayjs[]
}

type Month = {
  weeks: Week[]
  date: Dayjs
}

const generateWeek = (startOfWeek: Dayjs) => {
  const week: Week = { dates: [] }
  for(let i = 0; i < 7; i++){
    const date = startOfWeek.add(i, "day")
    week.dates.push(date)
  }
  return week
}

export const generateCalendar = (dayjsDate: Dayjs = dayjs()) => {

  const months: Month[] = []
  for (let i = 0; i < 5; i++) {
    const startOfMonth = dayjsDate.startOf("month").add(i, "month")
    const lastDate = startOfMonth.endOf("month").date()
    const day = startOfMonth.day()
    const weekCount = Math.floor((lastDate + day) / 7)
    const startOfWeek = startOfMonth.subtract(day, "day")
    const weeks: Week[] = []
    for(let k = 0; k < weekCount; k++){
      weeks.push(generateWeek(startOfWeek.add(k, "week")))
    }
    months.push({weeks: weeks, date: startOfMonth})
  }
  return months
}

export function parseDateInput(input: string) {
  const tokens = getTokens(input);
  return parseTokens(tokens);
}

function getTokens(input: string) {
  return input.split(" ");
}
