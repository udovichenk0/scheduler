import dayjs, { Dayjs } from "dayjs";

export type SectionRow = {
    date: number;
    month: number;
    year: number;
}[];
type CalendarSections = {
  date: Dayjs,
  rows: SectionRow[]
}[]
export const generateCalendar = (date: Dayjs = dayjs()) => {
  const result: CalendarSections = []
  for(let i = 0; i < 5; i++){
    const newDate = date.startOf('month').add(i, 'month')
    const day = newDate.day()
    const startOfTheDate = newDate.add(-day, 'day')
    const endOfTheDate = newDate.endOf('month')
    let row: SectionRow = []
    let rows: SectionRow[] = []

    //           all dates of month + days from the prev month that are on the same row
    const sectionsDatesLength = endOfTheDate.date() + day
    for(let k = 0; k < sectionsDatesLength; k++){
      const d = startOfTheDate.add(k, 'day')
      const ddate = d.date()
      const month = d.month()
      const year = d.year()
      row.push({date: ddate,month,year})
      if(row.length == 7){
        if(row[row.length-1].date > 24){
          rows.push(row)
          row = []
          break;
        }
        rows.push(row)
        row = []
      }
    }
    result.push({
      date: newDate,
      rows: rows
    })
    rows = []
  }
  return result
}

export const sum = (a: number) => (b: number) => a + b
export const sub = (a: number) => (b: number) => b - a