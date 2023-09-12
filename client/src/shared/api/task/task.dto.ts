import { z } from "zod"

export const taskDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["FINISHED", "INPROGRESS"]),
  start_date: z.coerce.date().nullable(), //!!!!!!EXPECTED DATE RECEIVED STRING
  user_id: z.string(),
  type: z.enum(["inbox", "unplaced"]),
})
export const tasksDtoSchema = z.array(taskDtoSchema)

export type TaskDto = z.infer<typeof taskDtoSchema>

export type TaskStatus = z.infer<typeof taskDtoSchema.shape.status>
export type TaskType = z.infer<typeof taskDtoSchema.shape.type>
