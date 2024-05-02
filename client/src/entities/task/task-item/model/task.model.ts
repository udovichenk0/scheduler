import { Effect, createEvent, createStore, sample } from "effector"
import { and, not } from "patronum"
import { Query } from "@farfetched/core"
import { RouteInstance } from "node_modules/atomic-router/dist/atomic-router"

import { $$session } from "@/entities/session"

import { prepend } from "@/shared/lib/effector"
import { TaskId, taskApi } from "@/shared/api/task"
import { authApi } from "@/shared/api/auth"
import { tokenApi } from "@/shared/api/token"

import { Task } from "../type"
import { deleteById, findTaskById, tasksNotNull } from "../lib"

import { CreateSorting } from "./sorting.model"

type ApiQuery = Query<void, (Task & { user_id: string })[], unknown>
type ApiStorage = Effect<void, { result: (Task & { user_id: null })[] }>

export const taskFactory = ({
  sortModel,
  filter,
  route,
  api,
}: {
  sortModel?: CreateSorting
  filter: (task: Task) => boolean
  route: RouteInstance<{}>
  api: {
    taskQuery: ApiQuery
    taskStorage: ApiStorage
  }
}) => {
  const $tasks = createStore<Nullable<Task[]>>(null)
  const $isInited = createStore(false)

  const addTaskTriggered = createEvent<Task>()
  const setTasksTriggered = createEvent<Task[]>()
  const taskDeleted = createEvent<TaskId>()
  const reset = createEvent()

  sample({
    clock: addTaskTriggered,
    source: $tasks,
    filter: tasksNotNull,
    fn: (oldTasks, newTask) => [...oldTasks, newTask],
    target: $tasks,
  })

  sample({
    clock: taskDeleted,
    source: $tasks,
    filter: tasksNotNull,
    fn: deleteById,
    target: $tasks,
  })
  sample({
    clock: [
      taskApi.createTaskMutation.finished.success,
      taskApi.createTaskLs.doneData,
    ],
    filter: ({ result }) => filter(result),
    fn: ({ result }) => result,
    target: addTaskTriggered,
  })

  sample({
    clock: [api.taskQuery.finished.success, api.taskStorage.doneData],
    fn: ({ result }) => result,
    target: [$tasks, prepend($isInited, true)],
  })
  sample({
    clock: [
      taskApi.updateStatusMutation.finished.success,
      taskApi.updateTaskMutation.finished.success,
      taskApi.updateDateMutation.finished.success,
      taskApi.updateDateLs.doneData,
      taskApi.updateStatusLs.doneData,
      taskApi.updateTaskLs.doneData,
    ],
    source: $tasks,
    filter: (tasks, { result }) => tasksNotNull(tasks) && filter(result),
    fn: (tasks, { result }) => {
      if (findTaskById(tasks!, result.id)) {
        return tasks!.map((task) => (task.id == result.id ? result : task))
      }
      return [...tasks!, result]
    },
    target: setTasksTriggered,
  })

  sample({
    clock: [
      taskApi.updateStatusMutation.finished.success,
      taskApi.updateTaskMutation.finished.success,
      taskApi.updateDateMutation.finished.success,
      taskApi.updateDateLs.doneData,
      taskApi.updateStatusLs.doneData,
      taskApi.updateTaskLs.doneData,
    ],
    filter: ({ result }) => !filter(result),
    fn: ({ result }) => result.id,
    target: taskDeleted,
  })

  sample({
    clock: [
      taskApi.trashTaskMutation.finished.success,
      taskApi.trashTaskLs.doneData,
    ],
    filter: ({ result }) => filter(result),
    fn: ({ result }) => result.id,
    target: taskDeleted,
  })

  sample({
    clock: taskApi.createTasksMutation.finished.success,
    filter: route.$isOpened,
    target: api.taskQuery.start,
  })
  sample({
    clock: setTasksTriggered,
    target: $tasks,
  })
  sample({
    clock: authApi.logoutQuery.finished.success,
    fn: () => [],
    target: $tasks,
  })

  if (sortModel) {
    sample({
      clock: [addTaskTriggered, setTasksTriggered, sortModel.$sortType],
      source: {
        tasks: $tasks,
        sortType: sortModel.$sortType,
      },
      filter: ({ tasks }) => !!tasks,
      fn: ({ tasks, sortType }) => sortModel.sortBy(sortType, tasks),
      target: $tasks,
    })
  }

  sample({
    clock: [route.opened, $$session.$isAuthenticated],
    filter: and(not($isInited), $$session.$isAuthenticated, route.$isOpened),
    target: api.taskQuery.start,
  })

  sample({
    clock: [route.opened, tokenApi.refreshQuery.finished.failure],
    filter: and(
      not($isInited),
      not($$session.$isAuthenticated),
      tokenApi.refreshQuery.$finished,
      route.$isOpened,
    ),
    target: api.taskStorage,
  })

  return {
    $tasks,
    $isInited,
    addTaskTriggered,
    setTasksTriggered,
    taskDeleted,
    reset,
  }
}

export type TaskFactory = ReturnType<typeof taskFactory>
