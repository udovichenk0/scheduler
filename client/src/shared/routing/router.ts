import { createHistoryRouter, createRoute } from "atomic-router"
export const routes = {
  home: createRoute(),
  inbox: createRoute(),
  upcoming: createRoute(),
  calendar: createRoute(),
  unplaced: createRoute(),
}
export const router = createHistoryRouter({
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
  ],
})
