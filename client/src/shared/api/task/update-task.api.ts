import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema } from './task.dto';

const taskContract = zodContract(taskDtoSchema)
type BodyType = {
    id: number,
    title: string;
    description: string | null;
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    type: 'inbox' | 'unplaced';
    start_date: Date | null;
}


export const updateTaskQuery = authQuery<TaskDto, {body: BodyType}>({
  request: {
    url: 'update-task',
    method: 'POST'
  },
  response: {
    contract: taskContract,
    mapData: (data) => data
  }
})