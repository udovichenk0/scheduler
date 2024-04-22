import { z } from "zod";
import { TaskStatusSchema, TaskTypeSchema } from "./common";
import { createZodDto } from "nestjs-zod";

const CreateTasksSchema = z.array(
  z.object({
    title: z.string().nonempty(),
    description: z.string().nullable(),
    status: TaskStatusSchema,
    type: TaskTypeSchema,
    start_date: z.string().pipe(z.coerce.date()).nullable(),
    is_deleted: z.boolean(),
    date_created: z.string().pipe(z.coerce.date())
  })
);

export class CreateTasksMapper extends createZodDto(CreateTasksSchema) {}
