import { createEvent, createStore, sample, combine } from "effector"
import { createGate } from "effector-react"
import * as z from "zod/mini"

import { createTaskCreator } from "@/features/manage-task/create"
import { createTaskUpdater } from "@/features/manage-task/update"
import { createTaskTrasher } from "@/features/manage-task/trash"

import { getTaskModelInstance } from "@/entities/task/model/task.model"
import { createSorting } from "@/entities/task/model/sorting.model"
import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { routes } from "@/shared/routing/router"

export const gate = createGate()

export const $$taskModel = getTaskModelInstance()

export const $$taskTrasher = createTaskTrasher({ taskModel: $$taskModel })
export const $$taskUpdater = createTaskUpdater({ taskModel: $$taskModel })
export const $$taskCreator = createTaskCreator({
  taskModel: $$taskModel,
})

export const $$sort = createSorting()

const $commonTasks = combine(
  $$taskModel.$tasks,
  $$taskModel.$isCompletedShown,
  routes.home.$isOpened,
  (tasks, isCompletedShown, isOpened) => {
    if (!isOpened) return []
    return (
      tasks?.filter(
        (task) =>
          isUnplaced(task) &&
          !task.is_trashed &&
          shouldShowCompleted(isCompletedShown, task),
      ) || []
    )
  },
)

export const $todayTasks = combine(
  $commonTasks,
  $$sort.$sortType,
  (tasks, sortType) => {
    const todayTasks = tasks?.filter((task) => task.start_date?.isToday) || []
    return $$sort.sortBy(sortType, todayTasks)
  },
)

export const $overdueTasks = combine(
  $commonTasks,
  $$sort.$sortType,
  (tasks, sortType) => {
    const overdueTasks =
      tasks?.filter((task) => task.due_date?.isBeforeToday) || []
    return $$sort.sortBy(sortType, overdueTasks)
  },
)

export const toggleOverdueTasksOpened = createEvent()
const $isOverdueTasksOpened = createStore(0).on(
  toggleOverdueTasksOpened,
  (isOpened) => Number(!isOpened),
)
export const $isOverdueExpanded = $isOverdueTasksOpened.map(Boolean)

const init = cookiePersist({
  source: $isOverdueTasksOpened,
  name: "overdueTasksOpened",
  schema: z.coerce.number(),
})

sample({
  clock: gate.open,
  target: init,
})
