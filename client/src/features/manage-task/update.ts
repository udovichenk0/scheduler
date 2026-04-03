import { createEffect, createEvent, createStore, sample } from "effector"

import { getTaskFields, taskToDomain } from "@/entities/task/lib"
import { EditableTaskFields, Task, Status, TaskId } from "@/entities/task/type"
import { createTaskEditor } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"

import { taskApi } from "@/shared/api/task/task.api.ts"
import { Priority } from "@/shared/api/scheduler.schemas"
import { SDate } from "@/shared/lib/date/lib"
import { ListId } from "@/entities/project/list/type"

export const createTaskUpdater = ({ taskModel }: { taskModel: TaskModel }) => {
  const taskEditor = createTaskEditor()
  const { resetFieldsTriggered, initTaskFields, $fields } = taskEditor

  const updateTaskTriggered = createEvent<Task>()
  const init = createEvent<Task>()

  const updateTaskMutation = taskApi.createUpdateTaskMutation()
  const updateTaskMutationFx = createEffect(updateTaskMutation)

  const optimisticUpdateStored = createEvent<{
    key: string
    previous: Partial<EditableTaskFields>
  }>()
  const optimisticUpdateCleared = createEvent<string>()

  const updateStatus = createEvent<{
    taskId: TaskId
    listId: ListId
    status: Status
  }>()

  const updateDate = createEvent<{
    taskId: TaskId
    listId: ListId
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }>()

  const updatePriority = createEvent<{
    taskId: TaskId
    listId: ListId
    priority: Priority
  }>()

  const $optimisticUpdates = createStore<
    Record<string, Partial<EditableTaskFields>>
  >({})

  const makeKey = (taskId: TaskId, listId: ListId) => `${listId}:${taskId}`

  const findTask = (
    tasksByListId: Record<ListId, Task[]>,
    taskId: TaskId,
    listId: ListId,
  ) => {
    const list = tasksByListId[listId]
    if (list) {
      return list.find((task) => task.id === taskId) ?? null
    }
    for (const tasks of Object.values(tasksByListId)) {
      const task = tasks.find((item) => item.id === taskId)
      if (task) return task
    }
    return null
  }

  sample({
    clock: optimisticUpdateStored,
    source: $optimisticUpdates,
    fn: (updates, { key, previous }) => ({ ...updates, [key]: previous }),
    target: $optimisticUpdates,
  })

  sample({
    clock: optimisticUpdateCleared,
    source: $optimisticUpdates,
    fn: (updates, key) => {
      if (!updates[key]) return updates
      const next = { ...updates }
      delete next[key]
      return next
    },
    target: $optimisticUpdates,
  })

  sample({
    clock: updateTaskTriggered,
    source: {
      fields: $fields,
      isDirty: taskEditor.$isDirty,
    },
    filter: ({ isDirty }) => isDirty,
    fn: ({ fields }, task) => {
      return {
        taskId: task.id,
        listId: task.list_id,
        data: {
          ...fields,
          start_date: fields.start_date?.toISOString() || null,
          due_date: fields.due_date?.toISOString() || null,
        },
      }
    },
    target: updateTaskMutationFx,
  })

  sample({
    clock: updateTaskTriggered,
    source: {
      fields: $fields,
      tasksByListId: taskModel.$tasksByListId,
      isDirty: taskEditor.$isDirty,
    },
    filter: ({ isDirty }) => isDirty,
    fn: ({ fields, tasksByListId }, task) => {
      const current = findTask(tasksByListId, task.id, task.list_id)
      return {
        taskId: task.id,
        listId: task.list_id,
        fields,
        previous: current
          ? {
              title: current.title,
              description: current.description,
              status: current.status,
              type: current.type,
              start_date: current.start_date,
              due_date: current.due_date,
              priority: current.priority,
            }
          : null,
      }
    },
    target: [
      taskModel.updateTaskFields.prepend(({ taskId, listId, fields }) => ({
        id: taskId,
        listId,
        fields,
      })),
      optimisticUpdateStored.prepend(({ taskId, listId, previous }) => ({
        key: makeKey(taskId, listId),
        previous: previous as Partial<EditableTaskFields>,
      })),
    ],
  })

  sample({
    clock: updateTaskMutationFx.doneData,
    fn: (task) => ({ task: taskToDomain(task) }),
    target: taskModel.replaceTask,
  })

  sample({
    clock: updateTaskMutationFx.done,
    fn: ({ params }) => makeKey(params.taskId, params.listId),
    target: optimisticUpdateCleared,
  })

  sample({
    clock: updateTaskMutationFx.fail,
    source: $optimisticUpdates,
    fn: (updates, { params }) => {
      const key = makeKey(params.taskId, params.listId)
      return {
        key,
        taskId: params.taskId,
        listId: params.listId,
        previous: updates[key] ?? null,
      }
    },
    filter: ({ previous }) => Boolean(previous),
    target: [
      taskModel.updateTaskFields.prepend(({ taskId, listId, previous }) => ({
        id: taskId,
        listId,
        fields: previous as Partial<EditableTaskFields>,
      })),
      optimisticUpdateCleared.prepend(({ key }) => key),
    ],
  })

  sample({
    clock: updateTaskTriggered,
    filter: taskEditor.$isDirty,
    target: [resetFieldsTriggered /*$task.reinit*/],
  })

  sample({
    clock: init,
    fn: getTaskFields,
    target: initTaskFields,
  })

  sample({
    clock: updateStatus,
    source: taskModel.$tasksByListId,
    fn: (tasksByListId, { taskId, listId, status }) => {
      const current = findTask(tasksByListId, taskId, listId)
      return {
        taskId,
        listId,
        fields: { status },
        previous: current ? { status: current.status } : null,
      }
    },
    filter: ({ previous }) => Boolean(previous),
    target: [
      taskModel.updateTaskFields.prepend(({ taskId, listId, fields }) => ({
        id: taskId,
        listId,
        fields,
      })),
      optimisticUpdateStored.prepend(({ taskId, listId, previous }) => ({
        key: makeKey(taskId, listId),
        previous: previous as Partial<EditableTaskFields>,
      })),
    ],
  })

  sample({
    clock: updatePriority,
    source: taskModel.$tasksByListId,
    fn: (tasksByListId, { taskId, listId, priority }) => {
      const current = findTask(tasksByListId, taskId, listId)
      return {
        taskId,
        listId,
        fields: { priority },
        previous: current ? { priority: current.priority } : null,
      }
    },
    filter: ({ previous }) => Boolean(previous),
    target: [
      taskModel.updateTaskFields.prepend(({ taskId, listId, fields }) => ({
        id: taskId,
        listId,
        fields,
      })),
      optimisticUpdateStored.prepend(({ taskId, listId, previous }) => ({
        key: makeKey(taskId, listId),
        previous: previous as Partial<EditableTaskFields>,
      })),
    ],
  })

  sample({
    clock: updateDate,
    source: taskModel.$tasksByListId,
    fn: (tasksByListId, { taskId, listId, startDate, dueDate }) => {
      const current = findTask(tasksByListId, taskId, listId)
      return {
        taskId,
        listId,
        fields: { start_date: startDate, due_date: dueDate },
        previous: current
          ? { start_date: current.start_date, due_date: current.due_date }
          : null,
      }
    },
    filter: ({ previous }) => Boolean(previous),
    target: [
      taskModel.updateTaskFields.prepend(({ taskId, listId, fields }) => ({
        id: taskId,
        listId,
        fields,
      })),
      optimisticUpdateStored.prepend(({ taskId, listId, previous }) => ({
        key: makeKey(taskId, listId),
        previous: previous as Partial<EditableTaskFields>,
      })),
    ],
  })

  sample({
    clock: updateStatus,
    fn: ({ taskId, listId, status }) => ({
      taskId,
      listId,
      data: { status },
    }),
    target: updateTaskMutationFx,
  })

  sample({
    clock: updatePriority,
    fn: ({ taskId, listId, priority }) => ({
      taskId,
      listId,
      data: { priority },
    }),
    target: updateTaskMutationFx,
  })

  sample({
    clock: updateDate,
    fn: ({ taskId, listId, startDate, dueDate }) => ({
      taskId,
      listId,
      data: {
        start_date: startDate?.toISOString() || null,
        due_date: dueDate?.toISOString() || null,
      },
    }),
    target: updateTaskMutationFx,
  })

  return {
    updateTaskTriggered,
    init,
    updateStatus,
    updatePriority,
    updateDate,
    ...taskEditor,
  }
}

export type TaskUpdater = ReturnType<typeof createTaskUpdater>
