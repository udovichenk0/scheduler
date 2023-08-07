import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

//TODO Need to fix, because there are many types repeats
const createTaskCredentialsDto = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  type: z.enum(['inbox', 'unplaced']),
  start_date: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
});
export class CreateTaskCredentialDto extends createZodDto(
  createTaskCredentialsDto,
) {}

const updateTaskCredentialsDto = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  start_date: z
    .string()
    .nullable()
    .transform((str) => (str ? new Date(str) : null)),
  type: z.enum(['inbox', 'unplaced']),
  id: z.string(),
});
export class UpdateTaskCredentialDto extends createZodDto(
  updateTaskCredentialsDto,
) {}

export const updateStatusCredentialsDto = z.object({
  id: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
});
export class UpdateStatusCredentialDto extends createZodDto(
  updateStatusCredentialsDto,
) {}

const createManyTasksCredentialsDto = z.object({
  tasks: z
    .object({
      title: z.string().nonempty(),
      description: z.string(),
      status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
      type: z.enum(['inbox', 'unplaced']),
      id: z.string(),
      start_date: z
        .string()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    })
    .array(),
  user_id: z.string(),
});
export class CreateManyTasksCredentialDto extends createZodDto(
  createManyTasksCredentialsDto,
) {}
const taskDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  start_date: z.date().nullable(),
  type: z.enum(['inbox', 'unplaced']),
  user_id: z.string(),
});

export class TaskDto extends createZodDto(taskDtoSchema) {}

export const DeleteTaskCredentialSchema = z.object({
  id: z.string(),
});

export class DeleteTaskCredentialsDto extends createZodDto(
  DeleteTaskCredentialSchema,
) {}
