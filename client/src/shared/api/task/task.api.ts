import { zodContract } from "@farfetched/zod"
import { z } from "zod"
import { createEffect } from "effector"
import { v4 as uuidv4 } from "uuid"

import { authQuery } from "@/shared/api/auth-query"
import { parseDto } from "@/shared/lib/parse-dto"

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
  TaskType,
  LocalStorageTasksDto,
} from "./task.dto"

const TaskContract = zodContract(TaskSchemaDto)
export const createTaskQuery = authQuery<TaskDto, { body: CreateTaskDto }>({
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
export const getTasksQuery = authQuery<TaskDto[], void>({
  request: {
    url: "tasks/get",
    method: "GET",
  },
  response: {
    contract: GetTasksContract,
    mapData: (data) => data.result,
  },
})

export const updateTaskQuery = authQuery<TaskDto, { body: UpdateTaskDto }>({
  request: {
    url: "tasks/update",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const updateStatusQuery = authQuery<TaskDto, { body: UpdateStatusDto }>({
  request: {
    url: "tasks/update-status",
    method: "POST",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const deleteTaskQuery = authQuery<TaskDto, { body: { id: TaskId } }>({
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
export const createTasksQuery = authQuery<
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

export const updateDateQuery = authQuery<
  TaskDto,
  { body: { id: TaskId; date: Date, type: TaskType } }
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
    return parseDto(LocalStorageTasksDto, result)
  }
  return []
})
export const deleteTasksFromLocalStorageFx = createEffect(() => {
  localStorage.removeItem("tasks")
})

export const setTaskToLocalStorageFx = createEffect(
  ({ body }: { body: CreateTaskDto }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const task = { ...body, id: uuidv4(), user_id: null, date_created: new Date() }
    const parsedTask = parseDto(LocalStorageTaskDto, task)

    const tasks = JSON.parse(tasksFromLs!)
    localStorage.setItem("tasks", JSON.stringify([...(tasks || []), parsedTask]))

    return {
      result: parsedTask,
    }
  },
)

function updateTask(
  tasks: LocalStorageTaskDto[],
  id: TaskId,
  data: CreateTaskDto,
) {
  const updatedTasks = tasks.map((task: LocalStorageTaskDto) =>
    task.id === id ? { ...task, ...data } : task,
  )
  const updatedTask = updatedTasks.find((task) => task.id === id)

  return {
    updatedTasks,
    updatedTask,
  }
}
export const updateTaskFromLocalStorageFx = createEffect(
  async ({ id, data }: { id: TaskId; data: CreateTaskDto }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)

    const { updatedTasks, updatedTask } = updateTask(parsedTasks, id, data)
    const parsedTask = parseDto(LocalStorageTaskDto, updatedTask!)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: parsedTask,
    }
  },
)

export const updateDateInLocalStorageFx = createEffect(
  ({ date, type, id }: { date: Date; id: TaskId, type: TaskType }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]
    const updatedTasks = parsedTasks.map((task: LocalStorageTaskDto) =>
      task.id === id ? { ...task, start_date: date, type } : task,
    )
    const updatedTask = updatedTasks.find((task) => task.id === id)
    const parsedTask = parseDto(LocalStorageTaskDto, updatedTask!)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: parsedTask,
    }
  },
)

function updateTaskStatus(
  tasks: LocalStorageTaskDto[],
  id: TaskId,
  status: TaskStatus,
) {
  const updatedTasks = tasks.map((task) =>
    task.id === id ? { ...task, status } : task,
  )

  const updatedTask = updatedTasks.find((task) => task.id === id)

  return {
    updatedTask,
    updatedTasks,
  }
}

export const updateStatusInLocalStorageFx = createEffect(
  ({ id, status }: { id: TaskId; status: TaskStatus }) => {
    const tasks = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasks!) as LocalStorageTaskDto[]

    const { updatedTasks, updatedTask } = updateTaskStatus(
      parsedTasks,
      id,
      status,
    )
    const parsedTask = parseDto(LocalStorageTaskDto, updatedTask!)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: parsedTask,
    }
  },
)

function deleteTask(tasks: LocalStorageTaskDto[], id: TaskId) {
  const updatedTasks = tasks.filter((task) => task.id !== id)

  const deletedTask = tasks.find((task) => task.id === id)
  
  return {
    updatedTasks,
    deletedTask,
  }
}

export const deleteTaskFromLocalStorageFx = createEffect((id: TaskId) => {
  const tasksFromLs = localStorage.getItem("tasks")
  const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]

  const { updatedTasks, deletedTask } = deleteTask(parsedTasks, id)
  if (updatedTasks.length) {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  } else {
    localStorage.removeItem("tasks")
  }

  return {
    result: deletedTask!,
  }
})
