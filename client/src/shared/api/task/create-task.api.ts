import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema } from './task.dto';

const taskContract = zodContract(taskDtoSchema)

export const createTaskQuery = authQuery<TaskDto>({
    request: {
        url: 'create-task',
        method: 'POST'
    },
    response: {
        contract: taskContract,
        mapData: (data) => data
    }
})