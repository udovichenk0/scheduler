import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { TaskStatusSchema, TaskTypeSchema } from "./common";

const TaskDtoSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  type: TaskTypeSchema,
  start_date: z.date().nullable(),
  id: z.string(),
  user_id: z.string(),
  is_deleted: z.boolean(),
  date_created: z.date()
});

export class TaskDto extends createZodDto(TaskDtoSchema) {}

export class TasksDto extends createZodDto(z.array(TaskDtoSchema)) {}
