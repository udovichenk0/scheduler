import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"

import { cookiePersist } from "@/shared/lib/cookie-persist"
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
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
