import dayjs, { Dayjs } from "dayjs"

import { parseTokens } from "./parser"

export type SectionRow = {
  date: number
  month: number
  year: number
  day: number
}[]
type CalendarSections = {
  date: Dayjs
  rows: SectionRow[]
}[]
export const generateCalendar = (dayjsDate: Dayjs = dayjs()) => {
  const result: CalendarSections = []
  for (let i = 0; i < 5; i++) {
    const startOfDate = dayjsDate.startOf("month").add(i, "month")
    const day = startOfDate.day()
    const startOfTheDate = startOfDate.add(-day, "day")
    const endOfTheDate = startOfDate.endOf("month")
    let row: SectionRow = []
    let rows: SectionRow[] = []

    //           all dates of month + days from the prev month that are on the same row
    const sectionsDatesLength = endOfTheDate.date() + day
    for (let k = 0; k < sectionsDatesLength; k++) {
      const d = startOfTheDate.add(k, "day")
      const date = d.date()
      const month = d.month()
      const year = d.year()
      const day = d.day()
      row.push({ date, month, year, day })
      if (row.length == 7) {
        if (row[row.length - 1].date > 24) {
          rows.push(row)
          row = []
          break
        }
        rows.push(row)
        row = []
      }
    }
    result.push({
      date: startOfDate,
      rows: rows,
    })
    rows = []
  }
  return result
}


export const sum = (a: number) => (b: number) => a + b
export const sub = (a: number) => (b: number) => b - a

export function parseDateInput(input: string) {
  const tokens = getTokens(input);
  return parseTokens(tokens);
}

function getTokens(input: string) {
  return input.split(" ");
}
