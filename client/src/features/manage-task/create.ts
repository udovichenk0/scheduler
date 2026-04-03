import { sample, createEvent } from "effector"
import { and } from "patronum"

import { $$session } from "@/entities/session/session.model.ts"
import { createTaskEditor } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api.ts"

import { taskToDomain } from "./../../entities/task/lib"
import { Task } from "@/entities/task/type"
import { sdate } from "@/shared/lib/date/lib"
import { createOptimistic } from "@/shared/lib/create-optimistic"

export const createTaskCreator = ({ taskModel }: { taskModel: TaskModel }) => {
  const taskEditor = createTaskEditor()
  const { $fields, $isAllowToSubmit, resetFieldsTriggered } = taskEditor
  const createTaskTriggered = createEvent<{ listId: string }>()
  const { start, onSuccess, onFail } = createOptimistic({
    handler: taskApi.taskMutationHandler,
    onOptimistic: taskModel.addTask,
    mapParams: (p: Omit<Task, "id">) => ({
      title: p.title,
      description: p.description,
      status: p.status,
      priority: p.priority,
      start_date: p.start_date?.toISOString() || null,
      due_date: p.due_date?.toISOString() || null,
      list_id: p.list_id,
      type: p.type,
    }),
    mapOptimistic: (id, p: Omit<Task, "id">) => ({
      id,
      ...p,
    }),
  })

  sample({
    clock: onSuccess,
    // source: taskModel.$tasks,
    fn: ({ id, data }) => ({
      previousId: id,
      task: taskToDomain(data),
    }),
    target: taskModel.replaceTask,
  })

  sample({
    clock: onFail,
    fn: ({ id, params }) => ({
      taskId: id,
      listId: params.list_id,
    }),
    target: taskModel.removeTask,
  })

  sample({
    clock: createTaskTriggered,
    source: { fields: $fields, user: $$session.$user },
    filter: and($isAllowToSubmit, $$session.$isAuthenticated),
    fn: ({ fields, user }, { listId }) => ({
      start_date: fields.start_date,
      due_date: fields.due_date,
      title: fields.title,
      description: fields.description,
      status: fields.status,
      priority: fields.priority,
      type: fields.type,
      list_id: listId,
      user_id: user!.id,
      date_created: sdate(),
      is_trashed: false,
    }),
    target: start,
  })

  sample({
    clock: createTaskTriggered,
    target: resetFieldsTriggered,
  })

  return {
    createTaskTriggered,
    ...taskEditor,
  }
}

export type TaskCreator = ReturnType<typeof createTaskCreator>
