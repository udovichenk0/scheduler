import { combine, createEvent, createStore, sample } from "effector"
import { spread, and, not, or } from "patronum"

import { CreateTaskType } from "@/features/task/create"
import { UpdateTaskType } from "@/features/task/update"

import { $taskKv } from "@/entities/task/tasks"

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
  tasks: typeof $taskKv
}) => {
  const {
    _: { updateTaskQuery, updateTaskFromLocalStorageFx },
    $title,
    $description,
    $status,
    $startDate,
    $type,
  } = updateTaskModel
  const {
    _: { createTaskQuery, setTaskToLocalStorageFx },
  } = createTaskModel

  const $isUpdating = combine(
    updateTaskQuery.$pending,
    updateTaskFromLocalStorageFx.pending,
    (updatingFromServer, updatingFromLocalstorage) =>
      updatingFromServer || updatingFromLocalstorage,
  )

  const $isCreating = combine(
    createTaskQuery.$pending,
    setTaskToLocalStorageFx.pending,
    (creatingFromServer, creatingFromLocalstorage) =>
      creatingFromServer || creatingFromLocalstorage,
  )

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
    fn: (tasks, { id }) => {
      //@ts-ignore
      return tasks[id]
    },
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
    filter: and(not(createTaskModel.$isAllowToSubmit), $createdTask),
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
    filter: and($updatedTask, not(updateTaskModel.$isAllowToSubmit)),
    target: $updatedTask,
  })

  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateTaskFromLocalStorageFx.done,
    ],
    target: $updatedTask.reinit!,
  })
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateTaskFromLocalStorageFx.done,
    ],
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
    filter: and($updatedTask, not(updateTaskModel.$isAllowToSubmit)),
    fn: () => true,
    target: [$createdTask, $updatedTask.reinit],
  })
  // set flag to open create task later, if you are allowed can update task or create
  sample({
    clock: createdTaskOpened,
    filter: or(
      and($updatedTask, updateTaskModel.$isAllowToSubmit),
      and($createdTask, createTaskModel.$isAllowToSubmit),
    ),
    fn: () => true,
    target: $isCreatedTaskTriggered,
  })

  sample({
    clock: closeTaskTriggered,
    filter: and(createTaskModel.$isAllowToSubmit, not($isCreating)),
    target: createTaskModel.createTaskTriggered,
  })
  sample({
    clock: [setTaskToLocalStorageFx.doneData, createTaskQuery.finished.success],
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
      canUpdate: updateTaskModel.$isAllowToSubmit,
      isUpdating: $isUpdating,
    },
    filter: (value: P): value is P1 => {
      return Boolean(value.task) && value.canUpdate && !value.isUpdating
    },
    fn: ({ task }) => ({ id: task.id }),
    target: updateTaskModel.updateTaskTriggered,
  })
  sample({
    clock: createdTaskClosed,
    filter: not(createTaskModel.$isAllowToSubmit),
    target: $createdTask.reinit!,
  })
  sample({
    clock: createdTaskOpened,
    filter: and(createTaskModel.$isAllowToSubmit, not($isCreating)),
    target: createTaskModel.createTaskTriggered,
  })
  sample({
    clock: [setTaskToLocalStorageFx.doneData, createTaskQuery.finished.success],
    target: $isCreatedTaskTriggered.reinit!,
  })
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateTaskFromLocalStorageFx.done,
    ],
    filter: $isCreatedTaskTriggered,
    target: $isCreatedTaskTriggered.reinit!,
  })
  sample({
    clock: updatedTaskClosed,
    filter: not(updateTaskModel.$isAllowToSubmit),
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
