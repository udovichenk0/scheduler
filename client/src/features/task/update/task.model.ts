import { attach, createEffect, createEvent, merge, sample } from "effector"
import { spread, and, not } from "patronum"

import { $isAuthenticated } from "@/entities/session"
import { modifyTaskFactory } from "@/entities/task/modify"
import { $taskKv, Task } from "@/entities/task/tasks"

import {
  updateStatusQuery,
  updateTaskDate,
  updateTaskQuery,
} from "@/shared/api/task"
type TaskLocalStorage = Omit<Task, "user_id">
const updateTaskDateFromLsFx = attach({
  source: $taskKv,
  effect: (kv, { date, id }) => {
    const updatedTask = { ...kv[id], start_date: date }
    const tasksFromLs = localStorage.getItem("tasks")
    if (tasksFromLs) {
      const parsedTasks = JSON.parse(tasksFromLs!)
      const updatedTasks = parsedTasks.map((task: TaskLocalStorage) =>
        task.id === id ? updatedTask : task,
      )
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }
    return {
      result: updatedTask,
    }
  },
})

const updateTaskFromLocalStorageFx = attach({
  effect: createEffect(async (cred: TaskLocalStorage) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)
    const updatedTasks = parsedTasks.map((task: TaskLocalStorage) =>
      task.id === cred.id ? cred : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return new Promise((res) => {
      setTimeout(() => res({ result: cred }), 1000)
    }) as unknown as { result: TaskLocalStorage }
  }),
})

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
  } = $$modifyTask
  const setFieldsTriggered = createEvent<{ id: string }>()
  const updateTaskTriggered = createEvent<{ id: string }>()

  //updatae task from localstorage or from the server
  sample({
    clock: dateChangedAndUpdated,
    filter: not($isAuthenticated),
    target: updateTaskDateFromLsFx,
  })
  sample({
    clock: dateChangedAndUpdated,
    filter: $isAuthenticated,
    fn: ({ date, id }) => ({ body: { date, id } }),
    target: updateTaskDate.start,
  })

  // update task from localStorage or from the server
  sample({
    clock: updateTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, $isAuthenticated),
    fn: (fields, { id }) => ({ body: { ...fields, id } }),
    target: updateTaskQuery.start,
  })
  sample({
    clock: updateTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, not($isAuthenticated)),
    fn: (fields, { id }) => ({ ...fields, id }),
    target: updateTaskFromLocalStorageFx,
  })
  sample({
    clock: setFieldsTriggered,
    source: $taskKv,
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
  // Update the client store after response and reset fields
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateStatusQuery.finished.success,
      updateTaskDate.finished.success,
      updateTaskFromLocalStorageFx.doneData,
      updateTaskDateFromLsFx.doneData,
    ],
    source: $taskKv,
    fn: (kv, { result }) => ({ ...kv, [result.id]: result }),
    target: [$taskKv, resetFieldsTriggered],
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
