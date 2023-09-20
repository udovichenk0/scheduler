import { lazy } from "react"

import { routes } from "@/shared/routing"

const Calendar = lazy(() => import("./calendar.page"))
export const CalendarRoute = {
  view: Calendar,
  route: routes.calendar,
}
