import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"

import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"

import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"
import { cookiePersist } from "@/shared/lib/cookie-persist"

export const $$taskDisclosure = createTaskDisclosure()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskDisclosure })
export const $$createTask = createTaskFactory({
  taskModel: $$taskDisclosure,
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$deleteTask = createRemoveTaskFactory()

export const $overdueTasks = combine($taskKv, (kv) => {
  return Object.values(kv).filter(
    ({ start_date }) =>
      start_date && dayjs(start_date).isBefore(dayjs(), "date"),
  )
})

export const $todayTasks = $taskKv.map((kv) => {
  return Object.values(kv).filter(({ start_date }) =>
    dayjs(start_date).isSame(dayjs(), "day"),
  )
})
export const $isOverdueTasksOpened = createStore(false)
export const toggleOverdueTasksOpened = createEvent()

sample({
  clock: toggleOverdueTasksOpened,
  source: $isOverdueTasksOpened,
  fn: (isOpened) => !isOpened,
  target: $isOverdueTasksOpened,
})
cookiePersist({
  source: $isOverdueTasksOpened,
  name: "overdueTasksOpened",
})
