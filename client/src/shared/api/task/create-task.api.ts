import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema } from './task.dto';

const taskContract = zodContract(taskDtoSchema)
type BodyType = {
    title: string;
    description: string | null;
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    type: 'inbox' | 'unplaced';
    start_date: Date;
}


export const createTaskQuery = authQuery<TaskDto, {body: BodyType}>({
  request: {
    url: 'create-task',
    method: 'POST'
  },
  response: {
    contract: taskContract,
    mapData: (data) => data
  }
})

//url: ({id}:{id: number}) => `create-task/${id}`