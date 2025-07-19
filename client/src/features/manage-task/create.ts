import { attachOperation } from "@farfetched/core"
import { merge, sample, createEvent } from "effector"
import { and } from "patronum"
import { v4 } from "uuid"

import { $$session } from "@/entities/session/session.model.ts"
import { createTaskEditor } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"
import { Task } from "@/entities/task/type"

import { taskApi } from "@/shared/api/task/task.api.ts"
import { toApiTaskFields } from "@/shared/api/task/task.dto"

export const createTaskCreator = ({ taskModel }: { taskModel: TaskModel }) => {
  const $$taskEditor = createTaskEditor()
  const { $fields, $isAllowToSubmit, resetFieldsTriggered } = $$taskEditor
  const createTaskTriggered = createEvent()
  const optimisticTaskCreated = createEvent<Task>()
  const createTaskMutationAttach = attachOperation(taskApi.createTaskMutation)

  const taskSuccessfullyCreated = merge([
    createTaskMutationAttach.finished.success,
  ])

  sample({
    clock: createTaskTriggered,
    source: $fields,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields) => {
      const optimisticTask: Task = {
        id: v4(),
        title: fields.title,
        description: fields.description,
        status: fields.status,
        type: fields.type,
        start_date: fields.start_date,
        due_date: fields.due_date,
        user_id: "",
        date_created: new Date(),
        is_trashed: false,
        priority: fields.priority,
        project_id: fields.project_id,
      }
      return optimisticTask
    },
    target: optimisticTaskCreated,
  })
  sample({
    clock: optimisticTaskCreated,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: (fields) => {
      const tempId = fields.id
      return {
        tempId,
        ...toApiTaskFields(fields),
      }
    },
    target: createTaskMutationAttach.start,
  })
  sample({
    clock: optimisticTaskCreated,
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    target: taskModel.addTask,
  })
  sample({
    clock: createTaskMutationAttach.finished.failure,
    fn: ({ params }) => {
      //@ts-ignore
      const tempId = params?.["tempId"]
      return tempId
    },
    target: taskModel.removeTask,
  })

  sample({
    clock: createTaskTriggered,
    target: resetFieldsTriggered,
  })

  return {
    ...$$taskEditor,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isCreating: taskApi.createTaskMutation.$pending,
  }
}
