import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema, tasksDtoSchema } from './task.dto';

const createTaskContract = zodContract(taskDtoSchema)

type CreateTaskParamsType = {
    title: string;
    description: string | null;
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    type: 'inbox' | 'unplaced';
    start_date: Date | null;
}

export const createTaskQuery = authQuery<TaskDto, {body: CreateTaskParamsType}>({
  request: {
    url: 'create-task',
    method: 'POST'
  },
  response: {
    contract: createTaskContract,
    mapData: (data) => data
  }
})


const tasksQueryContract = zodContract(tasksDtoSchema)

export const tasksQuery = authQuery<TaskDto[], void>({
  request: {
    url: 'get-tasks',
    method: 'GET'
  },
  response: {
    contract: tasksQueryContract,
    mapData: (data) => data
  }
})


const updateTaskContract = zodContract(taskDtoSchema)
type UpdateTaskParams = {
    id: number,
    title: string;
    description: string | null;
    status: "FINISHED" | "INPROGRESS";
    type: 'inbox' | 'unplaced';
    start_date: Date | null;
}

export const updateTaskQuery = authQuery<TaskDto, {body: UpdateTaskParams}>({
  request: {
    url: 'update-task',
    method: 'POST'
  },
  response: {
    contract: updateTaskContract,
    mapData: (data) => data
  }
})

const updateStatusContract = zodContract(taskDtoSchema)

type UpdateStatusParams = {
  id: number,
  status: "FINISHED" | "CANCELED" | "INPROGRESS"
}

export const updateStatusQuery = authQuery<TaskDto, {body: UpdateStatusParams}>({
  request: {
    url: 'update-status',
    method: 'POST'
  },
  response: {
    contract: updateStatusContract,
    mapData: (data) => data
  }
})