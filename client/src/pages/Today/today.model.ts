import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"
import { persist } from "effector-storage/local"

import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"

import { createTaskAccordionFactory } from "@/shared/lib/task-accordion-factory"

export const $$taskAccordion = createTaskAccordionFactory()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskAccordion })
export const $$createTask = createTaskFactory({
  taskModel: $$taskAccordion,
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

persist({
  store: $isOverdueTasksOpened,
  key: "overdueTasksState",
})
