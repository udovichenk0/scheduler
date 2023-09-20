import { lazy } from "react"

import { routes } from "@/shared/routing"

const Upcoming = lazy(() => import("./upcoming.page"))

export const UpcomingRoute = {
  route: routes.upcoming,
  view: Upcoming,
}
