import { attach, createEvent, merge, sample } from "effector"
import { and, not, spread } from "patronum"
import { attachOperation } from "@farfetched/core"

import { switchTaskType } from "@/entities/task/task-item/lib"
import { $$session } from "@/entities/session"
import { modifyTaskFactory } from "@/entities/task/task-form"

import { taskApi, TaskStatus, TaskType } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

export const updateTaskFactory = () => {
  const $$modifyTask = modifyTaskFactory({})
  const {
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    $title,
    $description,
    $startDate,
    $status,
    $type,
    dateChangedAndUpdated,
    statusChangedAndUpdated,
  } = $$modifyTask

  const setFieldsTriggered = createEvent<{
    title: string
    description: Nullable<string>
    status: TaskStatus
    start_date: Nullable<Date>
    type: TaskType
  }>()
  const updateTaskTriggeredById = createEvent<string>()

  const attachUpdateStatusQuery = attachOperation(taskApi.updateStatusMutation)
  const attachUpdateTaskDate = attachOperation(taskApi.updateDateMutation)
  const attachUpdateTaskQuery = attachOperation(taskApi.updateTaskMutation)
  const attachUpdateTaskDateFromLsFx = attach({
    effect: taskApi.updateDateLs,
  })
  const attachUpdateStatusFromLocalStorageFx = attach({
    effect: taskApi.updateStatusLs,
  })
  const attachUpdateTaskFromLocalStorageFx = attach({
    effect: taskApi.updateTaskLs,
  })

  const taskSuccessfullyUpdated = merge([
    attachUpdateTaskQuery.finished.success,
    attachUpdateTaskFromLocalStorageFx.done,
  ])

  //updatae task date from localstorage or from the server
  bridge(() => {
    sample({
      clock: dateChangedAndUpdated,
      source: $type,
      filter: not($$session.$isAuthenticated),
      fn: (type, { date, id }) => {
        const newType = switchTaskType(type, date)
        return { id, date, type: newType }
      },
      target: attachUpdateTaskDateFromLsFx,
    })
    sample({
      clock: dateChangedAndUpdated,
      source: $type,
      filter: $$session.$isAuthenticated,
      fn: (type, { date, id }) => {
        const newType = switchTaskType(type, date)
        return { data: { start_date: date, type: newType }, id }
      },
      target: attachUpdateTaskDate.start,
    })
  })
  //updatae task status from localstorage or from the server
  bridge(() => {
    sample({
      clock: statusChangedAndUpdated,
      filter: not($$session.$isAuthenticated),
      fn: ({ id, status }) => {
        const changedStatus =
          status === "INPROGRESS" ? "FINISHED" : "INPROGRESS"
        return { id, status: changedStatus as TaskStatus }
      },
      target: attachUpdateStatusFromLocalStorageFx,
    })
    sample({
      clock: statusChangedAndUpdated,
      filter: $$session.$isAuthenticated,
      fn: ({ id, status }) => {
        const changedStatus =
          status === "INPROGRESS" ? "FINISHED" : "INPROGRESS"
        return { data: { status: changedStatus as TaskStatus }, id }
      },
      target: attachUpdateStatusQuery.start,
    })
  })

  // update task from localStorage or from the server
  bridge(() => {
    sample({
      clock: updateTaskTriggeredById,
      source: $fields,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      fn: (fields, id) => ({ data: fields, id }),
      target: attachUpdateTaskQuery.start,
    })
    sample({
      clock: updateTaskTriggeredById,
      source: $fields,
      filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
      fn: (fields, id) => ({ data: fields, id }),
      target: attachUpdateTaskFromLocalStorageFx,
    })
  })

  sample({
    clock: setFieldsTriggered,
    target: spread({
      title: $title,
      description: $description,
      status: $status,
      start_date: $startDate,
      type: $type,
    }),
  })

  // Update the client store after response and reset fields
  sample({
    clock: [
      attachUpdateTaskQuery.finished.success,
      attachUpdateStatusQuery.finished.success,
      attachUpdateTaskDate.finished.success,
      attachUpdateTaskFromLocalStorageFx.doneData,
      attachUpdateTaskDateFromLsFx.doneData,
      attachUpdateStatusFromLocalStorageFx.doneData,
    ],
    target: resetFieldsTriggered,
  })
  return {
    updateTaskTriggeredById,
    taskSuccessfullyUpdated,
    setFieldsTriggered,
    $isUpdating: taskApi.updateTaskMutation.$pending,
    ...$$modifyTask,
  }
}
export type UpdateTaskFactory = ReturnType<typeof updateTaskFactory>
