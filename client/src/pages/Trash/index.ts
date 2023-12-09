import { lazy } from "react"

import { routes } from "@/shared/routing/router"

const Trash = lazy(() => import("./trash.page"))

export const TrashRoute = {
  view: Trash,
  route: routes.trash,
}
