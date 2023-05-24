import { Store, createEvent, createStore, sample, Effect, combine, createEffect } from "effector";
import { and, debug, or, spread } from "patronum";
export type Task = {
    id: number,
    title: string,
    done: boolean,
    note: string,
    date: boolean
}

export const getTasksFx = createEffect(async () => {
    return [
        {id: 0, done: false, title: "make something", note: "description 1", date: true},
        {id: 1, done: false, title: "make anything", note: "description 2", date: true},
        {id: 2, done: true, title: "done task", note: "description 3", date: true},
        {id: 3, done: false, title: "go to there", note: "description 4", date: true},
    ]
})

const createTaskFx = createEffect(async ({done = false, title, note = '', date = true}:{done: boolean, title: string, note: string,date?: boolean}) => {
    return {id: 4, done, title, note, date};
})

// make this done-toggle feature, because it does not relate to the window and after click it should make a request
export const doneTasktoggled = createEvent<{id: number, done: boolean}>()

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
//entity
export const $tasksKv = createStore<Record<number, Task>>({})
export const $tasks = combine($tasksKv, (kv) => {
    return Object.keys(kv).map(id => kv[+id])
})

sample({
    clock: getTasksFx.doneData,
    fn: (data) => data.reduce((kv, task) => task.date && ({...kv, [task.id]: task}),{}),
    target: $tasksKv
})
//widget model
export const expandedTaskFactory = ({tasks}:{tasks: Store<Record<number, Task>>}) => {
    
    const checkToggle = createEvent<boolean>()
    const titleChanged = createEvent<string>()
    const noteChanged = createEvent<string>()

    const createTask = createEvent()
    const expandTaskTriggered = createEvent<number>()
    
    const closeExpandedTask = createEvent()

    const $activeTaskId = createStore<number | null>(null)
    const $activeNewTask = createStore<boolean>(false)
    const $title = createStore('')
    const $note = createStore('')
    const $done = createStore(false)

    const $mainTask = combine($title, $note, $done, (title, note, done) => ({title, note, done}))
    sample({
        clock: createTask,
        source: $activeNewTask,
        fn: (isOpened) => !isOpened,
        target: $activeNewTask
    })
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
        clock: expandTaskTriggered,
        source: tasks,
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
        clock: closeExpandedTask,
        source: {kv: tasks, meta: $mainTask, id: $activeTaskId},
        filter: (params: ParamsOptions): params is Params => Boolean(params.id),
        fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
        target: tasks
    })
    sample({
        clock: closeExpandedTask,
        source: $mainTask,
        filter: and($activeNewTask),
        // fn: (d) => console.log(d)
        target: createTaskFx
        // fn: ({kv}) => ({...kv, [postCreatedTask.id]: {...postCreatedTask}}),
        // target: tasks
    })
    sample({
        clock: createTaskFx.doneData,
        source: tasks,
        fn: (kv, task) => ({...kv, [task.id]: {...task}}),
        target: tasks
    })

    sample({
        clock: closeExpandedTask,
        source: $activeTaskId,
        filter: or($activeTaskId, $activeNewTask),
        target: [$activeTaskId.reinit, $title.reinit, $note.reinit, $done.reinit, $activeNewTask.reinit, $activeNewTask.reinit]
    })

    sample({
        clock: doneTasktoggled,
        source: tasks,
        filter: (kv, {id}) => id in kv,
        fn: (kv, {id, done}) => ({...kv, [id]: {...kv[id], done}}),
        target: tasks
    })
    sample({
        clock: expandTaskTriggered,
        target: $activeTaskId
    })
    return {
        checkToggle,
        titleChanged,
        createTask,
        noteChanged,
        closeExpandedTask,
        setActiveTriggered: expandTaskTriggered,
        $activeTaskId,
        $activeNewTask,
        $title,
        $note,
        $done,
    }
}

// page model
export const expandedTask = expandedTaskFactory({tasks: $tasksKv})