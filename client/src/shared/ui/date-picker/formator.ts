import dayjs, { Dayjs } from "dayjs"

import { hasTimePart } from "@/shared/lib/date/has-time-part"

export function formatDate(date: Dayjs) {
  let formattedDate: string = ""
  if (date.isToday()) {
    formattedDate = "Today"
  }
  if (date.isTomorrow()) {
    formattedDate = "Tomorrow"
  }
  if (dayjs().endOf("w").isSame(date, "w")) {
    formattedDate = date.format("dddd")
  }

  if(!formattedDate){
    formattedDate = date.format("MM/DD/YY")
  }

  const hasTime = hasTimePart(date)
  if(hasTime){
    const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
    return `${formattedDate} at ${time}`
  }
  return formattedDate
}
