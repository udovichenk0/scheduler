import { merge, sample, createEffect, createEvent } from "effector"
import { not, and } from "patronum"
import { v4 as uuidv4 } from "uuid"

import { modifyTask } from "@/entities/task/modify"
import { $$task } from "@/entities/task/tasks"
import { $$session } from "@/entities/session"

import { createTaskQuery } from "@/shared/api/task"

type TaskCredentials = {
  description: string
  title: string
  type: "unplaced" | "inbox"
  status: "INPROGRESS" | "FINISHED"
  start_date: Nullable<Date>
}
const setTaskToLocalStorageFx = createEffect(
  ({ body }: { body: TaskCredentials }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    if (tasksFromLs) {
      const tasks = JSON.parse(tasksFromLs)
      const task = { ...body, id: uuidv4() }
      localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
      return new Promise((res) => {
        setTimeout(() => res({ result: task }), 1000)
      }) as unknown as { result: TaskCredentials & { id: string } }
    } else {
      const task = { ...body, id: uuidv4() }
      localStorage.setItem("tasks", JSON.stringify([task]))
      return {
        result: task,
      }
    }
  },
)

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

  sample({
    clock: createTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields) => ({ body: fields }),
    target: createTaskQuery.start,
  })
  sample({
    clock: createTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
    fn: (fields) => ({ body: fields }),
    target: setTaskToLocalStorageFx,
  })
  sample({
    clock: [createTaskQuery.finished.success, setTaskToLocalStorageFx.doneData],
    source: $$task.$taskKv,
    fn: (kv, { result }) => ({ ...kv, [result.id]: result }),
    target: $$task.$taskKv,
  })

  sample({
    clock: [createTaskQuery.finished.success, setTaskToLocalStorageFx.done],
    target: resetFieldsTriggered,
  })
  const taskSuccessfullyCreated = merge([
    setTaskToLocalStorageFx.done,
    createTaskQuery.finished.success,
  ])

  return {
    ...$$modifyTask,
    taskSuccessfullyCreated,
    createTaskTriggered,
    _: {
      setTaskToLocalStorageFx,
      createTaskQuery,
    },
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
