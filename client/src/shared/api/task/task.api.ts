import { zodContract } from "@farfetched/zod"
import { z } from "zod"
import { createEffect } from "effector"
import { v4 as uuidv4 } from "uuid"

import { authQuery } from "@/shared/api/auth-query"

import {
  TaskDto,
  TaskStatus,
  TaskType,
  taskDtoSchema,
  tasksDtoSchema,
} from "./task.dto"

const createTaskContract = zodContract(taskDtoSchema)

type CreateTaskParamsType = {
  title: string
  description: Nullable<string>
  status: "FINISHED" | "CANCELED" | "INPROGRESS"
  type: "inbox" | "unplaced"
  start_date: Nullable<Date>
}

export const createTaskQuery = authQuery<
  TaskDto,
  { body: CreateTaskParamsType }
>({
  request: {
    url: "tasks/create",
    method: "POST",
  },
  response: {
    contract: createTaskContract,
    mapData: (data) => data.result,
  },
})

const tasksQueryContract = zodContract(tasksDtoSchema)

export const tasksQuery = authQuery<TaskDto[], void>({
  request: {
    url: "tasks/get",
    method: "GET",
  },
  response: {
    contract: tasksQueryContract,
    mapData: (data) => data.result,
  },
})

const updateTaskContract = zodContract(taskDtoSchema)
type UpdateTaskParams = {
  id: string
  title: string
  description: Nullable<string>
  status: "FINISHED" | "INPROGRESS"
  type: "inbox" | "unplaced"
  start_date: Nullable<Date>
}

export const updateTaskQuery = authQuery<TaskDto, { body: UpdateTaskParams }>({
  request: {
    url: "tasks/update",
    method: "POST",
  },
  response: {
    contract: updateTaskContract,
    mapData: (data) => data.result,
  },
})

const updateStatusContract = zodContract(taskDtoSchema)

type UpdateStatusParams = {
  id: string
  status: "FINISHED" | "INPROGRESS"
}

export const updateStatusQuery = authQuery<
  TaskDto,
  { body: UpdateStatusParams }
>({
  request: {
    url: "tasks/update-status",
    method: "POST",
  },
  response: {
    contract: updateStatusContract,
    mapData: (data) => data.result,
  },
})

export const deleteTaskQuery = authQuery<TaskDto, { body: { id: string } }>({
  request: {
    url: "tasks/delete",
    method: "POST",
  },
  response: {
    contract: updateStatusContract,
    mapData: (data) => data.result,
  },
})
type CreateManyTasks = {
  tasks: {
    id: string
    title: string
    description: string
    status: "FINISHED" | "INPROGRESS"
    type: "inbox" | "unplaced"
    start_date: Nullable<Date>
  }[]
  user_id: string
}
const CreateManyTasksContract = z.object({
  count: z.number(),
})
const CreateManyTasksZodContract = zodContract(CreateManyTasksContract)
export const createManyTasksQuery = authQuery<
  { count: number },
  { body: CreateManyTasks }
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

export const updateTaskDate = authQuery<
  TaskDto,
  { body: { id: string; date: Date } }
>({
  request: {
    url: "tasks/update-date",
    method: "PATCH",
  },
  response: {
    contract: updateStatusContract,
    mapData: (data) => data.result,
  },
})

type TasksFromLS = {
  id: string
  title: string
  description: string
  status: "FINISHED" | "INPROGRESS"
  type: "inbox" | "unplaced"
  start_date: Date | null
  user_id: null
}
export const getTasksFromLsFx = createEffect(() => {
  const tasks = localStorage.getItem("tasks")
  if (tasks) {
    const result = JSON.parse(tasks) as TasksFromLS[]
    return result
  }
  return []
})
export const deleteTasksFromlsFx = createEffect(() => {
  localStorage.removeItem("tasks")
})

type TaskCredentials = {
  description: string
  title: string
  type: "unplaced" | "inbox"
  status: "INPROGRESS" | "FINISHED"
  start_date: Nullable<Date>
}
export const setTaskToLocalStorageFx = createEffect(
  ({ body }: { body: TaskCredentials }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    if (tasksFromLs) {
      const tasks = JSON.parse(tasksFromLs)
      const task = { ...body, id: uuidv4(), user_id: null }
      localStorage.setItem("tasks", JSON.stringify([...tasks, task]))
      return {
        result: task as TasksFromLS,
      }
    } else {
      const task = { ...body, id: uuidv4() }
      localStorage.setItem("tasks", JSON.stringify([task]))
      return {
        result: task as TasksFromLS,
      }
    }
  },
)

export const updateTaskDateFromLsFx = createEffect(
  ({ date, id }: { date: Date; id: string }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!) as TasksFromLS[]
    const updatedTasks = parsedTasks.map((task: TasksFromLS) =>
      task.id === id ? { ...task, start_date: date } : task,
    )
    const updatedTask = updatedTasks.find((task) => task.id === id)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: updatedTask,
    }
  },
)
export const updateStatusFromLocalStorageFx = createEffect(
  ({ id, status }: { id: string; status: TaskStatus }) => {
    const tasks = localStorage.getItem("tasks")
    const updatedTasks = (JSON.parse(tasks!) as TasksFromLS[]).map((task) =>
      task.id === id ? { ...task, status } : task,
    )
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    const updatedTask = updatedTasks.find((task) => task.id === id)
    return {
      result: updatedTask,
    }
  },
)
type Cred = {
  id: string
  title: string
  description: string
  status: TaskStatus
  type: TaskType
  start_date: Nullable<Date>
}
export const updateTaskFromLocalStorageFx = createEffect(async (cred: Cred) => {
  const tasksFromLs = localStorage.getItem("tasks")
  const parsedTasks = JSON.parse(tasksFromLs!)
  const updatedTasks = parsedTasks.map((task: TasksFromLS) =>
    task.id === cred.id ? cred : task,
  )
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  return {
    result: {
      ...cred,
      user_id: null,
    },
  }
})

export const deleteTaskFromLsFx = createEffect((id: string) => {
  const tasksFromLs = localStorage.getItem("tasks")
  const parsedTasks = JSON.parse(tasksFromLs!) as TasksFromLS[]

  const filteredTasks = parsedTasks.filter((task) => task.id !== id)

  localStorage.setItem("tasks", JSON.stringify(filteredTasks))
  const deletedTask = parsedTasks.find((task) => task.id === id)

  return {
    result: deletedTask!,
  }
})
