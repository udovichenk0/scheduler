import { zodContract } from "@farfetched/zod"
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
    mapData: (data) => data,
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
    mapData: (data) => data,
  },
})

const updateTaskContract = zodContract(taskDtoSchema)
type UpdateTaskParams = {
  id: number
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
    mapData: (data) => data,
  },
})

const updateStatusContract = zodContract(taskDtoSchema)

type UpdateStatusParams = {
  id: number
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
    mapData: (data) => data,
  },
})

export const deleteTaskQuery = authQuery<TaskDto, { body: { id: number } }>({
  request: {
    url: "tasks/delete",
    method: "POST",
  },
  response: {
    contract: updateStatusContract,
    mapData: (data) => data,
  },
})
