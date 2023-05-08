import {createHistoryRouter, createRoute} from "atomic-router";
import {createBrowserHistory} from "history";
import {appStarted} from "../init";
import {sample} from "effector";
export const routes = {
    home: createRoute()
}
export const router = createHistoryRouter({
    routes: [
        {
            route: [routes.home],
            path: '/'
        }
    ]
})
sample({
    clock: appStarted,
    fn: () => createBrowserHistory(),
    target: router.setHistory
})
