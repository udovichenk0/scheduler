import { attach, createEvent, merge, sample } from "effector"
import { spread, and, not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { $$task, TaskStatus } from "@/entities/task/task-item"
import { modifyTaskFactory } from "@/entities/task/task-form"

import {
  updateStatusQuery,
  updateTaskDate,
  updateTaskQuery,
  updateTaskDateFromLsFx,
  updateStatusFromLocalStorageFx,
  updateTaskFromLocalStorageFx,
} from "@/shared/api/task"

export const updateTaskFactory = () => {
  const $$modifyTask = modifyTaskFactory({})
  const {
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    $title,
    $description,
    $type,
    $startDate,
    $status,
    dateChangedAndUpdated,
    statusChangedAndUpdated,
  } = $$modifyTask

  const setFieldsTriggeredById = createEvent<{ id: string }>()
  const updateTaskTriggeredById = createEvent<string>()

  const attachUpdateStatusQuery = attachOperation(updateStatusQuery)
  const attachUpdateTaskDate = attachOperation(updateTaskDate)
  const attachUpdateTaskQuery = attachOperation(updateTaskQuery)
  const attachUpdateTaskDateFromLsFx = attach({
    effect: updateTaskDateFromLsFx,
  })
  const attachUpdateStatusFromLocalStorageFx = attach({
    effect: updateStatusFromLocalStorageFx,
  })
  const attachUpdateTaskFromLocalStorageFx = attach({
    effect: updateTaskFromLocalStorageFx,
  })

  const taskSuccessfullyUpdated = merge([
    attachUpdateTaskQuery.finished.success,
    attachUpdateTaskFromLocalStorageFx.done,
  ])

  //updatae task date from localstorage or from the server
  sample({
    clock: dateChangedAndUpdated,
    filter: not($$session.$isAuthenticated),
    target: attachUpdateTaskDateFromLsFx,
  })
  sample({
    clock: dateChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ date, id }) => ({ body: { date, id } }),
    target: attachUpdateTaskDate.start,
  })
  //updatae task status from localstorage or from the server
  sample({
    clock: statusChangedAndUpdated,
    filter: not($$session.$isAuthenticated),
    fn: ({ id, status }) => {
      const changedStatus = status === "INPROGRESS" ? "FINISHED" : "INPROGRESS"
      return { id, status: changedStatus as TaskStatus }
    },
    target: attachUpdateStatusFromLocalStorageFx,
  })
  sample({
    clock: statusChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ id, status }) => {
      const changedStatus = status === "INPROGRESS" ? "FINISHED" : "INPROGRESS"
      return { body: { id, status: changedStatus as TaskStatus } }
    },
    target: attachUpdateStatusQuery.start,
  })

  // update task from localStorage or from the server
  sample({
    clock: updateTaskTriggeredById,
    source: $fields,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields, id) => ({ body: { ...fields, id } }),
    target: attachUpdateTaskQuery.start,
  })
  sample({
    clock: updateTaskTriggeredById,
    source: $fields,
    filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
    fn: (fields, id) => ({ ...fields, id }),
    target: attachUpdateTaskFromLocalStorageFx,
  })
  sample({
    clock: setFieldsTriggeredById,
    source: $$task.$taskKv,
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
    fn: ({ result }) => result,
    target: [$$task.setTaskTriggered, resetFieldsTriggered],
  })
  return {
    updateTaskTriggeredById,
    taskSuccessfullyUpdated,
    setFieldsTriggeredById,
    $isUpdating: updateTaskQuery.$pending,
    ...$$modifyTask,
    _: {
      updateTaskFromLocalStorageFx: attachUpdateTaskFromLocalStorageFx,
      updateTaskQuery,
      updateTaskDateFromLsFx: attachUpdateTaskDateFromLsFx,
      updateTaskDate,
      updateStatusQuery: attachUpdateStatusQuery,
      updateStatusFromLocalStorageFx: attachUpdateStatusFromLocalStorageFx,
    },
  }
}
export type UpdateTaskType = ReturnType<typeof updateTaskFactory>
