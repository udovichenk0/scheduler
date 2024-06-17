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
import { authApi } from "./shared/api/auth"
import { $unplacedTasks } from "./pages/Unplaced/unplaced.model"
import { $trashTasks } from "./pages/Trash/trash.model"
import { $inboxTasks } from "./pages/Inbox/inbox.model"
import { $todayTasks } from "./pages/Today/today.model"
import { $upcomingTasks } from "./pages/Upcoming/upcoming.model"
import { LocalStorageTaskDto } from "./shared/api/task/task.dto"

const { init } = appInitializer()
sample({
  clock: init,
  target: tokenApi.refreshQuery.start,
})

sample({
  clock: [
    authApi.signinQuery.finished.success,
    authApi.verifyQuery.finished.success,
  ],
  source: [
    $unplacedTasks.$tasks,
    $trashTasks.$tasks,
    $inboxTasks.$tasks,
    $todayTasks.$tasks,
    $upcomingTasks.$tasks,
  ],
  fn: (tasks) =>
    findUnique(tasks.filter(Boolean).flat() as LocalStorageTaskDto[]),
  target: taskApi.createTasksMutation.start,
})

function findUnique(tasks: LocalStorageTaskDto[]) {
  const result = tasks.reduce((tasks, task) => {
    if (!tasks[task.id]) {
      return { ...tasks, [task.id]: task }
    }
    return tasks
  }, {} as any)
  return Object.values(result) as LocalStorageTaskDto[]
}

const scope = fork()
allSettled(init, { scope })
createRoot(document.getElementById("root") as HTMLElement).render(
  <I18nextProvider i18n={$$i18n.i18n}>
    <RouterProvider router={router}>
      <Provider value={scope}>
        <App />
      </Provider>
    </RouterProvider>
  </I18nextProvider>,
)
