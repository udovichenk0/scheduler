import { combine, createEvent, sample, createStore } from "effector"
import dayjs, { Dayjs } from "dayjs"
import { createContext } from "react"

import { createTaskFactory } from "@/features/manage-task/create"
import { updateTaskFactory } from "@/features/manage-task/update"
import { trashTaskFactory } from "@/features/manage-task/trash"

import { Task, createSorting, getTaskModelInstance, modifyTaskFactory } from "@/entities/task"
import { isUnplaced, shouldShowCompleted } from "@/entities/task/lib"

import { routes } from "@/shared/routing"
import { getToday } from "@/shared/lib/date"

import {
  getTasksPerDate,
  getTasksForRemainingMonth,
  getTasksPerMonth,
  getTasksForRemainingYear,
  getTasksPerYear,
} from "./lib"

type Variant = "upcoming" | Dayjs

export const upcomingRoute = routes.upcoming

export const $$sort = createSorting()

export const $$taskModel = getTaskModelInstance()

export const $upcomingTasks = combine($$taskModel.$tasks, $$taskModel.$isCompletedShown, (tasks, isCompletedShown) => {
  return tasks?.filter((task) => isUnplaced(task) && !task.is_trashed && shouldShowCompleted(isCompletedShown, task)) || []
})

export const $$updateTask = updateTaskFactory({taskModel: $$taskModel})
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
  taskModel: $$taskModel
})

export const $$trashTask = trashTaskFactory({taskModel: $$taskModel})

export const TaskManagerContext = createContext({
  $$updateTask,
  $$createTask,
})

export const $selectedDate = createStore<Date>(getToday())
export const currentDateSelected = createEvent<Date>()

export const variantSelected = createEvent<Variant>()
export const $variant = createStore<Variant>("upcoming").on(
  variantSelected,
  (_, variant) => variant,
)

export const $tasks = combine(
  $upcomingTasks,
  $variant,
  (tasks, variant) => {
    if (variant == "upcoming" && tasks) {
      const tasksPerDate = getTasksPerDate(tasks)
      const tasksForRemainingMonth = getTasksForRemainingMonth(tasks)
      const tasksPerMonth = getTasksPerMonth(tasks)
      const tasksForRemainingYear = getTasksForRemainingYear(tasks)
      const tasksPerYear = getTasksPerYear(tasks)
      return tasksPerDate.concat(
        tasksForRemainingMonth,
        tasksPerMonth,
        tasksForRemainingYear,
        tasksPerYear,
      )
    }
    return []
  },
)

export const $tasksByDate = combine(
  $upcomingTasks,
  $variant,
  (tasks, variant) => {
    if (variant != "upcoming" && tasks) {
      return tasks.filter(({ start_date }) => {
        return dayjs(start_date).startOf("date").isSame(variant.startOf("date"))
      })
    }
    return []
  },
)

export const $tasksByDateKv = combine($upcomingTasks, (tasks) => {
  if (!tasks) return null
  return tasks.reduce((acc: Record<string, Task[]>, item) => {
    const date = dayjs(item.start_date).format("YYYY-MM-DD")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {})
})

sample({
  clock: currentDateSelected,
  target: $selectedDate,
})

sample({
  clock: variantSelected,
  fn: (variant) => {
    if (variant == "upcoming") {
      return dayjs(new Date()).startOf("date").toDate()
    }
    return variant.toDate()
  },
  target: $selectedDate,
})
