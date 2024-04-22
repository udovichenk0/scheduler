import { lazy } from "react"

import { calendarRoute } from "./calendar.model"

const Calendar = lazy(() => import("./calendar.page"))
export const CalendarRoute = {
  view: Calendar,
  route: calendarRoute,
}
