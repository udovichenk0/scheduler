import { lazy } from "react"

import { MainLayout } from "@/widgets/layouts/main/ui"
import { routes } from "@/shared/config/router/router"

const HomePage = lazy(() => import('./home.page'))
export const HomeRoute = {
	view: HomePage,
	route: routes.home,
	layout: MainLayout
}
