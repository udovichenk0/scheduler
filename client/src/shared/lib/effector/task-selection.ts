import { createStore, createEvent, sample, Store } from "effector"

import { Task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

export const selectTaskFactory = ($tasks: Store<Task[]>) => {
  const reset = createEvent()
  const taskIdSelected = createEvent<Nullable<TaskId>>()
  const nextTaskIdSelected = createEvent<TaskId>()
  const $selectedTaskId = createStore<Nullable<TaskId>>(null).reset(reset)
  sample({
    clock: taskIdSelected,
    target: $selectedTaskId,
  })
  sample({
    clock: nextTaskIdSelected,
    source: $tasks,
    fn: (task, id) => takeNextTaskId(task, id),
    target: $selectedTaskId,
  })
  return {
    taskIdSelected,
    nextTaskIdSelected,
    $selectedTaskId,
    reset,
  }
}
export function takeNextTaskId(tasks: Task[], current: TaskId) {
  const index = tasks.findIndex((task) => task.id == current)
  if (tasks[index + 1]) return tasks[index + 1].id
  return null
}
