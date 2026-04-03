import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from "atomic-router"
export const routes = {
  home: createRoute(),
  home2: createRoute(),
  inbox: createRoute(),
  upcoming: createRoute(),
  calendar: createRoute(),
  unplaced: createRoute(),
  trash: createRoute(),
  notifications: createRoute(),
  project: createRoute<{ projectId: string }>(),
  list: createRoute<{ projectId: string; listId: string }>(),
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
      route: [routes.home2],
      path: "/home",
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
    {
      route: [routes.notifications],
      path: "/notifications",
    },
    {
      route: [routes.project],
      path: "/project/:projectId",
    },
    {
      route: [routes.list],
      path: "/project/:projectId/list/:listId",
    },
  ],
  notFoundRoute: routes.notFoundRoute,
})
