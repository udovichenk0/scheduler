import { z } from 'zod';

export const taskDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
  start_date: z.coerce.date(),
  user_id: z.number(),
  type: z.enum(['inbox', 'unplaced'])
})
export const tasksDtoSchema = z.array(taskDtoSchema);

export type TaskDto = z.infer<typeof taskDtoSchema>