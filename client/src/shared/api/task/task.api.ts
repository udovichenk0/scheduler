import { zodContract } from "@farfetched/zod"
import { z } from "zod"

import { authQuery } from "@/shared/lib/auth-query"

import { TaskDto, taskDtoSchema, tasksDtoSchema } from "./task.dto"

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
  status: "FINISHED" | "CANCELED" | "INPROGRESS"
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
