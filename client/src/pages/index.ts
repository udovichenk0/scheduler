import { createRoutesView } from "atomic-router-react"
import { InboxRoute } from "./Inbox"
import { HomeRoute } from "./Today"
import { UpcomingRoute } from "./Upcoming"

const routes = [HomeRoute, InboxRoute, UpcomingRoute]

export const RoutesView = createRoutesView({ routes })
