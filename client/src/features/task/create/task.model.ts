import { merge, sample } from "effector"
import { not, and, condition } from "patronum"
import { createEffect } from "effector/effector.mjs"
import { v4 as uuidv4 } from 'uuid';

import { modifyFormFactory } from "@/entities/task/modify"
import { $taskKv } from "@/entities/task/tasks"
import { $isAuthenticated } from "@/entities/session"

import { createTaskQuery } from "@/shared/api/task"
import { ExpensionTaskType } from "@/shared/lib/task-accordion-factory"

export const createTaskFactory = ({
  taskModel,
  defaultType,
  defaultDate,
}: {
  taskModel: ExpensionTaskType
  defaultType: "inbox" | "unplaced"
  defaultDate: Nullable<Date>
}) => {
  const {
    $title,
    $status,
    $startDate,
    $description,
    $type,
    titleChanged,
    statusChanged,
    dateChanged,
    descriptionChanged,
    typeChanged,
    $fields,
    $isAllowToSubmit,
    resetFieldsTriggered,
  } = modifyFormFactory({
    defaultType,
    defaultDate,
  })
  type TaskCredentials = {
    description: string,
    title: string,
    type: 'unplaced' | 'inbox',
    status: 'INPROGRESS' | 'FINISHED',
    start_date: Nullable<Date>
  }
  const setTaskToLocalStorageFx = createEffect(({body}:{body: TaskCredentials}) => { 
    const tasksFromLs = localStorage.getItem("tasks")
    if (tasksFromLs) {
      const tasks = JSON.parse(tasksFromLs)
      const task = {...body, id: uuidv4()}
      localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
      return task
    }
    else {
      const task = { ...body, id: uuidv4() }
      localStorage.setItem("tasks", JSON.stringify([task]))
      return task
    }
  })

  sample({
    clock: taskModel.createTaskToggled,
    filter: taskModel.$createdTriggered,
    fn: ({ date }) => date,
    target: $startDate,
  })
  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenUpdate,
  })
  sample({
    clock: taskModel.createTaskToggled,
    filter: and($isAllowToSubmit, taskModel.$newTask),
    fn: () => true,
    target: taskModel.$createdTriggered,
  })
  sample({
    clock: taskModel.createTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, $isAuthenticated),
    fn: (fields) => ({ body: fields }),
    target: createTaskQuery.start,
  })
  sample({
    clock: taskModel.createTaskClosed,
    source: $fields,
    filter: and($isAllowToSubmit, not($isAuthenticated)),
    fn: (fields) => ({ body: fields }),
    target: setTaskToLocalStorageFx,
  })
  sample({
    clock: [createTaskQuery.finished.success],
    source: $taskKv,
    fn: (kv, { result: { result } }) => ({ ...kv, [result.id]: result }),
    target: $taskKv,
  })
  sample({
    clock: [createTaskQuery.finished.finally, setTaskToLocalStorageFx.done],
    target: [resetFieldsTriggered]
  })
  sample({
    clock: setTaskToLocalStorageFx.doneData,
    source: $taskKv,
    fn: (kv, task) => ({ ...kv, [task.id]: task }),
    target: $taskKv,
  })
  condition({
    source: merge([createTaskQuery.finished.success, setTaskToLocalStorageFx.done]),
    if: taskModel.$createdTriggered,
    then: taskModel.$createdTriggered.reinit!,
    else: taskModel.$newTask.reinit!,
  })
  
  sample({
    clock: taskModel.createTaskClosed,
    filter: not($isAllowToSubmit),
    target: resetFieldsTriggered,
  })
  return {
    $title,
    $status,
    $startDate,
    $description,
    $type,
    $isAllowToSubmit,
    titleChanged,
    statusChanged,
    dateChanged,
    descriptionChanged,
    typeChanged,
    query: createTaskQuery,
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
