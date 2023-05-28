import { Store, createEffect, createEvent, createStore, sample } from "effector";
import { Task } from "@/shared/api/task";
import { $fileds, $note, $title, $done } from "../abstract";


export const createTaskFx = createEffect(async ({done = false, title, note = '', date = true}:{done: boolean, title: string, note: string,date?: boolean}) => {
    return {id: 5, done, title, note, date};
})

export const createTaskFactory = ({tasks}:{tasks: Store<Record<number, Task>>}) => {
    const createTaskTriggered = createEvent()
    const closeTaskTriggered = createEvent()

    const $activeNewTask = createStore<boolean>(false)

    sample({
        clock: createTaskTriggered,
        fn: () => true,
        target: $activeNewTask
    })
    sample({
        clock: closeTaskTriggered,
        source: $fileds,
        filter: ({title}) => Boolean(title.length),
        target: createTaskFx
    })
    sample({
        clock: createTaskFx.doneData,
        source: tasks,
        fn: (kv, task) => ({...kv, [task.id]: {...task}}),
        target: tasks
    })
    sample({
        clock: closeTaskTriggered,
        target: [$activeNewTask.reinit, $title.reinit, $note.reinit, $done.reinit]
    })
    return {
        createTaskTriggered,
        closeTaskTriggered,
        $activeNewTask
    }
}


