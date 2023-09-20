import { lazy } from "react"

import { routes } from "@/shared/routing"

const Unplaced = lazy(() => import("./unplaced.page"))

export const UnplacedRoute = {
  view: Unplaced,
  route: routes.unplaced,
}
