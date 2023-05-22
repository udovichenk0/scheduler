import { createEvent, createStore, restore, sample } from "effector";
import { combine, createEffect } from "effector/compat";
export type Task = {
    id: number,
    title: string,
    done: boolean,
    description: string
}

export const toggleDoneTask = createEvent<{id:number, done:boolean}>()

export const getTasksFx = createEffect(async () => {
    return [
        {id: 1, done: false, title: "make something", description: "description 1"},
        {id: 2, done: false, title: "make anything", description: "description 2"},
        {id: 3, done: true, title: "done task", description: "description 3"},
        {id: 4, done: false, title: "go to there", description: "description 4"},
    ]
})


const $tasksKv = createStore<Record<number, Task>>({})
sample({
    clock: getTasksFx.doneData,
    fn: (data) => data.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
    target: $tasksKv
})

sample({
    clock: toggleDoneTask,
    source: $tasksKv,
    filter: (kv, {id}) => id in kv,
    fn: (kv, {id, done}) => ({...kv, [id]: {...kv[id], done}}),
    target: $tasksKv
})

const $taskIds = restore(
    getTasksFx.doneData.map((list) => list.map(({ id }) => id)),
    [],
);

export const $tasks = combine($tasksKv, $taskIds, (kv) => {
      return Object.keys(kv).map(id => kv[+id])
})