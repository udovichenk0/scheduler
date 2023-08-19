import dayjs from "dayjs"
import { createEvent, sample } from "effector"

import { updateTaskFactory } from "@/features/task/update"
import { createTaskFactory } from "@/features/task/create"

import { $taskKv, Task } from "@/entities/task/tasks"

import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"
import { createModal } from "@/shared/lib/modal"
export const $$taskDisclosure = createTaskDisclosure()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskDisclosure })
export const $$createTask = createTaskFactory({
  taskModel: $$taskDisclosure,
  defaultDate: new Date(),
  defaultType: "unplaced",
})
export const $$modal = createModal({ closeOnClickOutside: true })
export const $mappedTasks = $taskKv.map((tasks) => {
  return Object.values(tasks).reduce(
    (acc, task) => {
      const date = dayjs(task.start_date).format("YYYY-MM-DD")
      if (!task.start_date) {
        return acc
      }
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)
      return acc
    },
    [] as unknown as Record<string, Task[]>,
  )
})
sample({
  clock: $$taskDisclosure.createTaskToggled,
  fn: ({ date }) => date,
  target: $$createTask.$startDate,
})
sample({
  clock: $$modal.$isOpened,
  filter: (isOpened) => !isOpened,
  target: $$taskDisclosure.closeTaskTriggered,
})

export const createTaskModalOpened = createEvent<Date>()
export const updateTaskModalOpened = createEvent<Task>()
sample({
  clock: createTaskModalOpened,
  fn: (date) => ({ date }),
  target: [$$modal.toggleTriggered, $$taskDisclosure.createTaskToggled],
})
sample({
  clock: updateTaskModalOpened,
  target: [$$modal.toggleTriggered, $$taskDisclosure.updateTaskOpened],
})