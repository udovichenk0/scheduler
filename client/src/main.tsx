import { extend } from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import { fork, sample, allSettled } from "effector"
import { createRoot } from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import { RouterProvider } from "atomic-router-react"
import { Provider } from "effector-react"

import App from "./app/App"
import "./app/index.css"
import { tokenApi } from "./shared/api/token"
import { appInitializer } from "./app/initializer"
import { taskApi } from "./shared/api/task"
import { router } from "./shared/routing"
import { $$i18n } from "./shared/i18n"

extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)

const { init } = appInitializer()
sample({
  clock: init,
  target: tokenApi.refreshQuery.start,
})

sample({
  clock: tokenApi.refreshQuery.finished.failure,
  target: taskApi.getTasksFromLocalStorageFx,
})
sample({
  clock: tokenApi.refreshQuery.finished.success,
  target: taskApi.getTasks.start,
})

const scope = fork()
await allSettled(init, { scope })
createRoot(document.getElementById("root") as HTMLElement).render(
  <I18nextProvider i18n={$$i18n.i18n}>
    <RouterProvider router={router}>
      <Provider value={scope}>
        <App />
      </Provider>
    </RouterProvider>
  </I18nextProvider>,
)
