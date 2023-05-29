import { combine } from "effector";
import { createEvent } from "effector/effector.umd";
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $tasksKv } from "@/entities/task";
export type Task = {
    id: number,
    title: string,
    done: boolean,
    note: string,
    date: boolean
}

export const $tasks = combine($tasksKv, (kv) => {
    return Object.values(kv)
    .filter(({date}) => date)
})


export const closeTaskTriggered = createEvent()

export const updateTaskModel = updateTaskFactory({closeTaskTriggered})
export const createTaskModel = createTaskFactory({closeTaskTriggered})