import { lazy } from "react"

import { unplacedRoute } from "./unplaced.model"

const Unplaced = lazy(() => import("./unplaced.page"))

export const UnplacedRoute = {
  view: Unplaced,
  route: unplacedRoute,
}
