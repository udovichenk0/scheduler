import { lazy } from "react"

import { inboxRoute } from "./inbox.model"

const Inbox = lazy(() => import("./inbox.page"))
export const InboxRoute = {
  view: Inbox,
  route: inboxRoute,
}
