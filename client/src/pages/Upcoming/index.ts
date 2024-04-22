import { lazy } from "react"

// import { upcomingRoute } from "./upcoming.model"
// import { routes } from "@/shared/routing"
import { upcomingRoute } from "./upcoming.model"

const Upcoming = lazy(() => import("./upcoming.page"))

export const UpcomingRoute = {
  route: upcomingRoute,
  view: Upcoming,
}
