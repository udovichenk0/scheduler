import { routes } from "@/shared/routing"
import { lazy } from "react"


const Today = lazy(() => import("./today.page"))

export const HomeRoute = {
  view: Today,
  route: routes.home,
}
