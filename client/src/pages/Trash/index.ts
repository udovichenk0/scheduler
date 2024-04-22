import { lazy } from "react"

import { trashRoute } from "./trash.model"

const Trash = lazy(() => import("./trash.page"))

export const TrashRoute = {
  view: Trash,
  route: trashRoute,
}
