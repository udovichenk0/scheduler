import { z } from "zod";

export const TaskStatusSchema = z.enum(["FINISHED", "CANCELED", "INPROGRESS"]);
export const TaskTypeSchema = z.enum(["inbox", "unplaced"]);
export const TaskIdSchema = z.string();
