import { createStore, createEvent, sample, Store } from "effector"

import { Task } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"

export const selectTaskFactory = ($tasks: Store<Task[]>) => {
  const reset = createEvent()
  const taskIdSelected = createEvent<Nullable<TaskId>>()
  const nextTaskIdSelected = createEvent()
  const $selectedTaskId = createStore<Nullable<TaskId>>(null).reset(reset)
  sample({
    clock: taskIdSelected,
    target: $selectedTaskId,
  })
  type ArgInp = {
    tasks: Task[]
    selectedTaskId: Nullable<TaskId>
  }
  type ArgOut = {
    tasks: Task[]
    selectedTaskId: TaskId
  }
  sample({
    clock: nextTaskIdSelected,
    source: { tasks: $tasks, selectedTaskId: $selectedTaskId },
    filter: (params: ArgInp): params is ArgOut => !!params.selectedTaskId,
    fn: ({ tasks, selectedTaskId }) => getNextTaskId(tasks, selectedTaskId),
    target: $selectedTaskId,
  })
  return {
    taskIdSelected,
    nextTaskIdSelected,
    $selectedTaskId,
    reset,
  }
}
export function getNextTaskId(tasks: Task[], selectedTaskId: TaskId) {
  if (!selectedTaskId) return null
  const index = tasks?.findIndex((task) => task.id == selectedTaskId)
  if (index >= 0 && tasks?.[index + 1]) {
    return tasks[index + 1].id
  }
  if (index >= 0 && tasks?.[index - 1]) {
    return tasks[index - 1].id
  }
  return null
}
