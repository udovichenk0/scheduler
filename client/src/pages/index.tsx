import { createRoutesView } from "atomic-router-react"

import { InboxRoute } from "./Inbox"
import { HomeRoute } from "./Today"
import { UnplacedRoute } from "./Unplaced"
import { UpcomingRoute } from "./Upcoming"
import { CalendarRoute } from "./Calendar"
import { TrashRoute } from "./Trash"

const routes = [
  HomeRoute,
  InboxRoute,
  UpcomingRoute,
  UnplacedRoute,
  CalendarRoute,
  TrashRoute
]

export const RoutesView = createRoutesView({
  routes,
  otherwise() {
    return <div className="text-white">Page not found!</div>
  },
})
