import { createEvent, sample, merge, attach } from "effector"
import { not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"

export const trashTaskFactory = () => {
  const taskTrashedById = createEvent<string>()

  const attachTrashTaskQuery = attachOperation(taskApi.trashTaskQuery)

  const attachTrashTaskFromLsFx = attach({
    effect: taskApi.trashTaskFromLocalStorageFx,
  })

  const taskSuccessfullyDeleted = merge([
    attachTrashTaskFromLsFx.done,
    attachTrashTaskQuery.finished.success,
  ])

  sample({
    clock: taskTrashedById,
    filter: $$session.$isAuthenticated,
    target: attachTrashTaskQuery.start,
  })
  sample({
    clock: taskTrashedById,
    filter: not($$session.$isAuthenticated),
    target: attachTrashTaskFromLsFx,
  })
  sample({
    clock: [
      attachTrashTaskQuery.finished.success,
      attachTrashTaskFromLsFx.doneData,
    ],
    source: $$task.$tasks,
    fn: (tasks, { result }) => tasks!.map((task) => task.id == result.id ? result : task),
    target: $$task.$tasks,
  })
  return {
    taskTrashedById,
    taskSuccessfullyDeleted,
    _: {
      trashTaskFromLsFx: attachTrashTaskFromLsFx,
      trashTaskQuery: attachTrashTaskQuery,
    },
  }
}
