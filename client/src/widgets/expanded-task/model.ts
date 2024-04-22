import { createEvent, createStore, sample } from "effector"
import { and, not, or } from "patronum"

import { CreateTaskFactory } from "@/features/manage-task/model/create"
import { UpdateTaskFactory } from "@/features/manage-task/model/update"

import { Task } from "@/entities/task/task-item"

import { createModal } from "@/shared/lib/modal"
import { TaskId } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

export const pomodoroModal = createModal({})
export const settingsModal = createModal({})
export const dateModal = createModal({})

export const disclosureTask = ({
  updateTaskModel,
  createTaskModel,
}: {
  updateTaskModel: UpdateTaskFactory
  createTaskModel: CreateTaskFactory
}) => {
  const {
    $isUpdating,
    setFieldsTriggered: setFieldsTriggeredById,
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
  const updatedTaskOpened = createEvent<Task>()
  const createdTaskOpened = createEvent()

  const updatedTaskClosed = createEvent()
  const createdTaskClosed = createEvent()

  const $updatedTaskId = createStore<Nullable<string>>(null)
  const $createdTask = createStore(false)

  const $isUpdatedTaskTriggered = createStore<Nullable<TaskId>>(null)
  const $isCreatedTaskTriggered = createStore(false)

  sample({
    clock: updatedTaskOpened,
    fn: ({ title, description, status, start_date, type }) => ({
      title,
      description,
      status,
      start_date,
      type,
    }),
    target: setFieldsTriggeredById,
  })
  bridge(() => {
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
      clock: closeTaskTriggered,
      filter: and($isAllowToCreate, not($isCreating)),
      target: createTaskTriggered,
    })
  })

  sample({
    clock: updatedTaskOpened,
    filter: and(
      not($updatedTaskId),
      not($createdTask),
      not($isUpdatedTaskTriggered),
    ),
    fn: (task) => task.id,
    target: $updatedTaskId,
  })
  sample({
    clock: updatedTaskOpened,
    filter: and($updatedTaskId, not($isAllowToUpdate)),
    fn: (task) => task.id,
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
  bridge(() => {
    sample({
      clock: createdTaskOpened,
      filter: and(not($isAllowToCreate), $createdTask),
      target: closeTaskTriggered,
    })
    // open task if updated/created task isn't opened, and createdTaskTriggered false
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
  })

  // Click on opened created task, if updated task if opened and can be updated then update
  sample({
    clock: [updatedTaskClosed, createdTaskOpened],
    source: $updatedTaskId,
    filter: and($updatedTaskId, $isAllowToUpdate, not($isUpdating)),
    fn: (updatedTaskId) => updatedTaskId!,
    target: updateTaskTriggeredById,
  })

  sample({
    clock: createdTaskOpened,
    filter: and($isAllowToCreate, not($isCreating)),
    target: createTaskTriggered,
  })
  bridge(() => {
    sample({
      clock: taskSuccessfullyCreated,
      filter: not($isCreatedTaskTriggered),
      target: $createdTask.reinit!,
    })
    sample({
      clock: createdTaskClosed,
      filter: not($isAllowToCreate),
      target: $createdTask.reinit!,
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
  })
  return {
    closeTaskTriggered,
    $createdTask,
    $updatedTaskId,
    updatedTaskOpened,
    createdTaskOpened,
  }
}
export type DisclosureTaskType = ReturnType<typeof disclosureTask>
