import { zodContract } from "@farfetched/zod"
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
  CreateTasksDto,
  UpdateDateDto,
  BatchedSchemaDto,
} from "./task.dto"

const TaskContract = zodContract(TaskSchemaDto)
export const createTaskQuery = authQuery<TaskDto, CreateTaskDto>({
  request: {
    url: "tasks",
    method: "POST",
    body: (data) => data
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
});

const GetTasksContract = zodContract(TasksSchemaDto)
export const getTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks",
    method: "GET",
  },
  response: {
    contract: GetTasksContract,
    mapData: (data) => data.result,
  },
})

export const updateTaskQuery = authQuery<
  TaskDto,
  UpdateTaskDto
>({
  request: {
    url: ({ id }) => `tasks/${id}`,
    method: "PATCH",
    body: ({ data }) => data
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const updateStatusQuery = authQuery<TaskDto, UpdateStatusDto>({
  request: {
    url: ({ id }) => `tasks/${id}/status`,
    method: "POST",
    body: ({ data }) => data
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const deleteTaskQuery = authQuery<TaskDto, TaskId>({
  request: {
    url: (id) => `tasks/${id}`,
    method: "DELETE",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})
export const trashTaskQuery = authQuery<TaskDto, TaskId>({
  request: {
    url: (id) => `tasks/${id}/trash`,
    method: "PATCH",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})
export const deleteAllTasksQuery = authQuery<{count: number}>({
  request: {
    url: 'tasks/all',
    method: 'DELETE',
  },
  response: {
    contract: zodContract(BatchedSchemaDto),
    mapData: (data) => data.result,
  }
})

export const createTasksQuery = authQuery<TaskDto[], CreateTasksDto>({
  request: {
    url: "tasks/batch",
    method: "POST",
    body: (data) => data 
  },
  response: {
    contract: GetTasksContract,
    mapData: (data) => data.result,
  },
})

export const updateDateQuery = authQuery<TaskDto, UpdateDateDto>({
  request: {
    url: ({ id }) => `tasks/${id}/date`,
    method: "PATCH",
    body: ({ data }) => data
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
    const task = {
      ...body,
      id: uuidv4(),
      user_id: null,
      date_created: new Date(),
      is_deleted: false,
    }
    const parsedTask = parseDto(LocalStorageTaskDto, task)
    const tasks = JSON.parse(tasksFromLs!)
    localStorage.setItem(
      "tasks",
      JSON.stringify([...(tasks || []), parsedTask]),
    )
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
  ({ date, type, id }: { date: Date; id: TaskId; type: TaskType }) => {
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

export const trashTaskFromLocalStorageFx = createEffect((id: TaskId) => {
  const tasksFromLs = localStorage.getItem("tasks")
  const parsedTasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]

  const updatedTasks = parsedTasks.map((task) =>
    task.id == id ? { ...task, is_deleted: true } : task,
  )
  const trashedTask = updatedTasks.find((task) => task.id == id)
  if (updatedTasks.length) {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  } else {
    localStorage.removeItem("tasks")
  }

  return {
    result: trashedTask!,
  }
})
export const deleteTrashTasksFromLocalStorageFx = createEffect(() => {
  const tasksFromLs = localStorage.getItem("tasks")
  console.log("here")
  const tasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]
  const updated = tasks.filter((task) => !task.is_deleted)
  if (updated.length) {
    localStorage.setItem("tasks", JSON.stringify(updated))
  } else {
    localStorage.removeItem("tasks")
  }
})