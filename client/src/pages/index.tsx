import { createRoutesView } from "atomic-router-react"
import { lazy } from "react"

const Unplaced = lazy(() => import("./Unplaced/page"))
const Inbox = lazy(() => import("./Inbox/page"))
const Home = lazy(() => import("./Today/page"))
const Trash = lazy(() => import("./Trash/page"))
const Calendar = lazy(() => import("./Calendar/page"))
const Upcoming = lazy(() => import("./Upcoming/page"))
const Project = lazy(() => import("./Project/page"))
import { routes } from "@/shared/routing/router.ts"

import { NotFoundPage } from "./404/page"
import { projectRoute } from "./Project/model"

const pageRoutes = [
  { view: Home, route: routes.home },
  { view: Inbox, route: routes.inbox },
  { view: Upcoming, route: routes.upcoming },
  { view: Unplaced, route: routes.unplaced },
  { view: Calendar, route: routes.calendar },
  { view: Project, route: projectRoute },
  { view: Trash, route: routes.trash },
]

export const RoutesView = createRoutesView({
  routes: pageRoutes,
  otherwise() {
    return <NotFoundPage />
  },
})
