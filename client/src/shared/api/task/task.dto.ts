import { z } from 'zod';

const taskSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    status: z.enum([''])
})
export const taskDtoSchema = z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['FINISHED', 'CANCELED', 'INPROGRESS']),
    start_date: z.string(),
    user_id: z.number(),
}));
export type TaskDto = z.infer<typeof taskDtoSchema>