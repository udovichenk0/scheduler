import { createEvent, sample, merge, attach } from "effector"
import { not } from "patronum"
import { attachOperation } from "@farfetched/core"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { deleteTaskFromLsFx, deleteTaskQuery } from "@/shared/api/task"
export const createRemoveTaskFactory = () => {
  const taskDeletedById = createEvent<string>()

  const attachDeleteTaskQuery = attachOperation(deleteTaskQuery)

  // const attachDeleteTaskFromLsFx = attach({ effect: deleteTaskFromLsFx })
  const attachDeleteTaskFromLsFx = attach({ effect: deleteTaskFromLsFx })

  const taskSuccessfullyDeleted = merge([
    attachDeleteTaskFromLsFx.done,
    attachDeleteTaskQuery.finished.success,
  ])

  sample({
    clock: taskDeletedById,
    filter: $$session.$isAuthenticated,
    fn: (id) => ({ body: { id } }),
    target: attachDeleteTaskQuery.start,
  })
  sample({
    clock: taskDeletedById,
    filter: not($$session.$isAuthenticated),
    // fn: (id) => console.log({body: { id }})
    target: attachDeleteTaskFromLsFx,
  })
  sample({
    clock: [
      attachDeleteTaskQuery.finished.success,
      attachDeleteTaskFromLsFx.doneData,
    ],
    fn: ({ result }) => result,
    target: $$task.taskDeleted,
  })
  return {
    taskDeletedById,
    taskSuccessfullyDeleted,
    _: {
      deleteTaskFromLsFx: attachDeleteTaskFromLsFx,
      deleteTaskQuery: attachDeleteTaskQuery,
    },
  }
}
