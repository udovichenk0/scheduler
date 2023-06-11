import { createEvent, createStore, sample } from "effector"
import { Task } from "@/shared/api/task"


export const $tasksKv = createStore<Record<number, Task>>({})
export const getTasksTriggered = createEvent()
// sample({
//     clock: getTasksFx.doneData,
//     fn: (data) => data.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
//     target: $tasksKv
// })

// sample({
//     clock: getTasksTriggered,
//     target: getTasksFx
// })