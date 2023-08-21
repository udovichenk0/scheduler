import dayjs from "dayjs"
import { createEvent, createStore, sample } from "effector"
import { and, not } from "patronum"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $taskKv, Task } from "@/entities/task/tasks"

import { createModal } from "@/shared/lib/modal"

export const $$deleteTask = createRemoveTaskFactory()

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
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
export const $updatedTask = createStore<{ id: string } | null>(null)
export const $createdTask = createStore(false)

export const createTaskModalOpened = createEvent<Date>()
export const updateTaskModalOpened = createEvent<Task>()
sample({
  clock: createTaskModalOpened,
  target: $$createTask.$startDate,
})
sample({
  clock: createTaskModalOpened,
  fn: () => true,
  target: $createdTask,
})

sample({
  clock: updateTaskModalOpened,
  target: [$$updateTask.setFieldsTriggered, $updatedTask],
})

sample({
  clock: [
    updateTaskModalOpened,
    createTaskModalOpened,
    canceled,
    $$createTask.taskSuccessfullyCreated,
    $$updateTask.taskSuccessfullyUpdated,
    $$deleteTask.taskSuccessfullyDeleted,
  ],
  target: $$modal.toggleTriggered,
})

sample({
  clock: saved,
  filter: and(
    not($$updateTask.$isAllowToSubmit),
    not($$createTask.$isAllowToSubmit),
  ),
  target: $$modal.toggleTriggered,
})
sample({
  clock: saved,
  filter: $$createTask.$isAllowToSubmit,
  target: $$createTask.createTaskTriggered,
})

type P = {
  updatedTask: { id: string } | null
  canUpdate: boolean
}
type P1 = {
  updatedTask: { id: string }
  canUpdate: boolean
}
sample({
  clock: saved,
  source: {
    updatedTask: $updatedTask,
    canUpdate: $$updateTask.$isAllowToSubmit,
  },
  filter: (payload: P): payload is P1 =>
    payload.canUpdate && Boolean(payload.updatedTask),
  fn: ({ updatedTask }) => ({ id: updatedTask.id }),
  target: $$updateTask.updateTaskTriggered,
})

//reset fields after modal is closed
sample({
  clock: [$$modal.$isOpened, canceled],
  filter: and(not($$modal.$isOpened), $createdTask),
  target: [$createdTask.reinit, $$createTask.resetFieldsTriggered],
})
sample({
  clock: [$$modal.$isOpened, canceled],
  filter: and(not($$modal.$isOpened), $updatedTask),
  target: [$updatedTask.reinit, $$updateTask.resetFieldsTriggered],
})
