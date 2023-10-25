import dayjs from "dayjs"
import { createEvent, createStore, sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { removeTaskFactory } from "@/features/manage-task/model/delete"
import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"

import { $$task } from "@/entities/task/task-item"

import { cookiePersist } from "@/shared/lib/effector/cookie-persist"
import { selectTaskFactory } from "@/shared/lib/effector"
export const $$deleteTask = removeTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $overdueTasks = $$task.$taskKv.map((kv) => {
  return Object.values(kv).filter(
    ({ start_date }) =>
      start_date && dayjs(start_date).isBefore(dayjs(), "date"),
  )
})
export const $$selectTask = selectTaskFactory($overdueTasks)

export const $todayTasks = $$task.$taskKv.map((kv) => {
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

sample({
  clock: $$deleteTask.taskDeletedById,
  target: $$selectTask.nextTaskIdSelected,
})
