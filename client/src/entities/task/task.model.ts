import { createEvent, createStore, sample } from "effector"
import { Task, getTaskQuery } from "@/shared/api/task"


export const $tasksKv = createStore<Record<number, Task>>({})
export const getTasksTriggered = createEvent()
sample({
    clock: getTaskQuery.finished.success,
    fn: ({result:{result}}) => result.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
    target: $tasksKv
})

sample({
    clock: getTasksTriggered,
    target: getTaskQuery.start
})