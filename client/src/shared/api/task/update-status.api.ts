import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema } from './task.dto';

const taskContract = zodContract(taskDtoSchema)

type BodyType = {
  id: number,
  status: "FINISHED" | "CANCELED" | "INPROGRESS"
}

export const updateStatusQuery = authQuery<TaskDto, {body: BodyType}>({
  request: {
    url: 'update-status',
    method: 'POST'
  },
  response: {
    contract: taskContract,
    mapData: (data) => data
  }
})