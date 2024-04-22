import { lazy } from "react"

import { homeRoute } from "./today.model"

const Today = lazy(() => import("./today.page"))

export const HomeRoute = {
  view: Today,
  route: homeRoute,
}
