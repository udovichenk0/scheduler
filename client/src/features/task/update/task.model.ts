import { attach, createEffect, createEvent, merge, sample } from "effector"
import { spread, and, not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { modifyTaskFactory } from "@/entities/task/modify"
import {
  $$task,
  LocalStorageTask,
  Task,
  TaskStatus,
  TaskType,
} from "@/entities/task/tasks"

import {
  updateStatusQuery,
  updateTaskDate,
  updateTaskQuery,
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

  const setFieldsTriggered = createEvent<{ id: string }>()
  const updateTaskTriggered = createEvent<{ id: string }>()

  const attachUpdateStatusQuery = attachOperation(updateStatusQuery)
  const attachUpdateTaskDate = attachOperation(updateTaskDate)
  const attachUpdateTaskQuery = attachOperation(updateTaskQuery)
  const updateTaskDateFromLsFx = attach({
    source: $$task.$taskKv,
    effect: (kv, { date, id }) => {
      const updatedTask = { ...kv[id], start_date: date }
      const tasksFromLs = localStorage.getItem("tasks")
      if (tasksFromLs) {
        const parsedTasks = JSON.parse(tasksFromLs!)
        const updatedTasks = parsedTasks.map((task: Task) =>
          task.id === id ? updatedTask : task,
        )
        localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      }
      return {
        result: updatedTask,
      }
    },
  })

  const updateStatusFromLocalStorageFx = createEffect(
    ({ id, status }: { id: string; status: TaskStatus }) => {
      const tasks = localStorage.getItem("tasks")
      const updatedTasks = (JSON.parse(tasks!) as LocalStorageTask[]).map(
        (task) => (task.id === id ? { ...task, status } : task),
      )
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      const updatedTask = updatedTasks.find((task) => task.id === id)
      return {
        result: updatedTask,
      }
    },
  )

  type Cred = {
    id: string
    title: string
    description: string
    status: TaskStatus
    type: TaskType
    start_date: Nullable<Date>
  }
  const updateTaskFromLocalStorageFx = createEffect(async (cred: Cred) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)
    const updatedTasks = parsedTasks.map((task: Task) =>
      task.id === cred.id ? cred : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: {
        ...cred,
        user_id: null,
      },
    }
  })
  const taskSuccessfullyUpdated = merge([
    attachUpdateTaskQuery.finished.success,
    updateTaskFromLocalStorageFx.done,
  ])

  //updatae task date from localstorage or from the server
  sample({
    clock: dateChangedAndUpdated,
    filter: not($$session.$isAuthenticated),
    target: updateTaskDateFromLsFx,
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
    target: updateStatusFromLocalStorageFx,
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
    clock: updateTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields, { id }) => ({ body: { ...fields, id } }),
    target: attachUpdateTaskQuery.start,
  })
  sample({
    clock: updateTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
    fn: (fields, { id }) => ({ ...fields, id }),
    target: updateTaskFromLocalStorageFx,
  })
  sample({
    clock: setFieldsTriggered,
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
      updateTaskFromLocalStorageFx.doneData,
      updateTaskDateFromLsFx.doneData,
      updateStatusFromLocalStorageFx.doneData,
    ],
    fn: ({ result }) => result,
    target: [$$task.setTaskTriggered, resetFieldsTriggered],
  })
  return {
    updateTaskTriggered,
    taskSuccessfullyUpdated,
    setFieldsTriggered,
    $isUpdating: updateTaskQuery.$pending,
    ...$$modifyTask,
    _: {
      updateTaskFromLocalStorageFx,
      updateTaskQuery,
      updateTaskDateFromLsFx,
      updateTaskDate,
      updateStatusQuery: attachUpdateStatusQuery,
      updateStatusFromLocalStorageFx,
    },
  }
}
export type UpdateTaskType = ReturnType<typeof updateTaskFactory>
