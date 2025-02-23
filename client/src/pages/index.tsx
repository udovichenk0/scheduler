import { createRoutesView } from "atomic-router-react"

import { lazy } from "react"
const Unplaced = lazy(() => import("./Unplaced/unplaced.page"))
const Inbox = lazy(() => import("./Inbox/inbox.page"))
const Home = lazy(() => import("./Today/today.page"))
const Trash = lazy(() => import("./Trash/trash.page"))
const Calendar = lazy(() => import("./Calendar/calendar.page"))
const Upcoming = lazy(() => import("./Upcoming/upcoming.page"))
import { routes } from "@/shared/routing"
import { NotFoundPage } from "./404/404.page"

const pageRoutes = [
  {view: Home, route: routes.home},
  {view: Inbox, route: routes.inbox},
  {view: Upcoming, route: routes.upcoming},
  {view: Unplaced, route: routes.unplaced},
  {view: Calendar, route: routes.calendar},
  {view: Trash, route: routes.trash},
]

export const RoutesView = createRoutesView({
  routes: pageRoutes,
  otherwise() {
    return <NotFoundPage/>
  },
})
