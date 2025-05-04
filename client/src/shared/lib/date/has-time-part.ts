import { Dayjs } from "dayjs"

export function hasTimePart(date: Dayjs){
  const hour = date.hour()
  const minute = date.minute()

  return !!hour || !!minute
}