import dayjs from "dayjs"
import { createEvent, createStore, sample } from "effector"
import { and, not } from "patronum"

import { removeTaskFactory } from "@/features/manage-task/model/delete"
import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"

import { $$task, Task } from "@/entities/task/task-item"

import { createModal } from "@/shared/lib/modal"
import { bridge } from "@/shared/lib/effector/bridge"

export const $$deleteTask = removeTaskFactory()

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})

export const $$moreTasksModal = createModal({})

export const taskFormModalOpened = createEvent()
export const taskFormModalClosed = createEvent()
export const $isTaskFormModalOpened = createStore(false)
  .on(taskFormModalOpened, () => true)
  .on(taskFormModalClosed, () => false)

export const $mappedTasks = $$task.$taskKv.map((tasks) => {
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
export const $updatedTask = createStore<string | null>(null)
export const $createdTask = createStore(false)

export const createTaskModalOpened = createEvent<Date>()
export const updateTaskModalOpened = createEvent<string>()

bridge(() => {
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
    target: [$$updateTask.setFieldsTriggeredById, $updatedTask],
  })
  sample({
    clock: [updateTaskModalOpened, createTaskModalOpened],
    target: taskFormModalOpened,
  })
})

bridge(() => {
  sample({
    clock: saved,
    filter: and(
      not($$updateTask.$isAllowToSubmit),
      not($$createTask.$isAllowToSubmit),
    ),
    target: taskFormModalClosed,
  })
  sample({
    clock: saved,
    filter: $$createTask.$isAllowToSubmit,
    target: $$createTask.createTaskTriggered,
  })

  sample({
    clock: saved,
    source: {
      updatedTaskId: $updatedTask,
      canUpdate: $$updateTask.$isAllowToSubmit,
    },
    filter: ({ canUpdate, updatedTaskId }) =>
      canUpdate && Boolean(updatedTaskId),
    fn: ({ updatedTaskId }) => updatedTaskId!,
    target: $$updateTask.updateTaskTriggeredById,
  })
})

bridge(() => {
  sample({
    clock: [
      $$createTask.taskSuccessfullyCreated,
      $$updateTask.taskSuccessfullyUpdated,
      $$deleteTask.taskSuccessfullyDeleted,
      canceled,
    ],
    target: taskFormModalClosed,
  })
  //reset fields after modal is closed
  sample({
    clock: [taskFormModalClosed, canceled],
    filter: $createdTask,
    target: [$createdTask.reinit, $$createTask.resetFieldsTriggered],
  })
  sample({
    clock: [taskFormModalClosed, canceled],
    filter: and($updatedTask),
    target: [$updatedTask.reinit, $$updateTask.resetFieldsTriggered],
  })
})
