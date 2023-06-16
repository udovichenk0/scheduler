import { MainLayout } from "@/widgets/layouts/main/ui"
import { routes } from "@/shared/config/router/router"
import { Home } from "./home.page"

export const HomeRoute = {
  view: Home,
  route: routes.home,
  layout: MainLayout
}
