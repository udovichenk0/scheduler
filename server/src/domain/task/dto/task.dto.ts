import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const TaskContract = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z.string().pipe(z.coerce.date()).nullable(),
});

export class CreateTaskCredentialDto extends createZodDto(TaskContract) {}

const UpdateTaskContract = z.object({
  id: z.string(),
  task: TaskContract,
});

export class UpdateTaskCredentialDto extends createZodDto(UpdateTaskContract) {}

const UpdateDateContract = z.object({
  id: z.string(),
  date: z.string().pipe(z.coerce.date()).nullable(),
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

const CreateManyTasksCredentials = z.object({ tasks: TaskContract.array() });
export class CreateManyTasksCredentialDto extends createZodDto(
  CreateManyTasksCredentials,
) {}
const TaskDtoContract = TaskContract.extend({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z.date().nullable(),
  id: z.string(),
  user_id: z.string(),
  is_deleted: z.boolean(),
  date_created: z.date(),
});
export class TaskDto extends createZodDto(TaskDtoContract) {}

export const DeleteTaskCredentialSchema = z.object({
  id: z.string(),
});

export class DeleteTaskCredentialsDto extends createZodDto(
  DeleteTaskCredentialSchema,
) {}
