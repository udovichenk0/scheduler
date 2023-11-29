import { combine, createEvent, createStore, sample } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { removeTaskFactory } from "@/features/manage-task/model/delete"
import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"

import { $$task, createFilter } from "@/entities/task/task-item"

import { getNextTaskId } from "@/shared/lib/effector/task-selection"
import { TaskId } from "@/shared/api/task"

export const $$deleteTask = removeTaskFactory()

export const $$filter = createFilter()
export const $inboxTasks = combine($$task.$taskKv, $$filter.$sortType, (kv, sortType) => {
  const tasks = Object.values(kv).filter(({ type }) => type == "inbox")
  return $$filter.filterBy(sortType, tasks)
})

export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "inbox",
  defaultDate: null,
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const selectTaskId = createEvent<Nullable<TaskId>>()
export const selectNextId = createEvent<TaskId>()
export const $selectedTaskId = createStore<Nullable<TaskId>>(null)
  .on(selectTaskId, (_, id) => id)

sample({
  clock: selectNextId,
  source: $inboxTasks,
  fn: (t, id) => {
    const tId = getNextTaskId(t, id)
    if(tId) return tId
    return null
  },
  target: $selectedTaskId
})
sample({
  clock: $$deleteTask.taskDeletedById,
  target: selectNextId,
})
