import { createEvent, sample, merge, attach } from "effector"
import { not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"
export const removeTaskFactory = () => {
  const taskDeletedById = createEvent<string>()
  const allTasksDeleted = createEvent()

  const attachDeleteTaskQuery = attachOperation(taskApi.deleteTaskQuery)
  const attachDeleteAllTasksQuery = attachOperation(taskApi.deleteAllTasksQuery)

  const attachDeleteTaskFromLsFx = attach({
    effect: taskApi.deleteTaskFromLocalStorageFx,
  })

  const attachDeleteAllTasksFromLsFx = attach({
    effect: taskApi.deleteTrashTasksFromLocalStorageFx,
  })

  const taskSuccessfullyDeleted = merge([
    attachDeleteTaskFromLsFx.done,
    attachDeleteTaskQuery.finished.success,
  ])
  sample({
    clock: taskDeletedById,
    filter: $$session.$isAuthenticated,
    target: attachDeleteTaskQuery.start,
  })
  sample({
    clock: allTasksDeleted,
    filter: $$session.$isAuthenticated,
    target: attachDeleteAllTasksQuery.start
  })

  sample({
    clock: taskDeletedById,
    filter: not($$session.$isAuthenticated),
    target: attachDeleteTaskFromLsFx,
  })
  sample({
    clock: allTasksDeleted,
    filter: not($$session.$isAuthenticated),
    target: attachDeleteAllTasksFromLsFx
  })

  sample({
    clock: [
      attachDeleteTaskQuery.finished.success,
      attachDeleteTaskFromLsFx.doneData,
    ],
    fn: ({ result }) => result.id,
    target: $$task.taskDeleted,
  })

  sample({
    clock: [
      attachDeleteAllTasksQuery.finished.success,
      attachDeleteAllTasksFromLsFx.done
    ],
    target: $$task.trashTasksDeleted
  })
  return {
    taskDeletedById,
    allTasksDeleted,
    taskSuccessfullyDeleted,
    _: {
      deleteTaskFromLsFx: attachDeleteTaskFromLsFx,
      deleteTaskQuery: attachDeleteTaskQuery,
    },
  }
}
