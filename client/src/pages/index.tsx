import { createRoutesView } from "atomic-router-react"
import { lazy } from "react"

const Unplaced = lazy(() => import("./Unplaced/page"))
const Inbox = lazy(() => import("./Inbox/page"))
const Home = lazy(() => import("./Today/page"))
const Home2 = lazy(() => import("./Home/page"))
const Trash = lazy(() => import("./Trash/page"))
const Calendar = lazy(() => import("./Calendar/page"))
const Upcoming = lazy(() => import("./Upcoming/page"))
// const Notifications = lazy(() => import("./Notifications/page"))
const Project = lazy(() => import("./Project/page"))
const List = lazy(() => import("./List/page"))
import { routes } from "@/shared/routing/router.ts"

import { NotFoundPage } from "./404/page"
import { projectRoute } from "./Project/model"
import { homeroute } from "./Home/model"
import { listRoute } from "./List/model"

const pageRoutes = [
  { view: Home, route: routes.home },
  { view: Home2, route: homeroute },
  { view: Home, route: routes.home },
  { view: Inbox, route: routes.inbox },
  { view: Upcoming, route: routes.upcoming },
  { view: Unplaced, route: routes.unplaced },
  { view: Calendar, route: routes.calendar },
  // { view: Notifications, route: routes.notifications },
  { view: Project, route: projectRoute },
  { view: List, route: listRoute },
  { view: Trash, route: routes.trash },
]

export const RoutesView = createRoutesView({
  routes: pageRoutes,
  otherwise() {
    return <NotFoundPage />
  },
})
