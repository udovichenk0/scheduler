import { createRoutesView } from "atomic-router-react"
import { InboxRoute } from "./Inbox"
import { HomeRoute } from "./Today"
import { UnplacedRoute } from "./Unplaced"
import { UpcomingRoute } from "./Upcoming"

const routes = [HomeRoute, InboxRoute, UpcomingRoute, UnplacedRoute]

export const RoutesView = createRoutesView({ routes })
