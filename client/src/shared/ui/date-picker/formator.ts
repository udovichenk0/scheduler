import dayjs, { Dayjs } from "dayjs"

export function formatDate(date: Dayjs) {
  const isStart = isStartOfDate(date)
  if (date.isToday()) {
    if(!isStart){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `Today at ${time}`
    }
    return "Today"
  }
  if (date.isTomorrow()) {
    if(!isStart){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `Tomorrow at ${time}`
    }
    return "Tomorrow"
  }
  if (dayjs().endOf("w").isSame(date, "w")) {
    if(!isStart){
      const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
      return `${date.format("dddd")} at ${time}`
    }
    return date.format("dddd")
  }

  if(!isStart){
    const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
    return `${date.format("MM/DD/YY")} at ${time}`
  }
  return date.format("MM/DD/YY")
}

function isStartOfDate(date: Dayjs){
  const hour = date.hour()
  const minute = date.minute()

  return !hour && !minute
}