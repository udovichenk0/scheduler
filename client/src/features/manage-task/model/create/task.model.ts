import { merge, sample, createEvent, attach } from "effector"
import { not, and } from "patronum"
import { attachOperation } from "@farfetched/core"

import { modifyTaskFactory } from "@/entities/task/task-form"
import { $$task } from "@/entities/task/task-item"
import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

export const createTaskFactory = ({
  defaultType,
  defaultDate,
}: {
  defaultType: "inbox" | "unplaced"
  defaultDate: Nullable<Date>
}) => {
  const $$modifyTask = modifyTaskFactory({ defaultType, defaultDate })
  const { $fields, $isAllowToSubmit, resetFieldsTriggered } = $$modifyTask

  const createTaskTriggered = createEvent()

  const attachCreateTaskQuery = attachOperation(taskApi.createTaskQuery)
  const attachSetTaskToLocalStorage = attach({
    effect: taskApi.setTaskToLocalStorageFx,
  })
  const taskSuccessfullyCreated = merge([
    attachSetTaskToLocalStorage.doneData,
    attachCreateTaskQuery.finished.success,
  ])
  bridge(() => {
    sample({
      clock: createTaskTriggered,
      source: $fields,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      fn: (fields) => ({ body: fields }),
      target: attachCreateTaskQuery.start,
    })
    sample({
      clock: createTaskTriggered,
      source: $fields,
      filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
      fn: (fields) => ({ body: fields }),
      target: attachSetTaskToLocalStorage,
    })
  })
  sample({
    clock: [
      attachCreateTaskQuery.finished.success,
      attachSetTaskToLocalStorage.doneData,
    ],
    fn: ({ result }) => result,
    target: [$$task.setTaskTriggered, resetFieldsTriggered],
  })

  return {
    ...$$modifyTask,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isCreating: taskApi.createTaskQuery.$pending,
    _: {
      setTaskToLocalStorageFx: attachSetTaskToLocalStorage,
      createTaskQuery: attachCreateTaskQuery,
    },
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
