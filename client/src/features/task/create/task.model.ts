import { merge, sample, createEffect, createEvent } from "effector"
import { not, and } from "patronum"
import { v4 as uuidv4 } from "uuid"
import { attachOperation } from "@farfetched/core"

import { modifyTask } from "@/entities/task/modify"
import { $$task, LocalStorageTask } from "@/entities/task/tasks"
import { $$session } from "@/entities/session"

import { createTaskQuery } from "@/shared/api/task"

type TaskCredentials = {
  description: string
  title: string
  type: "unplaced" | "inbox"
  status: "INPROGRESS" | "FINISHED"
  start_date: Nullable<Date>
}

export const createTaskFactory = ({
  defaultType,
  defaultDate,
}: {
  defaultType: "inbox" | "unplaced"
  defaultDate: Nullable<Date>
}) => {
  const $$modifyTask = modifyTask({ defaultType, defaultDate })
  const { $fields, $isAllowToSubmit, resetFieldsTriggered } = $$modifyTask

  const createTaskTriggered = createEvent()

  const attachCreateTaskQuery = attachOperation(createTaskQuery)

  const setTaskToLocalStorageFx = createEffect(
    ({ body }: { body: TaskCredentials }) => {
      const tasksFromLs = localStorage.getItem("tasks")
      if (tasksFromLs) {
        const tasks = JSON.parse(tasksFromLs)
        const task = { ...body, id: uuidv4(), user_id: null }
        localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
        return {
          result: task as LocalStorageTask,
        }
      } else {
        const task = { ...body, id: uuidv4() }
        localStorage.setItem("tasks", JSON.stringify([task]))
        return {
          result: task as LocalStorageTask,
        }
      }
    },
  )
  const taskSuccessfullyCreated = merge([
    setTaskToLocalStorageFx.doneData,
    attachCreateTaskQuery.finished.success,
  ])

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
    target: setTaskToLocalStorageFx,
  })
  sample({
    clock: [
      attachCreateTaskQuery.finished.success,
      setTaskToLocalStorageFx.doneData,
    ],
    fn: ({ result }) => result,
    target: $$task.setTaskTriggered,
  })

  sample({
    clock: [
      attachCreateTaskQuery.finished.success,
      setTaskToLocalStorageFx.done,
    ],
    target: resetFieldsTriggered,
  })

  return {
    ...$$modifyTask,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isCreating: createTaskQuery.$pending,
    _: {
      setTaskToLocalStorageFx,
      createTaskQuery: attachCreateTaskQuery,
    },
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
