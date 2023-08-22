import { attach, createEffect, createEvent, merge, sample } from "effector"
import { spread, and, not } from "patronum"

import { $$session } from "@/entities/session"
import { modifyTaskFactory } from "@/entities/task/modify"
import { $$task, Task, TaskStatus, TaskType } from "@/entities/task/tasks"

import {
  updateStatusQuery,
  updateTaskDate,
  updateTaskQuery,
} from "@/shared/api/task"

export const updateTaskFactory = () => {
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
  } = $$modifyTask
  const setFieldsTriggered = createEvent<{ id: string }>()
  const updateTaskTriggered = createEvent<{ id: string }>()

  //updatae task from localstorage or from the server
  sample({
    clock: dateChangedAndUpdated,
    filter: not($$session.$isAuthenticated),
    target: updateTaskDateFromLsFx,
  })
  sample({
    clock: dateChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ date, id }) => ({ body: { date, id } }),
    target: updateTaskDate.start,
  })

  // update task from localStorage or from the server
  sample({
    clock: updateTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields, { id }) => ({ body: { ...fields, id } }),
    target: updateTaskQuery.start,
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
      updateTaskQuery.finished.success,
      updateStatusQuery.finished.success,
      updateTaskDate.finished.success,
      updateTaskFromLocalStorageFx.doneData,
      updateTaskDateFromLsFx.doneData,
    ],
    fn: ({ result }) => result,
    target: [$$task.setTaskTriggered, resetFieldsTriggered],
  })
  const taskSuccessfullyUpdated = merge([
    updateTaskQuery.finished.success,
    updateTaskFromLocalStorageFx.done,
  ])
  return {
    updateTaskTriggered,
    dateChangedById: createEvent<{ date: Date; id: string }>(),
    taskSuccessfullyUpdated,
    changeStatusTriggered: createEvent<string>(),
    setFieldsTriggered,
    ...$$modifyTask,
    _: {
      updateTaskFromLocalStorageFx,
      updateTaskQuery,
      updateTaskDateFromLsFx,
      updateTaskDate,
      updateStatusQuery,
    },
  }
}
export type UpdateTaskType = ReturnType<typeof updateTaskFactory>
