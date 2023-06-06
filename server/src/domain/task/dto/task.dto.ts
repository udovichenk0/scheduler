import { z } from 'zod';
// const taskSchema = z.object({
//     id: z.number(),
//     title: z.string(),
//     description
// })

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'FINISHED' | 'CANCELED' | 'INPROGRESS';
  start_date: Date;
  user_id: number;
}
