import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
export const TaskIdSchema = z.object({
  id: z.string(),
});
export type TaskId = z.infer<typeof TaskIdSchema>;

const TaskContract = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z.string().pipe(z.coerce.date()).nullable(),
});

export class CreateTaskCredentialDto extends createZodDto(TaskContract) {}

const UpdateDateContract = z.object({
  start_date: z.string().pipe(z.coerce.date()).nullable(),
  type: z.enum(['inbox', 'unplaced']),
});
export class UpdateDateCredentialsDto extends createZodDto(
  UpdateDateContract,
) {}

const TestContract = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z.string().pipe(z.coerce.date()).nullable(),
});
export class TestDto extends createZodDto(TestContract) {}

export const updateStatusCredentialsDto = z.object({
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
