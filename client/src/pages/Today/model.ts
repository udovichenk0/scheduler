import { createEvent, createStore, sample, combine } from "effector"
import { createGate } from "effector-react"
import * as z from "@zod/mini"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { modifyTaskFactory } from "@/entities/task/model/modify.model.ts"
import { getTaskModelInstance } from "@/entities/task/model/task.model"
import { createSorting } from "@/entities/task/model/sorting.model"
import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { getToday } from "@/shared/lib/date/get-date.ts"
import { isToday, isBeforeToday } from "@/shared/lib/date/comparison.ts"

export const gate = createGate()

export const $$taskModel = getTaskModelInstance()

export const $$trashTask = trashTaskFactory({ taskModel: $$taskModel })
export const $$updateTask = updateTaskFactory({ taskModel: $$taskModel })
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday().toDate(),
  }),
  taskModel: $$taskModel,
})

export const $$sort = createSorting()

const $commonTasks = combine(
  $$taskModel.$tasks,
  $$taskModel.$isCompletedShown,
  (tasks, isCompletedShown) => {
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
    const todayTasks = tasks?.filter((task) => isToday(task.start_date)) || []
    return $$sort.sortBy(sortType, todayTasks)
  },
)

export const $overdueTasks = combine(
  $commonTasks,
  $$sort.$sortType,
  (tasks, sortType) => {
    const overdueTasks =
      tasks?.filter((task) => isBeforeToday(task.start_date)) || []
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
