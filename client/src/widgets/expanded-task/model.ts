import { createEvent, createStore, sample } from "effector"
import { spread, and, not, or } from "patronum"

import { CreateTaskType } from "@/features/task/create"
import { UpdateTaskType } from "@/features/task/update"

import { TaskKv } from "@/entities/task/tasks"

import { createModal } from "@/shared/lib/modal"

export const pomodoroModal = createModal({ closeOnClickOutside: true })
export const settingsModal = createModal({ closeOnClickOutside: true })

export const disclosureTask = ({
  updateTaskModel,
  createTaskModel,
  tasks,
}: {
  updateTaskModel: UpdateTaskType
  createTaskModel: CreateTaskType
  tasks: TaskKv
}) => {
  const {
    $title,
    $description,
    $status,
    $startDate,
    $type,
    $isUpdating,
    taskSuccessfullyUpdated,
    updateTaskTriggered,
    $isAllowToSubmit: $isAllowToUpdate,
  } = updateTaskModel
  const {
    $isCreating,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isAllowToSubmit: $isAllowToCreate,
  } = createTaskModel

  const closeTaskTriggered = createEvent()
  const updatedTaskOpened = createEvent<{ id: string }>()
  const createdTaskOpened = createEvent()

  const updatedTaskClosed = createEvent()
  const createdTaskClosed = createEvent()

  const $updatedTask = createStore<Nullable<{ id: string }>>(null)
  const $createdTask = createStore(false)

  const $isUpdatedTaskTriggered = createStore<Nullable<{ id: string }>>(null)
  const $isCreatedTaskTriggered = createStore(false)

  sample({
    clock: updatedTaskOpened,
    source: tasks,
    fn: (tasks, { id }) => tasks[id],
    target: spread({
      targets: {
        title: $title,
        description: $description,
        status: $status,
        start_date: $startDate,
        type: $type,
      },
    }),
  })
  sample({
    clock: closeTaskTriggered,
    source: $createdTask,
    filter: Boolean,
    target: createdTaskClosed,
  })
  sample({
    clock: closeTaskTriggered,
    source: $updatedTask,
    filter: Boolean,
    target: updatedTaskClosed,
  })
  sample({
    clock: createdTaskOpened,
    filter: and(not($isAllowToCreate), $createdTask),
    target: closeTaskTriggered,
  })

  sample({
    clock: updatedTaskOpened,
    filter: and(
      not($updatedTask),
      not($createdTask),
      not($isUpdatedTaskTriggered),
    ),
    target: $updatedTask,
  })
  sample({
    clock: updatedTaskOpened,
    filter: and($updatedTask, not($isAllowToUpdate)),
    target: $updatedTask,
  })

  sample({
    clock: taskSuccessfullyUpdated,
    target: $updatedTask.reinit!,
  })
  sample({
    clock: taskSuccessfullyUpdated,
    filter: $isCreatedTaskTriggered,
    fn: () => true,
    target: $createdTask,
  })

  // open task if updated, created task isn't opened, and createdTaskTriggered false
  sample({
    clock: createdTaskOpened,
    filter: and(
      not($updatedTask),
      not($createdTask),
      not($isCreatedTaskTriggered),
    ),
    fn: () => true,
    target: $createdTask,
  })
  sample({
    clock: createdTaskOpened,
    filter: and($updatedTask, not($isAllowToUpdate)),
    fn: () => true,
    target: [$createdTask, $updatedTask.reinit],
  })
  // set flag to open create task later, if you are allowed can update task or create
  sample({
    clock: createdTaskOpened,
    filter: or(
      and($updatedTask, $isAllowToUpdate),
      and($createdTask, $isAllowToCreate),
    ),
    fn: () => true,
    target: $isCreatedTaskTriggered,
  })

  sample({
    clock: closeTaskTriggered,
    filter: and($isAllowToCreate, not($isCreating)),
    target: createTaskTriggered,
  })
  sample({
    clock: taskSuccessfullyCreated,
    filter: not($isCreatedTaskTriggered),
    target: $createdTask.reinit!,
  })
  // Click on opened created task, if updated task if opened and can be updated then update
  type P = {
    task: { id: string } | null
    canUpdate: boolean
    isUpdating: boolean
  }
  type P1 = {
    task: { id: string }
    canUpdate: boolean
    isUpdating: boolean
  }
  sample({
    clock: [updatedTaskClosed, createdTaskOpened],
    source: {
      task: $updatedTask,
      canUpdate: $isAllowToUpdate,
      isUpdating: $isUpdating,
    },
    filter: (value: P): value is P1 => {
      return Boolean(value.task) && value.canUpdate && !value.isUpdating
    },
    fn: ({ task }) => ({ id: task.id }),
    target: updateTaskTriggered,
  })
  sample({
    clock: createdTaskClosed,
    filter: not($isAllowToCreate),
    target: $createdTask.reinit!,
  })
  sample({
    clock: createdTaskOpened,
    filter: and($isAllowToCreate, not($isCreating)),
    target: createTaskTriggered,
  })
  sample({
    clock: taskSuccessfullyCreated,
    target: $isCreatedTaskTriggered.reinit!,
  })
  sample({
    clock: taskSuccessfullyUpdated,
    filter: $isCreatedTaskTriggered,
    target: $isCreatedTaskTriggered.reinit!,
  })
  sample({
    clock: updatedTaskClosed,
    filter: not($isAllowToUpdate),
    target: $updatedTask.reinit!,
  })
  return {
    closeTaskTriggered,
    $createdTask,
    $updatedTask,
    updatedTaskOpened,
    createdTaskOpened,
  }
}
