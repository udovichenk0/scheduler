import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TaskStatusSchema = z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']);
const TaskTypeSchema = z.enum(['inbox', 'unplaced']);
const TaskIdSchema = z.string();

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskType = z.infer<typeof TaskTypeSchema>;
export type TaskId = z.infer<typeof TaskIdSchema>;

export const TaskIdParam = z.object({
  id: TaskIdSchema,
});

const CreateTaskSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: TaskStatusSchema,
  type: TaskTypeSchema,
  start_date: z.string().pipe(z.coerce.date()).nullable(),
});
export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}

const UpdateTaskDateSchema = z.object({
  start_date: z.string().pipe(z.coerce.date()).nullable(),
  type: TaskTypeSchema,
});
export class UpdateDateDto extends createZodDto(UpdateTaskDateSchema) {}

export const UpdateTaskStatusSchema = z.object({
  status: TaskStatusSchema,
});
export class UpdateStatusDto extends createZodDto(UpdateTaskStatusSchema) {}

const CreateTasksSchema = z.object({
  tasks: CreateTaskSchema.array(),
});
export class CreateTasksDto extends createZodDto(CreateTasksSchema) {}

const TaskDtoSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: TaskStatusSchema,
  type: TaskTypeSchema,
  start_date: z.date().nullable(),
  id: z.string(),
  user_id: z.string(),
  is_deleted: z.boolean(),
  date_created: z.date(),
});

export class TaskDto extends createZodDto(TaskDtoSchema) {}

export class TasksDto extends createZodDto(z.array(TaskDtoSchema)) {}
