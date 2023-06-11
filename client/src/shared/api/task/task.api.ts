import { zodContract } from '@farfetched/zod';
import { authQuery } from '@/shared/lib/auth-query';
import { TaskDto, taskDtoSchema } from './task.dto';

const taskContract = zodContract(taskDtoSchema)

export const getTaskQuery = authQuery<TaskDto>({
    request: {
        url: 'get-tasks',
        method: 'GET'
    },
    response: {
        contract: taskContract,
        mapData: (data: TaskDto) => data
    }
})