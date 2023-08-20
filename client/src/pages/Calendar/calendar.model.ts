import dayjs from "dayjs"
import { createEvent, sample } from "effector"
import { and, not } from "patronum"

import { updateTaskFactory } from "@/features/task/update"
import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"

import { $taskKv, Task } from "@/entities/task/tasks"

import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"
import { createModal } from "@/shared/lib/modal"
export const $$taskDisclosure = createTaskDisclosure()
export const $$deleteTask = createRemoveTaskFactory()
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
export const canceled = createEvent()
export const saved = createEvent()
sample({
  clock: $$taskDisclosure.createTaskToggled,
  fn: ({ date }) => date,
  target: $$createTask.$startDate,
})

sample({
  clock: canceled,
  target: [
    $$createTask.resetFieldsTriggered,
    $$updateTask.resetFieldsTriggered, 
    $$taskDisclosure.closeTaskTriggered, 
    $$modal.toggleTriggered
  ]
})
sample({
  clock: [saved, $$deleteTask.taskSuccessfullyDeleted],
  target: [$$taskDisclosure.closeTaskTriggered],
})
export const createTaskModalOpened = createEvent<Date>()
export const updateTaskModalOpened = createEvent<Task>()
sample({
  clock: [$$createTask.taskSuccessfullyCreated, $$updateTask.taskSuccessfullyUpdated],
  target: $$modal.toggleTriggered
})
sample({
  clock: $$deleteTask.taskSuccessfullyDeleted,
  target: [$$taskDisclosure.closeTaskTriggered, $$modal.toggleTriggered]
})
sample({
  clock: saved,
  filter: and(not($$updateTask.$isAllowToSubmit), not($$createTask.$isAllowToSubmit)),
  target: $$modal.toggleTriggered
})

sample({
  clock: createTaskModalOpened,
  fn: (date) => ({ date }),
  target: [$$modal.toggleTriggered, $$taskDisclosure.createTaskToggled],
})
sample({
  clock: [updateTaskModalOpened],
  target: [$$modal.toggleTriggered, $$taskDisclosure.updateTaskOpened],
})
