import { createEvent, createStore, merge, sample } from "effector"
import { and } from "patronum"
import { attachOperation } from "@farfetched/core"

import {
  changeTaskStatus,
  findTaskById,
  getTaskFields,
  taskToDomain,
} from "@/entities/task/lib"
import { $$session } from "@/entities/session/session.model.ts"
import { EditableTaskFields, Task, Status } from "@/entities/task/type"
import { modifyTaskFactory } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api.ts"
import {
  TaskId,
  createUpdateDateDto,
  toApiTaskFields,
} from "@/shared/api/task/task.dto.ts"
import { SDate } from "@/shared/lib/date/lib"

export const updateTaskFactory = ({ taskModel }: { taskModel: TaskModel }) => {
  const $$modifyTask = modifyTaskFactory({})
  const {
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    setFieldsTriggered,
  } = $$modifyTask

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
  const init = createEvent<Task>()

  const attachUpdateStatusQuery = attachOperation(taskApi.updateStatusMutation)
  const attachUpdateTaskDate = attachOperation(taskApi.updateDateMutation)
  const attachUpdateTaskQuery = attachOperation(taskApi.updateTaskMutation)
  const $oldFields = createStore<Record<TaskId, EditableTaskFields>>({})
  const $id = createStore<Nullable<TaskId>>(null)

  const taskSuccessfullyUpdated = merge([
    attachUpdateTaskQuery.finished.success,
    // attachUpdateTaskFromLocalStorageFx.finished.success,
  ])

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
    target: taskModel.taskReplaced,
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
    source: taskModel.$tasks,
    filter: Boolean,
    fn: (tasks, params) => {
      const status = changeTaskStatus(params.status)
      return tasks.map((task) =>
        task.id == params.id ? { ...task, status } : task,
      )
    },
    target: taskModel.setTasksTriggered,
  })
  sample({
    clock: attachUpdateStatusQuery.finished.failure,
    source: taskModel.$tasks,
    filter: Boolean,
    fn: (tasks, { params }) => {
      const status = changeTaskStatus(params.data.status)
      return tasks.map((task) =>
        task.id == params.id ? { ...task, status } : task,
      )
    },
    target: taskModel.setTasksTriggered,
  })

  //* Update task
  sample({
    clock: updateTaskTriggered,
    source: { tasks: taskModel.$tasks, oldFields: $oldFields, id: $id },
    filter: and(
      $$session.$isAuthenticated,
      taskModel.$tasks,
      $isAllowToSubmit,
      $id,
    ),
    fn: ({ tasks, oldFields: pendUpdates, id: taskId }) => {
      const task = findTaskById(tasks!, taskId!)
      const fields = getTaskFields(task)
      return { ...pendUpdates, [taskId!]: { ...fields } }
    },
    target: $oldFields,
  })
  sample({
    clock: updateTaskTriggered,
    source: { id: $id, fields: $fields },
    filter: and(
      $$session.$isAuthenticated,
      taskModel.$tasks,
      $isAllowToSubmit,
      $id,
    ),
    fn: ({ id: taskId, fields }) => ({
      id: taskId!,
      fields,
    }),
    target: taskModel.updateFields,
  })
  sample({
    clock: updateTaskTriggered,
    source: { id: $id, fields: $fields },
    filter: and(
      $$session.$isAuthenticated,
      taskModel.$tasks,
      $isAllowToSubmit,
      $id,
    ),
    fn: ({ fields, id }) => ({ data: toApiTaskFields(fields), id: id! }),
    target: attachUpdateTaskQuery.start,
  })
  sample({
    clock: updateTaskTriggered,
    target: resetFieldsTriggered,
  })
  sample({
    clock: attachUpdateTaskQuery.finished.success,
    source: $oldFields,
    fn: (updates, { result }) =>
      Object.fromEntries(
        Object.entries(updates).filter(([key]) => result.id != key),
      ),
    target: $oldFields,
  })
  // sample({
  //   clock: attachUpdateTaskQuery.finished.success,
  //   source: taskModel.$tasks,
  //   fn: (tasks, { params, result }) => {
  //     const tempId = params.id
  //     return tasks!.map((task) => task.id == tempId ? {...task, ...taskToDomain(result)} : task)
  //   },
  //   target: taskModel.setTasksTriggered
  // })

  sample({
    clock: attachUpdateTaskQuery.finished.failure,
    source: $oldFields,
    fn: (fields, { params }) => {
      const oldFields = fields[params.id]
      return {
        fields: oldFields,
        id: params.id,
      }
    },
    target: taskModel.updateFields,
  })

  sample({
    clock: init,
    fn: getTaskFields,
    target: setFieldsTriggered,
  })
  sample({
    clock: init,
    fn: (task) => task.id,
    target: $id,
  })

  sample({
    clock: [
      attachUpdateTaskQuery.finished.success,
      attachUpdateStatusQuery.finished.success,
      attachUpdateTaskDate.finished.success,
    ],
    target: resetFieldsTriggered,
  })
  return {
    updateTaskTriggeredById,
    updateTaskTriggered,
    taskSuccessfullyUpdated,
    statusChangedAndUpdated,
    dateChangedAndUpdated,
    init,
    $isUpdating: taskApi.updateTaskMutation.$pending,
    $id,
    ...$$modifyTask,
  }
}
export type UpdateTaskFactory = ReturnType<typeof updateTaskFactory>
