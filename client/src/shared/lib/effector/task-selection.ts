import {
  createStore,
  createEvent,
  sample,
  Store,
  EventCallable,
} from "effector"

import { Task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

export const selectTaskFactory = (
  $tasks: Store<Nullable<Task[] | Task[][]>>,
  selectNextIdOnEvent: EventCallable<TaskId>,
) => {
  const selectTaskId = createEvent<Nullable<TaskId>>()
  const selectNextId = createEvent<TaskId>()
  const $selectedTaskId = createStore<Nullable<TaskId>>(null).on(
    selectTaskId,
    (_, id) => id,
  )

  sample({
    clock: selectNextId,
    source: $tasks,
    filter: (tasks: Nullable<Task[] | Task[][]>): tasks is Task[] | Task[][] =>
      tasks != null,
    fn: (tasks, id) => {
      if (Array.isArray(tasks[0])) {
        //@ts-ignore
        return getNextTaskIdFromMultipleSource(tasks, id)
      }
      //@ts-ignore
      const tId = getNextTaskId(tasks, id)
      if (tId) return tId
      return null
    },
    target: $selectedTaskId,
  })
  sample({
    clock: selectNextIdOnEvent,
    target: selectNextId,
  })

  return {
    selectTaskId,
    selectNextId,
    $selectedTaskId,
  }
}
export function getNextTaskIdFromMultipleSource(
  source: Task[][],
  selectedTaskId: TaskId,
) {
  for (let i = 0; i < source.length; i++) {
    const taskId = getNextTaskId(source[i], selectedTaskId)
    if (taskId) return taskId
  }
  return null
}
export function getNextTaskId(tasks: Task[], selectedTaskId: TaskId) {
  if (!selectedTaskId || !tasks) return null
  const index = tasks?.findIndex((task) => task.id == selectedTaskId)
  if (index >= 0 && tasks?.[index + 1]) {
    return tasks[index + 1].id
  }
  if (index >= 0 && tasks?.[index - 1]) {
    return tasks[index - 1].id
  }
  return null
}
