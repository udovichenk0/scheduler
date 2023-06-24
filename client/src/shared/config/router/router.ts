import {createHistoryRouter, createRoute} from "atomic-router";
import {sample} from "effector";
import {createBrowserHistory} from "history";

import {appStarted} from "../init";
export const routes = {
  home: createRoute(),
  inbox: createRoute(),
  upcoming: createRoute(),
  calendar: createRoute()
}
export const router = createHistoryRouter({
  routes: [
    {
      route: [routes.home],
      path: '/'
    },
    {
      route: [routes.inbox],
      path: '/inbox'
    },
    {
      route: [routes.upcoming],
      path: '/upcoming'
    },
    {
      route: [routes.calendar],
      path: '/calendar'
    }
  ]
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory
})
