import { createMutation, createQuery } from "@farfetched/core"

import {
  deleteTasks,
  deleteTasksId,
  getListsIdTasks,
  postTasks,
  postTasksIdTrash,
  putListsListIdTasksTaskId,
  putTasksId,
} from "../scheduler"
import { handleResponse, throwIfError } from "../lib"
import {
  getListsIdTasksResponse,
  postTasksResponse,
  putListsListIdTasksTaskIdResponse,
  putTasksIdResponse,
} from "../zod"
import { PutListsListIdTasksTaskIdBody, TaskFields } from "../scheduler.schemas"

import { TaskId } from "./task.dto"
import { ListId } from "@/entities/project/list/type"

const tasksByListIdQuery = createQuery({
  handler: async (listId: string) => {
    const response = await getListsIdTasks(listId, { credentials: "include" })
    return handleResponse(response, getListsIdTasksResponse)
  },
})

const createTaskMutation = () =>
  createMutation({
    handler: async (data: TaskFields) => {
      const response = await postTasks(data, { credentials: "include" })
      return handleResponse(response, postTasksResponse)
    },
  })

const taskMutationHandler = async (data: TaskFields) => {
  const response = await postTasks(data, { credentials: "include" })
  return handleResponse(response, postTasksResponse)
}

const createUpdateTaskMutation =
  () =>
  async ({
    listId,
    taskId,
    data,
  }: {
    listId: ListId
    taskId: TaskId
    data: PutListsListIdTasksTaskIdBody
  }) => {
    const response = await putListsListIdTasksTaskId(listId, taskId, data, {
      credentials: "include",
    })
    return handleResponse(response, putListsListIdTasksTaskIdResponse)
  }

const trashTaskMutation = () =>
  createQuery({
    handler: async (taskId: TaskId) => {
      const response = await postTasksIdTrash(taskId, {
        credentials: "include",
      })
      throwIfError(response.data)
    },
  })

const deleteTrashedTaskMutation = () =>
  createQuery({
    handler: async ({ taskId }: { taskId: TaskId }) => {
      const response = await deleteTasksId(taskId, { credentials: "include" })
      throwIfError(response.data)
    },
  })

const deleteTrashedTasksMutation = () =>
  createQuery({
    handler: async () => {
      const response = await deleteTasks({ credentials: "include" })
      throwIfError(response.data)
    },
  })

export const taskApi = {
  tasksByListIdQuery,
  createTaskMutation,
  taskMutationHandler,
  createUpdateTaskMutation,
  trashTaskMutation,
  deleteTrashedTaskMutation,
  deleteTrashedTasksMutation,
}
