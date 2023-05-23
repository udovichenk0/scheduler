import { Store, createEvent, createStore, sample, Effect, combine, createEffect } from "effector";
import { debug, spread } from "patronum";
export type Task = {
    id: number,
    title: string,
    done: boolean,
    note: string,
    date: boolean
}

export const getTasksFx = createEffect(async () => {
    return [
        {id: 1, done: false, title: "make something", note: "description 1", date: false},
        {id: 2, done: false, title: "make anything", note: "description 2", date: true},
        {id: 3, done: true, title: "done task", note: "description 3", date: true},
        {id: 4, done: false, title: "go to there", note: "description 4", date: true},
    ]
})


export const doneTasktoggled = createEvent<{id: number, done: boolean}>()
export const saveChangedTriggered = createEvent()
export const doneToggled = createEvent<{id:number, done:boolean}>()

export const checkToggle = createEvent<boolean>()
export const titleChanged = createEvent<string>()
export const noteChanged = createEvent<string>()

export const saveActiveTaskTriggered = createEvent()

export const setActiveTriggered = createEvent<number>()
export const resetActiveTriggered = createEvent()

// export const $title = createStore('')
// export const $note = createStore('')
// export const $done = createStore(false)




// export const $mainTask = combine($title, $note, $done, (title, note, done) => ({title, note, done}))

// export const $activeTaskId = createStore<number | null>(null)
// .reset(resetActiveTriggered)
// .on(setActiveTriggered, (_, payload) => payload)

const $tasksKv = createStore<Record<number, Task>>({})
sample({
    clock: getTasksFx.doneData,
    fn: (data) => data.reduce((kv, task) => task.date && ({...kv, [task.id]: task}),{}),
    target: $tasksKv
})

// sample({
//     clock: titleChanged,
//     target: $title
// })
// sample({
//     clock: checkToggle,
//     target: $done
// })
// sample({
//     clock: noteChanged,
//     target: $note
// })

type ExcludeId = Pick<Task, Exclude<keyof Task, 'id'>>

type ParamsOptions = {
    kv: Record<number, Task>,
    meta: {
        done: boolean,
        title: string,
        note: string,
    },
    id: number | null
}

type Params = {
    kv: Record<number, Task>,
    meta: ExcludeId,
    id: number
}
// sample({
//     clock: saveActiveTaskTriggered,
//     source: {kv: $tasksKv, meta: $mainTask, id: $activeTaskId},
//     filter: (params: ParamsOptions): params is Params => Boolean(params.id),
//     fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
//     target: $tasksKv
// })

//! sdfhere
// sample({
//     clock: setActiveTriggered,
//     source: $tasksKv,
//     fn: (kv, id) => ({...kv[id]}),
//     target: spread({
//         targets: {
//             title: $title,
//             note: $note,
//             done: $done
//         }
//     })
// })


sample({
    clock: doneTasktoggled,
    source: $tasksKv,
    filter: (kv, {id}) => id in kv,
    fn: (kv, {id, done}) => ({...kv, [id]: {...kv[id], done}}),
    target: $tasksKv
})


export const expandedTaskFactory = ({getTasksFx}:{getTasksFx: Effect<void,Task[]>}) => {
    
    const checkToggle = createEvent<boolean>()
    const titleChanged = createEvent<string>()
    const noteChanged = createEvent<string>()
    const saveActiveTaskTriggered = createEvent()
    const saveChangedTriggered = createEvent()
    const setActiveTriggered = createEvent<number>()
    const resetActiveTriggered = createEvent()
    
    const getTasks = createEvent()

    const $activeTaskId = createStore<number | null>(null)
    .reset(resetActiveTriggered)
    const $title = createStore('')
    const $note = createStore('')
    const $done = createStore(false)
    const $tasksKv = createStore<Record<number, Task>>({})
    const $tasks = combine($tasksKv, (kv) => {
        return Object.keys(kv).map(id => kv[+id])
    })
    
    const $mainTask = combine($title, $note, $done, (title, note, done) => ({title, note, done}))
    sample({
        clock: titleChanged,
        target: $title
    })
    sample({
        clock: checkToggle,
        target: $done
    })
    sample({
        clock: noteChanged,
        target: $note
    })
    sample({
        clock: setActiveTriggered,
        source: $tasksKv,
        fn: (kv, id) => ({...kv[id]}),
        target: spread({
            targets: {
                title: $title,
                note: $note,
                done: $done
            }
        })
    })
    sample({
        clock: saveActiveTaskTriggered,
        source: {kv: $tasksKv, meta: $mainTask, id: $activeTaskId},
        filter: (params: ParamsOptions): params is Params => Boolean(params.id),
        fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
        target: $tasksKv
    })
    sample({
        clock: setActiveTriggered,
        target: $activeTaskId
    })
    sample({
        clock: getTasksFx.doneData,
        fn: (data) => data.reduce((kv, task) => task.date && ({...kv, [task.id]: task}),{}),
        target: $tasksKv
    })
    sample({
        clock: getTasks,
        target: getTasksFx
    })
    return {
        checkToggle,
        titleChanged,
        noteChanged,
        setActiveTriggered,
        saveChangedTriggered,
        saveActiveTaskTriggered,
        resetActiveTriggered,
        getTasks,
        $activeTaskId,
        $title,
        $note,
        $tasks,
        $done,
    }
}
export const expandedTask = expandedTaskFactory({getTasksFx})

// export const $tasks = combine(expandedTask.$tasksKv, (kv) => {
//     return Object.keys(kv).map(id => kv[+id])
// })
