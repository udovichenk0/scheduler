import { lazy } from "react"

import { routes } from "@/shared/config/router/router"
import { MainLayout } from "@/widgets/layouts/main/ui"

const HomePage = lazy(() => import('./home.page'))
export const HomeRoute = {
	view: HomePage,
	route: routes.home,
	layout: MainLayout
}
