import dayjs, { Dayjs } from "dayjs"

export const removeTimePart = (date: Dayjs | Date) => {
  if(!date) return dayjs()
  if(date instanceof Date) return dayjs(date).startOf("date")
  return date.startOf("date")
}