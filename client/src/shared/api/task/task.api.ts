import { createQuery } from "@farfetched/core"

import {
  deleteTasks,
  deleteTasksId,
  getTasks,
  patchTasksIdDate,
  patchTasksIdPriority,
  patchTasksIdStatus,
  postTasks,
  postTasksIdTrash,
  putTasksId,
} from "../scheduler"
import { handleResponse, throwIfError } from "../lib"
import {
  getTasksResponse,
  patchTasksIdDateResponse,
  postTasksResponse,
  putTasksIdResponse,
} from "../zod"
import {
  DueDate,
  PatchTasksIdStatusBody,
  StartDate,
  TaskFields,
  PatchTasksIdPriorityBody,
} from "../scheduler.schemas"

import { TaskId } from "./task.dto"

export const tasksQuery = createQuery({
  handler: async () => {
    const response = await getTasks({ credentials: "include" })
    return handleResponse(response, getTasksResponse)
  },
})

export const createTaskMutation = createQuery({
  handler: async (data: TaskFields) => {
    const response = await postTasks(data, { credentials: "include" })
    return handleResponse(response, postTasksResponse)
  },
})

export const updateTaskMutation = createQuery({
  handler: async ({ id, data }: { id: TaskId; data: TaskFields }) => {
    const response = await putTasksId(id, data, { credentials: "include" })
    return handleResponse(response, putTasksIdResponse)
  },
})

export const updateStatusMutation = createQuery({
  handler: async ({
    id,
    data,
  }: {
    id: TaskId
    data: PatchTasksIdStatusBody
  }) => {
    const response = await patchTasksIdStatus(id, data, {
      credentials: "include",
    })
    throwIfError(response.data)
  },
})

const updatePriorityMutation = createQuery({
  handler: async ({
    id,
    data,
  }: {
    id: TaskId
    data: PatchTasksIdPriorityBody
  }) => {
    const response = await patchTasksIdPriority(id, data, {
      credentials: "include",
    })
    throwIfError(response.data)
  },
})

export const trashTaskMutation = createQuery({
  handler: async (taskId: TaskId) => {
    const response = await postTasksIdTrash(taskId, { credentials: "include" })
    throwIfError(response.data)
  },
})

export const deleteTrashedTaskMutation = createQuery({
  handler: async ({ taskId }: { taskId: TaskId }) => {
    const response = await deleteTasksId(taskId, { credentials: "include" })
    throwIfError(response.data)
  },
})

export const deleteTrashedTasksMutation = createQuery({
  handler: async () => {
    const response = await deleteTasks({ credentials: "include" })
    throwIfError(response.data)
  },
})
export const updateDateMutation = createQuery({
  handler: async ({
    id,
    start_date,
    due_date,
  }: {
    id: TaskId
    start_date: StartDate
    due_date: DueDate
  }) => {
    const response = await patchTasksIdDate(
      id,
      { start_date, due_date },
      { credentials: "include" },
    )
    return handleResponse(response, patchTasksIdDateResponse)
  },
})

export const taskApi = {
  tasksQuery,
  createTaskMutation,
  updateTaskMutation,
  updateStatusMutation,
  updatePriorityMutation,
  trashTaskMutation,
  deleteTrashedTaskMutation,
  deleteTrashedTasksMutation,
  updateDateMutation,
}
