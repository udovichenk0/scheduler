import { zodContract } from "@farfetched/zod"
import { z } from "zod"
import { createEffect } from "effector"
import { v4 as uuidv4 } from "uuid"

import { authQuery } from "@/shared/api/auth-query"

import {
  TaskDto,
  TaskStatus,
  TaskSchemaDto,
  TasksSchemaDto,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateStatusDto,
  TaskId,
  LocalStorageTaskDto,
} from "./task.dto"

const TaskContract = zodContract(TaskSchemaDto)
export const createTask = authQuery<TaskDto, { body: CreateTaskDto }>({
  request: {
    url: "tasks/create",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

const GetTasksContract = zodContract(TasksSchemaDto)
export const getTasks = authQuery<TaskDto[], void>({
  request: {
    url: "tasks/get",
    method: "GET",
  },
  response: {
    contract: GetTasksContract,
    mapData: (data) => data.result,
  },
})

export const updateTask = authQuery<TaskDto, { body: UpdateTaskDto }>({
  request: {
    url: "tasks/update",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const updateStatus = authQuery<TaskDto, { body: UpdateStatusDto }>({
  request: {
    url: "tasks/update-status",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const deleteTask = authQuery<TaskDto, { body: { id: TaskId } }>({
  request: {
    url: "tasks/delete",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

const CreateManyTasksSchemaDto = z.object({
  count: z.number(),
})
const CreateManyTasksZodContract = zodContract(CreateManyTasksSchemaDto)
export const createTasks = authQuery<
  { count: number },
  { body: { tasks: CreateTaskDto[] } }
>({
  request: {
    url: "tasks/create-many",
    method: "POST",
  },
  response: {
    contract: CreateManyTasksZodContract,
    mapData: (data) => data.result,
  },
})

export const updateDate = authQuery<
  TaskDto,
  { body: { id: TaskId; date: Date } }
>({
  request: {
    url: "tasks/update-date",
    method: "PATCH",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const getTasksFromLocalStorageFx = createEffect(() => {
  const tasks = localStorage.getItem("tasks")
  if (tasks) {
    const result = JSON.parse(tasks) as LocalStorageTaskDto[]
    return result
  }
  return []
})
export const deleteTasksFromLocalStorageFx = createEffect(() => {
  localStorage.removeItem("tasks")
})

export const setTaskToLocalStorageFx = createEffect(
  ({ body }: { body: CreateTaskDto }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    if (tasksFromLs) {
      const tasks = JSON.parse(tasksFromLs)
      const task = { ...body, id: uuidv4(), user_id: null }
      localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
      return {
        result: task as LocalStorageTaskDto,
      }
    } else {
      const task = { ...body, id: uuidv4() }
      localStorage.setItem("tasks", JSON.stringify([task]))
      return {
        result: task as LocalStorageTaskDto,
      }
    }
  },
)
export const updateTaskFromLocalStorageFx = createEffect(
  async ({ id, data }: { id: TaskId; data: CreateTaskDto }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)

    const updatedTasks = parsedTasks.map((task: LocalStorageTaskDto) =>
      task.id === id ? { id, ...data } : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    return {
      result: {
        ...data,
        id,
        user_id: null,
      },
    }
  },
)

export const updateDateInLocalStorageFx = createEffect(
  ({ date, id }: { date: Date; id: TaskId }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]
    const updatedTasks = parsedTasks.map((task: LocalStorageTaskDto) =>
      task.id === id ? { ...task, start_date: date } : task,
    )
    const updatedTask = updatedTasks.find((task) => task.id === id)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: updatedTask!,
    }
  },
)
export const updateStatusInLocalStorageFx = createEffect(
  ({ id, status }: { id: TaskId; status: TaskStatus }) => {
    const tasks = localStorage.getItem("tasks")
    const updatedTasks = (JSON.parse(tasks!) as LocalStorageTaskDto[]).map(
      (task) => (task.id === id ? { ...task, status } : task),
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    const updatedTask = updatedTasks.find((task) => task.id === id)
    return {
      result: updatedTask,
    }
  },
)

export const deleteTaskFromLocalStorageFx = createEffect((id: TaskId) => {
  const tasksFromLs = localStorage.getItem("tasks")
  const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]

  const filteredTasks = parsedTasks.filter((task) => task.id !== id)

  localStorage.setItem("tasks", JSON.stringify(filteredTasks))
  const deletedTask = parsedTasks.find((task) => task.id === id)

  return {
    result: deletedTask!,
  }
})
