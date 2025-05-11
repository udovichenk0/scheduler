import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from "atomic-router"
export const routes = {
  home: createRoute(),
  inbox: createRoute(),
  upcoming: createRoute(),
  calendar: createRoute(),
  unplaced: createRoute(),
  trash: createRoute(),
  notFoundRoute: createRoute(),
}
const controls = createRouterControls()
export const router = createHistoryRouter({
  base: "/:lang?",
  controls,
  routes: [
    {
      route: [routes.home],
      path: "/",
    },
    {
      route: [routes.inbox],
      path: "/inbox",
    },
    {
      route: [routes.upcoming],
      path: "/upcoming",
    },
    {
      route: [routes.calendar],
      path: "/calendar",
    },
    {
      route: [routes.unplaced],
      path: "/unplaced",
    },
    {
      route: [routes.trash],
      path: "/trash",
    },
  ],
  notFoundRoute: routes.notFoundRoute,
})
