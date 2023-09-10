import dayjs from "dayjs"

import { LONG_MONTHS_NAMES } from "@/shared/config/constants"

export function formatTaskDate(date: Date) {
  if (dayjs(date).isSame(dayjs(), "day")) {
    return "Today"
  } else if (dayjs(date).isTomorrow()) {
    return "Tomorrow"
  } else if (dayjs(date).isSame(dayjs(), "year")) {
    return `${LONG_MONTHS_NAMES[dayjs(date).month()]} ${dayjs(date).date()}`
  } else {
    return `${LONG_MONTHS_NAMES[dayjs(date).month()]} ${dayjs(
      date,
    ).date()} ${dayjs(date).year()}`
  }
}
