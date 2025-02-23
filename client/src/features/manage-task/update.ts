import { dateToUnix } from '@/shared/lib/date/date-to-unix';
import { createEvent, createStore, merge, sample } from "effector"
import { and } from "patronum"
import { attachOperation } from "@farfetched/core"

import { changeTaskStatus, findTaskById, getTaskFields, taskToDomain } from "@/entities/task/lib"
import { $$session } from "@/entities/session"

import { taskApi, TaskId } from "@/shared/api/task"
import { modifyTaskFactory, TaskModel } from "@/entities/task"
import { EditableTaskFields, Task, TaskStatus } from '@/entities/task/type';
import { toApiTaskFields } from '@/shared/api/task/task.dto';

export const updateTaskFactory = ({ taskModel }:{ taskModel: TaskModel }) => {
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
    status: TaskStatus
  }>()
  const dateChangedAndUpdated = createEvent<{ id: TaskId; date: Date }>()
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
    fn: ({ date, id }) => ({ start_date: dateToUnix(date), id }), //! Think about dto from apis layer, then use them like fn: updateTaskDateDto
    target: attachUpdateTaskDate.start,
  })
  sample({
    clock: attachUpdateTaskDate.finished.success,
    filter: Boolean,
    fn: ({ result }) => taskToDomain(result),
    target: taskModel.taskReplaced
  })

  //* Update task status
  sample({
    clock: statusChangedAndUpdated,
    filter: $$session.$isAuthenticated,
    fn: ({ id, status }) => {
      return {id, data: {status: changeTaskStatus(status)}}
    },
    target: attachUpdateStatusQuery.start,
  })
  sample({
    clock: statusChangedAndUpdated,
    source: taskModel.$tasks,
    filter: Boolean,
    fn: (tasks, params) => {
      const status = changeTaskStatus(params.status)
      return tasks.map((task) => task.id == params.id ? {...task, status} : task)
    },
    target: taskModel.setTasksTriggered
  })
  sample({
    clock: attachUpdateStatusQuery.finished.failure,
    source: taskModel.$tasks,
    filter: Boolean,
    fn: (tasks, {params}) => {
      const status = changeTaskStatus(params.data.status)
      return tasks.map((task) => task.id == params.id ? {...task, status} : task)
    },
    target: taskModel.setTasksTriggered
  })


  //* Update task
  sample({
    clock: updateTaskTriggered,
    source: {tasks: taskModel.$tasks, oldFields: $oldFields, id: $id},
    filter: and($$session.$isAuthenticated, taskModel.$tasks, $isAllowToSubmit, $id),
    fn:  ({tasks, oldFields: pendUpdates, id: taskId}) => {
      const task = findTaskById(tasks!, taskId!)
      const fields = getTaskFields(task)
      return {...pendUpdates, [taskId!]: {...fields}}
    },
    target: $oldFields
  })
  sample({
    clock: updateTaskTriggered,
    source: {id: $id, fields: $fields},
    filter: and($$session.$isAuthenticated, taskModel.$tasks, $isAllowToSubmit, $id),
    fn: ({id: taskId, fields}) => ({
      id: taskId!,
      fields
    }),
    target: taskModel.updateFields
  })
  sample({
    clock: updateTaskTriggered,
    source: {id: $id, fields: $fields},
    filter: and($$session.$isAuthenticated, taskModel.$tasks, $isAllowToSubmit, $id),
    fn: ({ fields, id }) => ({ data: toApiTaskFields(fields), id: id! }),
    target: attachUpdateTaskQuery.start,
  })
  sample({
    clock: updateTaskTriggered,
    target: resetFieldsTriggered
  })
  sample({
    clock: attachUpdateTaskQuery.finished.success,
    source: $oldFields,
    fn: (updates, { result }) => Object.fromEntries(Object.entries(updates).filter(([key]) => result.id != key)),
    target: $oldFields
  })
  sample({
    clock: attachUpdateTaskQuery.finished.failure,
    source: $oldFields,
    fn: (fields, { params }) => {
      const oldFields = fields[params.id]
      return {
        fields: oldFields,
        id: params.id
      }
    },
    target: taskModel.updateFields
  })



  sample({
    clock: init,
    fn: getTaskFields,
    target: setFieldsTriggered
  })
  sample({
    clock: init,
    fn: (task) => task.id,
    target: $id
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
