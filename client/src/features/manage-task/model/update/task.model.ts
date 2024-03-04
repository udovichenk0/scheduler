import { attach, createEvent, merge, sample } from "effector"
import { spread, and, not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { findTaskById, switchTaskType, tasksNotNull } from "@/entities/task/task-item/lib"
import { $$session } from "@/entities/session"
import { $$task, Task } from "@/entities/task/task-item"
import { modifyTaskFactory } from "@/entities/task/task-form"

import { taskApi, TaskId, TaskStatus } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

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

  const setFieldsTriggeredById = createEvent<string>()
  const updateTaskTriggeredById = createEvent<string>()

  const attachUpdateStatusQuery = attachOperation(taskApi.updateStatusQuery)
  const attachUpdateTaskDate = attachOperation(taskApi.updateDateQuery)
  const attachUpdateTaskQuery = attachOperation(taskApi.updateTaskQuery)
  const attachUpdateTaskDateFromLsFx = attach({
    effect: taskApi.updateDateInLocalStorageFx,
  })
  const attachUpdateStatusFromLocalStorageFx = attach({
    effect: taskApi.updateStatusInLocalStorageFx,
  })
  const attachUpdateTaskFromLocalStorageFx = attach({
    effect: taskApi.updateTaskFromLocalStorageFx,
  })

  const taskSuccessfullyUpdated = merge([
    attachUpdateTaskQuery.finished.success,
    attachUpdateTaskFromLocalStorageFx.done,
  ])

  //updatae task date from localstorage or from the server
  bridge(() => {
    function getType(tasks: Task[], id: TaskId, date: Date){
      const task = tasks?.find((task) => task.id == id)!
      const type = switchTaskType(task.type, date)
      return type
    }
    sample({
      clock: dateChangedAndUpdated,
      source: $$task.$tasks,
      filter: not($$session.$isAuthenticated),
      fn: (tasks, { date, id }) => {
        const type = getType(tasks!, id, date)
        return { id, date, type }
      },
      target: attachUpdateTaskDateFromLsFx,
    })
    sample({
      clock: dateChangedAndUpdated,
      source: $$task.$tasks,
      filter: $$session.$isAuthenticated,
      fn: (tasks, { date, id }) => {
        const type = getType(tasks!, id, date)
        return { data: { start_date: date, type }, id }
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
    clock: setFieldsTriggeredById,
    source: $$task.$tasks,
    filter: tasksNotNull,
    fn: findTaskById,
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
    source: $$task.$tasks,
    fn: (tasks, { result }) => tasks!.map((task) => task.id == result.id ? result : task),
    target: [$$task.$tasks, resetFieldsTriggered],
  })
  return {
    updateTaskTriggeredById,
    taskSuccessfullyUpdated,
    setFieldsTriggeredById,
    $isUpdating: taskApi.updateTaskQuery.$pending,
    ...$$modifyTask,
    _: {
      updateTaskFromLocalStorageFx: attachUpdateTaskFromLocalStorageFx,
      updateTaskQuery: taskApi.updateTaskQuery,
      updateTaskDateFromLsFx: attachUpdateTaskDateFromLsFx,
      updateTaskDate: taskApi.updateDateQuery,
      updateStatusQuery: attachUpdateStatusQuery,
      updateStatusFromLocalStorageFx: attachUpdateStatusFromLocalStorageFx,
    },
  }
}
export type UpdateTaskType = ReturnType<typeof updateTaskFactory>