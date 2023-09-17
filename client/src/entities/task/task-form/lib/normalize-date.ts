import dayjs from "dayjs"
import { t } from "i18next"

import { LONG_MONTHS_NAMES } from "@/shared/config/constants"

export function formatTaskDate(date: Date) {
  if (dayjs(date).isSame(dayjs(), "day")) {
    return t("date.today")
  } else if (dayjs(date).isTomorrow()) {
    return t("date.tomorrow")
  } else if (dayjs(date).isSame(dayjs(), "year")) {
    return `${t(LONG_MONTHS_NAMES[dayjs(date).month()])} ${dayjs(date).date()}`
  } else {
    return `${t(LONG_MONTHS_NAMES[dayjs(date).month()])} ${dayjs(
      date,
    ).date()} ${dayjs(date).year()}`
  }
}
