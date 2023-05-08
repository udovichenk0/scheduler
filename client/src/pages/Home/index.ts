import { routes } from "@/shared/config/router/router"
import { lazy } from "react"

const HomePage = lazy(() => import('./home.page'))
export const HomeRoute = {
	view: HomePage,
	route: routes.home
}
