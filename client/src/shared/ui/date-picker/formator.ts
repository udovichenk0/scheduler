import dayjs, { Dayjs } from "dayjs"

import { hasTimePart } from "@/shared/lib/date/has-time-part"

export function formatDate(date: Dayjs) {
  const hasTime = hasTimePart(date)
  if (date.isToday()) {
    if(hasTime){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `Today at ${time}`
    }
    return "Today"
  }
  if (date.isTomorrow()) {
    if(hasTime){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `Tomorrow at ${time}`
    }
    return "Tomorrow"
  }
  if (dayjs().endOf("w").isSame(date, "w")) {
    if(hasTime){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `${date.format("dddd")} at ${time}`
    }
    return date.format("dddd")
  }

  if(hasTime){
    const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
    return `${date.format("MM/DD/YY")} at ${time}`
  }
  return date.format("MM/DD/YY")
}
