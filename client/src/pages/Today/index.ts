import { lazy } from "react"

import { routes } from "@/shared/routing"

const Today = lazy(() => import("./today.page"))

export const HomeRoute = {
  view: Today,
  route: routes.home,
}
