import { createEvent, createStore, sample } from "effector"
import * as z from "zod/mini"

import { taskApi } from "@/shared/api/task/task.api.ts"
import { TaskId } from "@/shared/api/task/task.dto.ts"
import { cookiePersist } from "@/shared/lib/storage/cookie-persist.ts"

import { EditableTaskFields, Task } from "../type"
import { deleteById, tasksToDomain } from "../lib"
import { ListId } from "@/entities/project/list/type"

export const TaskType = {
  INBOX: "inbox",
  UNPLACED: "unplaced",
} as const

export const TaskPriority = {
  NONE: "none",
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const

export const TaskStatus = {
  //!FIX rename
  INPROGRESS: "inprogress",
  FINISHED: "finished",
  TODO: "todo",
} as const

export const createTaskModel = () => {
  const $tasksByListId = createStore<Record<ListId, Task[]>>({})

  const addTask = createEvent<Task>()
  const appendTasks = createEvent<Task[]>()
  const setTasks = createEvent<Task[]>()

  const setTasksByListId = createEvent<{ listId: ListId; tasks: Task[] }>()
  const removeTask = createEvent<{ taskId: TaskId; listId: ListId } | TaskId>()

  const replaceTask = createEvent<{ task: Task; previousId?: TaskId }>()
  const replaceFields = createEvent<Partial<Task> & { id: TaskId }>()

  const updateTaskFields = createEvent<{
    id: TaskId
    listId: ListId
    fields: Partial<EditableTaskFields>
  }>()
  const reset = createEvent()

  const toggleCompletedShown = createEvent()
  const $isCompletedShown = createStore(0).on(toggleCompletedShown, (isShown) =>
    Number(!isShown),
  )

  function hasTasksForList(tasksByListId: Record<ListId, Task[]>, task: Task) {
    return !!tasksByListId[task.list_id]
  }
  sample({
    clock: addTask,
    source: $tasksByListId,
    filter: hasTasksForList,
    fn: (tasks, task) => {
      return { ...tasks, [task.list_id]: [...tasks[task.list_id], task] }
    },
    target: $tasksByListId,
  })

  sample({
    clock: appendTasks,
    source: $tasksByListId,
    filter: Boolean,
    fn: (tasksByListId, tasks) => {
      const next = { ...tasksByListId }
      for (const task of tasks) {
        const listId = task.list_id
        if (!next[listId]) continue
        const list = next[listId]
        next[listId] = list.some((item) => item.id === task.id)
          ? list.map((item) => (item.id === task.id ? task : item))
          : [...list, task]
      }
      return next
    },
    target: $tasksByListId,
  })

  sample({
    clock: removeTask,
    source: $tasksByListId,
    fn: (tasksByListId, payload) => {
      const { taskId, listId } =
        typeof payload === "string"
          ? {
              taskId: payload,
              listId: findListIdByTaskId(tasksByListId, payload),
            }
          : payload
      if (!listId) return tasksByListId
      const tasks = tasksByListId[listId]
      if (!tasks) return tasksByListId
      return {
        ...tasksByListId,
        [listId]: deleteById(tasks, taskId),
      }
    },
    target: $tasksByListId,
  })

  function findListIdByTaskId(
    tasksByListId: Record<ListId, Task[]>,
    taskId: TaskId,
  ) {
    for (const [listId, tasks] of Object.entries(tasksByListId)) {
      if (tasks.some((task) => task.id === taskId)) {
        return listId as ListId
      }
    }
    return null
  }

  sample({
    clock: replaceFields,
    source: $tasksByListId,
    fn: (tasksByListId, { id, ...fields }) => {
      const listId = findListIdByTaskId(tasksByListId, id)
      if (!listId) return tasksByListId
      const tasks = tasksByListId[listId]
      if (!tasks) return tasksByListId
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, ...fields } : task,
      )
      return { ...tasksByListId, [listId]: updatedTasks }
    },
    target: $tasksByListId,
  })

  sample({
    clock: updateTaskFields,
    source: $tasksByListId,
    filter: Boolean,
    fn: (tasksByListId, { id, listId, fields }) => {
      const targetListId = tasksByListId[listId]
        ? listId
        : findListIdByTaskId(tasksByListId, id)
      if (!targetListId) return tasksByListId
      const tasks = tasksByListId[targetListId]
      if (!tasks) return tasksByListId
      const updatedtasks = tasks.map((task) =>
        task.id == id ? { ...task, ...fields } : task,
      )
      return { ...tasksByListId, [targetListId]: updatedtasks }
    },
    target: $tasksByListId,
  })

  sample({
    clock: setTasks,
    fn: (tasks) => {
      return tasks.reduce<Record<ListId, Task[]>>((acc, task) => {
        if (!acc[task.list_id]) {
          acc[task.list_id] = []
        }
        acc[task.list_id].push(task)
        return acc
      }, {})
    },
    target: $tasksByListId,
  })

  sample({
    clock: setTasksByListId,
    source: $tasksByListId,
    fn: (tasksByListId, { listId, tasks }) => {
      return { ...tasksByListId, [listId]: tasks }
    },
    target: $tasksByListId,
  })

  sample({
    clock: replaceTask,
    source: $tasksByListId,
    fn: (tasksByListId, { task, previousId }) => {
      const idToFind = previousId ?? task.id
      const currentListId = findListIdByTaskId(tasksByListId, idToFind)

      if (currentListId) {
        if (currentListId === task.list_id) {
          const updatedTasks = tasksByListId[currentListId].map((item) =>
            item.id === idToFind ? task : item,
          )
          return { ...tasksByListId, [currentListId]: updatedTasks }
        }

        const updatedCurrent = tasksByListId[currentListId].filter(
          (item) => item.id !== idToFind,
        )
        const next = { ...tasksByListId, [currentListId]: updatedCurrent }
        if (tasksByListId[task.list_id]) {
          next[task.list_id] = [...tasksByListId[task.list_id], task]
        }
        return next
      }

      const targetList = tasksByListId[task.list_id]
      if (!targetList) return tasksByListId

      const hasTask = targetList.some((item) => item.id === task.id)
      const updatedTasks = hasTask
        ? targetList.map((item) => (item.id === task.id ? task : item))
        : [...targetList, task]

      return { ...tasksByListId, [task.list_id]: updatedTasks }
    },
    target: $tasksByListId,
  })

  // sample({
  //   clock: reset,
  //   target: [$tasks.reinit],
  // })
  sample({
    clock: reset,
    target: [$tasksByListId.reinit],
  })

  const init = cookiePersist({
    source: $isCompletedShown,
    name: "isCompletedShown",
    schema: z.coerce.number(),
  })

  sample({
    clock: taskApi.tasksByListIdQuery.finished.success,
    fn: ({ result, params: listId }) => ({
      listId,
      tasks: tasksToDomain(result),
    }),
    target: setTasksByListId,
  })

  return {
    // $tasks,
    $tasksByListId,
    $isCompletedShown: $isCompletedShown.map(Boolean),
    toggleCompletedShown,
    addTask,
    appendTasks,
    setTasks,
    setTasksByListId,
    removeTask,
    replaceTask,
    updateTaskFields,
    replaceFields,
    init,
    reset,
  }
}

const $$taskModel = createTaskModel()

export function getTaskModelInstance() {
  return $$taskModel
}

export type TaskModel = typeof $$taskModel
