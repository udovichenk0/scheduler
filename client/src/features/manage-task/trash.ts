import { createEvent, sample, merge } from "effector"

import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"
import { TaskModel } from "@/entities/task"
import { attachOperation } from "@farfetched/core"

export const trashTaskFactory = ({
  taskModel
}:{
  taskModel: TaskModel
}) => {
  const taskTrashedById = createEvent<string>()

  const trashTaskAttach = attachOperation(taskApi.trashTaskMutation)
  // const trashLsTaskAttach = attachOperation(taskApi.trashTaskLs)
  const taskSuccessfullyTrashed = merge([
    // trashLsTaskAttach.finished.success,
    trashTaskAttach.finished.success,
  ])

  sample({
    clock: taskSuccessfullyTrashed,
    source: taskModel.$tasks,
    filter: Boolean,
    fn: (tasks, {params: taskId}) => {
      return tasks.map((task) => task.id == taskId ? {...task, is_trashed: true} : task)
    },
    target: taskModel.setTasksTriggered,
  })

  sample({
    clock: taskTrashedById,
    filter: $$session.$isAuthenticated,
    target: trashTaskAttach.start,
  })
  // sample({
  //   clock: taskTrashedById,
  //   filter: not($$session.$isAuthenticated),
  //   target: trashLsTaskAttach.start,
  // })

  return {
    taskTrashedById,
    taskSuccessfullyDeleted: taskSuccessfullyTrashed,
  }
}

export type TrashTaskFactory = ReturnType<typeof trashTaskFactory>
