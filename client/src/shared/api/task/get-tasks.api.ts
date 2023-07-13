import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, tasksDtoSchema } from './task.dto';

const taskContract = zodContract(tasksDtoSchema)

export const tasksQuery = authQuery<TaskDto[], void>({
  request: {
    url: 'get-tasks',
    method: 'GET'
  },
  response: {
    contract: taskContract,
    mapData: (data) => data
  }
})