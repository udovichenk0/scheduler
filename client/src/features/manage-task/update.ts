import { createEffect, createEvent, createStore, sample } from "effector"
import { attachOperation } from "@farfetched/core"

import {
  changeTaskStatus,
  getTaskFields,
  taskToDomain,
} from "@/entities/task/lib"
import { $$session } from "@/entities/session/session.model.ts"
import { EditableTaskFields, Task, Status } from "@/entities/task/type"
import { createTaskEditor } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api.ts"
import {
  TaskId,
  createUpdateDateDto,
  toApiTaskFields,
} from "@/shared/api/task/task.dto.ts"
import { SDate } from "@/shared/lib/date/lib"
import { Priority } from "@/shared/api/scheduler.schemas"

export const createTaskUpdater = ({ taskModel }: { taskModel: TaskModel }) => {
  const $$taskEditor = createTaskEditor()
  const { resetFieldsTriggered, $fields, setFieldsTriggered } = $$taskEditor

  const updateTaskTriggeredById = createEvent<TaskId>()
  const updateTaskTriggered = createEvent()
  const statusChangedAndUpdated = createEvent<{
    id: TaskId
    status: Status
  }>()
  const dateChangedAndUpdated = createEvent<{
    id: TaskId
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }>()

  const priorityChangedAndUpdated = createEvent<{
    id: TaskId
    priority: Priority
  }>()
  const init = createEvent<Task>()

  const attachUpdateStatusQuery = attachOperation(taskApi.updateStatusMutation)
  const attachUpdatePriorityQuery = attachOperation(
    taskApi.updatePriorityMutation,
  )
  const attachUpdateTaskDate = attachOperation(taskApi.updateDateMutation)
  const $task = createStore<Nullable<Task>>(null)

  //* Update task date
  sample({
    clock: dateChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: createUpdateDateDto,
    target: attachUpdateTaskDate.start,
  })
  sample({
    clock: attachUpdateTaskDate.finished.success,
    filter: Boolean,
    fn: ({ result }) => taskToDomain(result),
    target: taskModel.replaceTask,
  })

  //* Update task status
  sample({
    clock: statusChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ id, status }) => {
      return { id, data: { status: changeTaskStatus(status) } }
    },
    target: attachUpdateStatusQuery.start,
  })

  sample({
    clock: statusChangedAndUpdated,
    fn: ({ id, status }) => {
      return { id, status: changeTaskStatus(status) }
    },
    target: taskModel.replaceFields,
  })
  sample({
    clock: attachUpdateStatusQuery.finished.failure,
    fn: ({ params }) => {
      return { id: params.id, status: changeTaskStatus(params.data.status) }
    },
    target: taskModel.replaceFields,
  })

  //* Update task priority
  sample({
    clock: priorityChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ id, priority }) => {
      return { id, data: { priority } }
    },
    target: attachUpdatePriorityQuery.start,
  })

  sample({
    clock: priorityChangedAndUpdated,
    target: taskModel.replaceFields,
  })
  sample({
    clock: attachUpdatePriorityQuery.finished.failure,
    fn: ({ params }) => {
      return { id: params.id, priority: params.data.priority }
    },
    target: taskModel.replaceFields,
  })

  //* Update task
  const updateTaskFx = createEffect(
    async ({
      task,
      fields,
    }: {
      task: Nullable<Task>
      fields: EditableTaskFields
    }) => {
      return taskToDomain(
        await taskApi.updateTaskMutation({
          id: task!.id,
          data: toApiTaskFields(fields),
        }),
      )
    },
  )
  sample({
    clock: updateTaskTriggered,
    source: {
      task: $task,
      fields: $fields,
    },
    filter: ({ task }) => !!task,
    target: updateTaskFx,
  })
  sample({
    clock: updateTaskTriggered,
    source: {
      task: $task,
      fields: $fields,
    },
    fn: ({ task, fields }) => ({ id: task!.id, fields }),
    target: taskModel.updateFields,
  })
  sample({
    clock: updateTaskFx.fail,
    fn: (p) => p.params.task!,
    target: taskModel.replaceTask,
  })

  sample({
    clock: updateTaskTriggered,
    target: resetFieldsTriggered,
  })

  sample({
    clock: init,
    fn: getTaskFields,
    target: setFieldsTriggered,
  })
  sample({
    clock: init,
    target: $task,
  })

  sample({
    clock: [
      //! attachUpdateTaskQuery.finished.success,
      attachUpdateStatusQuery.finished.success,
      attachUpdatePriorityQuery.finished.success,
      attachUpdateTaskDate.finished.success,
    ],
    target: resetFieldsTriggered,
  })
  return {
    updateTaskTriggeredById,
    updateTaskTriggered,
    statusChangedAndUpdated,
    dateChangedAndUpdated,
    priorityChangedAndUpdated,
    init,
    $task,
    ...$$taskEditor,
  }
}

export type TaskUpdater = ReturnType<typeof createTaskUpdater>
