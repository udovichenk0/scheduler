import { createEffect, createEvent, createStore, sample, Event } from "effector";
import { and } from 'patronum';
import { $tasksKv } from "@/entities/task";
import { $fileds, $note, $title, $done } from "../abstract";


export const createTaskFx = createEffect(async ({done = false, title, note = '', date = true}:{done: boolean, title: string, note: string,date?: boolean}) => {
    return {id: 5, done, title, note, date};
})

export const createTaskFactory = ({
    closeTaskTriggered, 
}: {
    closeTaskTriggered: Event<void>,
}) => {
    const createTaskTriggered = createEvent()
    const taskCreated = createEvent()
    const $activeNewTask = createStore<boolean>(false)
    sample({
        clock: closeTaskTriggered,
        filter: and($activeNewTask),
        target: taskCreated
    })
    sample({
        clock: createTaskTriggered,
        fn: () => true,
        target: $activeNewTask
    })

    sample({
        clock: taskCreated,
        source: $fileds,
        filter: ({title}) => Boolean(title.length),
        target: createTaskFx
    })
    sample({
        clock: createTaskFx.doneData,
        source: $tasksKv,
        fn: (kv, task) => ({...kv, [task.id]: {...task}}),
        target: $tasksKv
    })
    sample({
        clock: taskCreated,
        target: [$activeNewTask.reinit, $title.reinit, $note.reinit, $done.reinit]
    })
    return {
        createTaskTriggered,
        taskCreated,
        $activeNewTask,
    }
}


