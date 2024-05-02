import dayjs from "dayjs"
import { createEvent, createStore, sample } from "effector"
import { and, not } from "patronum"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { modifyTaskFactory } from "@/entities/task/task-form"
import { taskFactory, Task } from "@/entities/task/task-item"
import { isUnplaced } from "@/entities/task/task-item/lib"

import { createModal } from "@/shared/lib/modal"
import { bridge } from "@/shared/lib/effector/bridge"
import { taskApi } from "@/shared/api/task"
import { routes } from "@/shared/routing"
import { getToday } from "@/shared/lib/date"

export const calendarRoute = routes.calendar

export const $$dateModal = createModal({})

export const $$trashTask = trashTaskFactory()

const $unplacedTasks = taskFactory({
  filter: isUnplaced,
  route: calendarRoute,
  api: {
    taskQuery: taskApi.unplacedTasksQuery,
    taskStorage: taskApi.unplacedTasksLs,
  },
})

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
})

export const $$moreTasksModal = createModal({})

export const taskFormModalOpened = createEvent()
export const taskFormModalClosed = createEvent()
export const $isTaskFormModalOpened = createStore(false)
  .on(taskFormModalOpened, () => true)
  .on(taskFormModalClosed, () => false)

export const $mappedTasks = $unplacedTasks.$tasks.map((tasks) => {
  if (!tasks) return null
  return tasks.reduce(
    (acc, task) => {
      const date = dayjs(task.start_date).format("YYYY-MM-DD")
      if (!task.start_date || task.is_deleted) {
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
    target: [$$updateTask.setFieldsTriggered, $updatedTask],
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
      $$trashTask.taskSuccessfullyDeleted,
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
