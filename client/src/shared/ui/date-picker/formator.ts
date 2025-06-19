import { SDate, sdate } from "@/shared/lib/date/lib"

export function formatDate(date: SDate) {
  let formattedDate = ""
  if (date.isToday) {
    formattedDate = "Today"
  }
  if (date.isTomorrow) {
    formattedDate = "Tomorrow"
  }
  const diff = date.dayDiff(sdate())
  if (diff <= 6 && !formattedDate) {
    formattedDate = date.format("dddd")
  }

  if (!formattedDate) {
    formattedDate = date.format("MM/DD/YY")
  }

  const hasTime = date.hasTime
  if (hasTime) {
    const time = date.format("MM/DD/YY [at] hh:mm a").split(" at ")[1]
    return `${formattedDate} at ${time}`
  }

  return formattedDate
}
