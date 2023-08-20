import { attach, createEffect, createEvent, sample } from "effector"
import { spread, and, not } from "patronum"

import { $isAuthenticated } from "@/entities/session"
import { modifyTask } from "@/entities/task/modify"
import { $taskKv, Task } from "@/entities/task/tasks"

import {
  updateStatusQuery,
  updateTaskDate,
  updateTaskQuery,
} from "@/shared/api/task"
import { ExpensionTaskType } from "@/shared/lib/task-disclosure-factory"
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
      result: updatedTask
    }
  },
})
export const updateTaskFactory = ({
  taskModel,
}: {
  taskModel: ExpensionTaskType
}) => {
  const {
    statusChanged,
    titleChanged,
    dateChanged,
    dateChangedById,
    typeChanged,
    descriptionChanged,
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    $title,
    $description,
    $startDate,
    $status,
    $type,
  } = modifyTask({})
  const changeStatusTriggered = createEvent<string>()

  const updateTaskFromLocalStorageFx = attach({
    effect: createEffect((cred: TaskLocalStorage) => {
      const tasksFromLs = localStorage.getItem("tasks")
      const parsedTasks = JSON.parse(tasksFromLs!)
      const updatedTasks = parsedTasks.map((task: TaskLocalStorage) =>
        task.id === cred.id ? cred : task,
      )
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      return {
        result: cred as TaskLocalStorage
      }
    }),
  })
  sample({
    clock: taskModel.updateTaskOpened,
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
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenCreate,
  })
  sample({
    clock: dateChangedById,
    filter: and(not($isAuthenticated), not(taskModel.$taskId)),
    target: updateTaskDateFromLsFx,
  })
  sample({
    clock: dateChangedById,
    filter: and($isAuthenticated, not(taskModel.$taskId)),
    fn: ({ date, id }) => ({ body: { date, id } }),
    target: updateTaskDate.start,
  })
  sample({
    clock: taskModel.updateTaskClosed,
    filter: $isAllowToSubmit,
    fn: () => true,
    target: taskModel.$updatedTriggered,
  })
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, $isAuthenticated),
    fn: (fields, id) => ({ body: { ...fields, id } }),
    target: updateTaskQuery.start,
  })
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, not($isAuthenticated)),
    fn: (fields, id) => ({ ...fields, id }),
    target: updateTaskFromLocalStorageFx,
  })
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
    target: [
      $taskKv,
      taskModel.$taskId.reinit,
      resetFieldsTriggered,
      taskModel.$updatedTriggered.reinit,
    ],
  })
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateTaskFromLocalStorageFx.done,
    ],
    filter: taskModel.$createdTriggered,
    fn: () => true,
    target: [taskModel.$newTask, taskModel.$createdTriggered.reinit],
  })

  return {
    statusChanged,
    titleChanged,
    dateChanged,
    dateChangedById,
    typeChanged,
    descriptionChanged,
    $title,
    $description,
    $isAllowToSubmit,
    $startDate,
    $status,
    $type,
    resetFieldsTriggered,
    changeStatusTriggered,
    _: {
      updateTaskFromLocalStorageFx,
    },
  }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>
