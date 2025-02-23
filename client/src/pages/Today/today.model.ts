import { createEvent, createStore, sample, combine } from "effector"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { createSorting, getTaskModelInstance, modifyTaskFactory } from "@/entities/task"
import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { getToday, isToday } from "@/shared/lib/date"

import { isBeforeToday } from "./../../shared/lib/date/comparison"
import { createGate } from "effector-react"
import { boolStr } from "@/shared/lib/validation"

export const gate = createGate()

export const $$taskModel = getTaskModelInstance()

export const $$trashTask = trashTaskFactory({taskModel: $$taskModel})
export const $$updateTask = updateTaskFactory({taskModel: $$taskModel})
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday()
  }),
  taskModel: $$taskModel
})

export const $$sort = createSorting()

const $commonTasks = combine($$taskModel.$tasks, $$taskModel.$isCompletedShown, (tasks, isCompletedShown) => {
  return tasks?.filter((task) => isUnplaced(task) && !task.is_trashed && shouldShowCompleted(isCompletedShown, task)) || []
})

export const $todayTasks = combine($commonTasks, $$sort.$sortType, (tasks, sortType) => {
  const todayTasks = tasks?.filter((task) => isToday(task.start_date)) || []
  return $$sort.sortBy(sortType, todayTasks)
})

export const $overdueTasks = combine($commonTasks, $$sort.$sortType, (tasks, sortType) => {
  const overdueTasks = tasks?.filter((task) => isBeforeToday(task.start_date)) || []
  return $$sort.sortBy(sortType, overdueTasks)
})

export const $isOverdueTasksOpened = createStore(false)
export const toggleOverdueTasksOpened = createEvent()

sample({
  clock: toggleOverdueTasksOpened,
  source: $isOverdueTasksOpened,
  fn: (isOpened) => !isOpened,
  target: $isOverdueTasksOpened,
})

const init = cookiePersist({
  source: $isOverdueTasksOpened,
  name: "overdueTasksOpened",
  schema: boolStr,
})

sample({
  clock: gate.open,
  target: init
})