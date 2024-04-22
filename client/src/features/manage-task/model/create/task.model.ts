import { merge, sample, createEvent } from "effector"
import { not, and } from "patronum"

import { modifyTaskFactory } from "@/entities/task/task-form"
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

  const taskSuccessfullyCreated = merge([
    taskApi.createTaskLs.doneData,
    taskApi.createTaskMutation.finished.success,
  ])
  bridge(() => {
    sample({
      clock: createTaskTriggered,
      source: $fields,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      target: taskApi.createTaskMutation.start,
    })
    sample({
      clock: createTaskTriggered,
      source: $fields,
      filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
      fn: (fields) => ({ body: fields }),
      target: taskApi.createTaskLs,
    })
  })
  sample({
    clock: taskSuccessfullyCreated,
    fn: ({ result }) => result,
    target: resetFieldsTriggered,
  })
  return {
    ...$$modifyTask,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isCreating: taskApi.createTaskMutation.$pending,
  }
}

export type CreateTaskFactory = ReturnType<typeof createTaskFactory>
