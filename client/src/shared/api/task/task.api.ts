import { zodContract } from "@farfetched/zod"
import { createEffect } from "effector"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

import { authQuery } from "@/shared/api/auth-query"
import { parseDto } from "@/shared/lib/parse-dto"
import { getToday } from "@/shared/lib/date/get-today"
import { isToday } from "@/shared/lib/date"

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
  CountSchemaDto,
  Count,
} from "./task.dto"

const TaskContract = zodContract(TaskSchemaDto)
const TasksContract = zodContract(TasksSchemaDto)
const CountContract = zodContract(CountSchemaDto)

export const inboxTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/inbox",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})
export const inboxTasksCountQuery = authQuery<Count>({
  request: {
    url: "tasks/inbox/count",
    method: "GET",
  },
  response: {
    contract: CountContract,
    mapData: (data) => data.result,
  },
})
export const todayTasksCountQuery = authQuery<Count>({
  request: {
    url: "tasks/today/count",
    method: "GET",
  },
  response: {
    contract: CountContract,
    mapData: (data) => data.result,
  },
})
export const trashTaskQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/trash",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})

export const unplacedTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/unplaced",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})

export const todayTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/today",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})

export const overdueTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/overdue",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})

export const upcomingTasksQuery = authQuery<TaskDto[]>({
  request: {
    url: "tasks/unplaced",
    method: "GET",
  },
  response: {
    contract: TasksContract,
    mapData: (data) => data.result,
  },
})

export const createTaskMutation = authQuery<TaskDto, CreateTaskDto>({
  request: {
    url: "tasks",
    method: "POST",
    body: (data) => data,
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

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

export const updateTaskMutation = authQuery<TaskDto, UpdateTaskDto>({
  request: {
    url: ({ id }) => `tasks/${id}`,
    method: "PATCH",
    body: ({ data }) => data,
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const updateStatusMutation = authQuery<TaskDto, UpdateStatusDto>({
  request: {
    url: ({ id }) => `tasks/${id}/status`,
    method: "POST",
    body: ({ data }) => data,
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})

export const deleteTaskMutation = authQuery<TaskDto, TaskId>({
  request: {
    url: (id) => `tasks/${id}`,
    method: "DELETE",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})
export const trashTaskMutation = authQuery<TaskDto, TaskId>({
  request: {
    url: (id) => `tasks/${id}/trash`,
    method: "PATCH",
  },
  response: {
    contract: TaskContract,
    mapData: (data) => data.result,
  },
})
export const deleteAllTasksMutation = authQuery<Count>({
  request: {
    url: "tasks/all",
    method: "DELETE",
  },
  response: {
    contract: CountContract,
    mapData: (data) => data.result,
  },
})

export const createTasksMutation = authQuery<Count, CreateTasksDto>({
  request: {
    url: "tasks/batch",
    method: "POST",
    body: (data) => ({ tasks: data }),
  },
  response: {
    contract: CountContract,
    mapData: (data) => data.result,
  },
})

export const updateDateMutation = authQuery<TaskDto, UpdateDateDto>({
  request: {
    url: ({ id }) => `tasks/${id}/date`,
    method: "PATCH",
    body: ({ data }) => data,
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

export const inboxTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const result = tasks.filter(
    (task) => task.type == "inbox" && !task.is_deleted,
  )
  return {
    result,
  }
})
export const inboxTasksCountLs = createEffect(
  (): { result: { count: number } } => {
    const tasks = getTasksFromLs()
    const count = tasks.reduce(
      (count, task) =>
        task.type == "inbox" && !task.is_deleted ? count + 1 : count,
      0,
    )
    return {
      result: {
        count,
      },
    }
  },
)
export const unplacedTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const result = tasks.filter(
    (task) => task.type == "unplaced" && !task.is_deleted,
  )
  return {
    result,
  }
})
export const todayTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const result = tasks.filter(
    (task) =>
      task.start_date && dayjs(task.start_date).isToday() && !task.is_deleted,
  )
  return {
    result,
  }
})
export const todayTasksCountLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const count = tasks.reduce((count, { start_date, is_deleted }) => {
    return start_date && isToday(start_date) && !is_deleted ? count + 1 : count
  }, 0)
  return {
    result: {
      count,
    },
  }
})
export const overdueTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const today = getToday()
  const result = tasks.filter(
    (task) =>
      task.start_date && new Date(task.start_date) < today && !task.is_deleted,
  )
  return {
    result,
  }
})
export const upcomingTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const today = getToday()
  const result = tasks.filter(
    (task) =>
      task.start_date && new Date(task.start_date) >= today && !task.is_deleted,
  )
  return {
    result,
  }
})
export const trashTasksLs = createEffect(() => {
  const tasks = getTasksFromLs()
  const result = tasks.filter((task) => task.is_deleted)
  return {
    result,
  }
})

export const createTaskLs = createEffect(
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

function updateTaskFunc(
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
export const updateTaskLs = createEffect(
  async ({ id, data }: { id: TaskId; data: CreateTaskDto }) => {
    const tasksFromLs = localStorage.getItem("tasks")
    const parsedTasks = JSON.parse(tasksFromLs!)

    const { updatedTasks, updatedTask } = updateTaskFunc(parsedTasks, id, data)
    const parsedTask = parseDto(LocalStorageTaskDto, updatedTask!)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return {
      result: parsedTask,
    }
  },
)

export const updateDateLs = createEffect(
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

export const updateStatusLs = createEffect(
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

export const deleteTaskLs = createEffect((id: TaskId) => {
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

export const trashTaskLs = createEffect((id: TaskId) => {
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
export const deleteTasksLs = createEffect(() => {
  const tasksFromLs = localStorage.getItem("tasks")
  const tasks = JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]
  const updated = tasks.filter((task) => !task.is_deleted)
  if (updated.length) {
    localStorage.setItem("tasks", JSON.stringify(updated))
  } else {
    localStorage.removeItem("tasks")
  }
})

function getTasksFromLs() {
  const tasksFromLs = localStorage.getItem("tasks")
  return (JSON.parse(tasksFromLs!) as LocalStorageTaskDto[]) || []
}
