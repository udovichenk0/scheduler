import { createEffect, createEvent, sample } from "effector"
import { spread, and, not } from "patronum"
// import { v4 as uuidv4 } from 'uuid';

import { $isAuthenticated } from "@/entities/session"
import { modifyFormFactory } from "@/entities/task/modify"
import { $taskKv } from "@/entities/task/tasks"

import { updateStatusQuery, updateTaskQuery } from "@/shared/api/task"
import { ExpensionTaskType } from "@/shared/lib/task-accordion-factory"

export const updateTaskFactory = ({
  taskModel,
}: {
  taskModel: ExpensionTaskType
}) => {
  const {
    statusChanged,
    titleChanged,
    dateChanged,
    typeChanged,
    descriptionChanged,
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    $title,
    $description,
    $startDate,
    $status,
    $type,
  } = modifyFormFactory({})
  const changeStatusTriggered = createEvent<string>()

  type TaskCredentials = {
    description: string
    title: string
    type: "unplaced" | "inbox"
    status: "INPROGRESS" | "FINISHED"
    start_date: Nullable<Date>
    id: string
  }

  const updateTaskFromLocalStorageFx = createEffect((cred: TaskCredentials) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)
    const updatedTasks = parsedTasks.map((task: TaskCredentials) =>
      task.id === cred.id ? cred : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return cred as TaskCredentials
  })
  sample({
    clock: taskModel.updateTaskOpened,
    target: spread({
      targets: {
        title: $title,
        description: $description,
        status: $status,
        start_date: $startDate,
        type: $type,
      },
    }),
  })
  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenCreate,
  })

  sample({
    clock: taskModel.updateTaskClosed,
    filter: $isAllowToSubmit,
    fn: () => true,
    target: taskModel.$updatedTriggered,
  })
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, $isAuthenticated),
    fn: (fields, id) => ({ body: { ...fields, id } }),
    target: updateTaskQuery.start,
  })
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, not($isAuthenticated)),
    fn: (fields, id) => ({ ...fields, id }),
    target: updateTaskFromLocalStorageFx,
  })
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateStatusQuery.finished.success,
    ],
    source: $taskKv,
    fn: (kv, { result: { result } }) => ({ ...kv, [result.id]: result }),
    target: [
      $taskKv,
      taskModel.$taskId.reinit,
      resetFieldsTriggered,
      taskModel.$updatedTriggered.reinit,
    ],
  })
  sample({
    clock: updateTaskFromLocalStorageFx.doneData,
    source: $taskKv,
    fn: (kv, result) => ({ ...kv, [result.id]: result }),
    target: [
      $taskKv,
      taskModel.$taskId.reinit,
      resetFieldsTriggered,
      taskModel.$updatedTriggered.reinit,
    ],
  })
  sample({
    clock: [
      updateTaskQuery.finished.success,
      updateTaskFromLocalStorageFx.done,
    ],
    filter: taskModel.$createdTriggered,
    fn: () => true,
    target: [taskModel.$newTask, taskModel.$createdTriggered.reinit],
  })

  return {
    statusChanged,
    titleChanged,
    dateChanged,
    typeChanged,
    descriptionChanged,
    $title,
    $description,
    $isAllowToSubmit,
    $startDate,
    $status,
    $type,
    changeStatusTriggered,
  }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>
