import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const TaskContract = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z.date(),
});

export class CreateTaskCredentialDto extends createZodDto(TaskContract) {}

const UpdateTaskContract = TaskContract.extend({
  id: z.string(),
});

export class UpdateTaskCredentialDto extends createZodDto(UpdateTaskContract) {}

const UpdateDateContract = z.object({
  id: z.string(),
  date: z.date(),
});

export class UpdateDateCredentialsDto extends createZodDto(
  UpdateDateContract,
) {}

export const updateStatusCredentialsDto = z.object({
  id: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
});
export class UpdateStatusCredentialDto extends createZodDto(
  updateStatusCredentialsDto,
) {}

const CreateManyTasksCredentials = z.object({
  tasks: TaskContract.extend({
    id: z.string(),
  }).array(),
  user_id: z.string(),
});
export class CreateManyTasksCredentialDto extends createZodDto(
  CreateManyTasksCredentials,
) {}
const TaskDtoSchema = TaskContract.extend({
  id: z.string(),
  user_id: z.string(),
});
export class TaskDto extends createZodDto(TaskDtoSchema) {}

export const DeleteTaskCredentialSchema = z.object({
  id: z.string(),
});

export class DeleteTaskCredentialsDto extends createZodDto(
  DeleteTaskCredentialSchema,
) {}
