import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const taskSchemaDto = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  start_date: z.string(),
});
export class TaskCredentialDto extends createZodDto(taskSchemaDto) {}

const taskDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  start_date: z.date(),
  user_id: z.number(),
});

export class TaskDto extends createZodDto(taskDtoSchema) {}
