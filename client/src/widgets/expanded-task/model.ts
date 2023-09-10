import { createEvent, createStore, sample } from "effector"
import { spread, and, not, or } from "patronum"

import { CreateTaskType } from "@/features/task/create"
import { UpdateTaskType } from "@/features/task/update"

import { TaskKv } from "@/entities/task/task-item"

import { createModal } from "@/shared/lib/modal"

export const pomodoroModal = createModal({})
export const settingsModal = createModal({})
export const dateModal = createModal({})

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
    updateTaskTriggeredById,
    $isAllowToSubmit: $isAllowToUpdate,
  } = updateTaskModel
  const {
    $isCreating,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isAllowToSubmit: $isAllowToCreate,
  } = createTaskModel

  const closeTaskTriggered = createEvent()
  const updatedTaskOpenedById = createEvent<string>()
  const createdTaskOpened = createEvent()

  const updatedTaskClosed = createEvent()
  const createdTaskClosed = createEvent()

  const $updatedTaskId = createStore<Nullable<string>>(null)
  const $createdTask = createStore(false)

  const $isUpdatedTaskTriggered = createStore<Nullable<{ id: string }>>(null)
  const $isCreatedTaskTriggered = createStore(false)

  sample({
    clock: updatedTaskOpenedById,
    source: tasks,
    fn: (tasks, id) => tasks[id],
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
    source: $updatedTaskId,
    filter: Boolean,
    target: updatedTaskClosed,
  })
  sample({
    clock: createdTaskOpened,
    filter: and(not($isAllowToCreate), $createdTask),
    target: closeTaskTriggered,
  })

  sample({
    clock: updatedTaskOpenedById,
    filter: and(
      not($updatedTaskId),
      not($createdTask),
      not($isUpdatedTaskTriggered),
    ),
    target: $updatedTaskId,
  })
  sample({
    clock: updatedTaskOpenedById,
    filter: and($updatedTaskId, not($isAllowToUpdate)),
    target: $updatedTaskId,
  })

  sample({
    clock: taskSuccessfullyUpdated,
    target: $updatedTaskId.reinit!,
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
      not($updatedTaskId),
      not($createdTask),
      not($isCreatedTaskTriggered),
    ),
    fn: () => true,
    target: $createdTask,
  })
  sample({
    clock: createdTaskOpened,
    filter: and($updatedTaskId, not($isAllowToUpdate)),
    fn: () => true,
    target: [$createdTask, $updatedTaskId.reinit],
  })
  // set flag to open create task later, if you are allowed can update task or create
  sample({
    clock: createdTaskOpened,
    filter: or(
      and($updatedTaskId, $isAllowToUpdate),
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
  sample({
    clock: [updatedTaskClosed, createdTaskOpened],
    source: {
      updatedTaskId: $updatedTaskId,
      canUpdate: $isAllowToUpdate,
      isUpdating: $isUpdating,
    },
    filter: ({ updatedTaskId, canUpdate, isUpdating }) => {
      return Boolean(updatedTaskId) && canUpdate && !isUpdating
    },
    fn: ({ updatedTaskId }) => updatedTaskId!,
    target: updateTaskTriggeredById,
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
    target: $updatedTaskId.reinit!,
  })
  return {
    closeTaskTriggered,
    $createdTask,
    $updatedTaskId,
    updatedTaskOpenedById,
    createdTaskOpened,
  }
}
