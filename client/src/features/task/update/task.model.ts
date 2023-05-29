import { createEvent, createStore, sample, Event } from "effector";
import { and, spread } from "patronum";
import { $tasksKv } from "@/entities/task";
import { $fileds, $note, $title, $done } from "../abstract";
import { Params, ParamsOptions } from "../abstract/type";


export const updateTaskFactory = ({closeTaskTriggered}:{closeTaskTriggered: Event<void>}) => {
    const updateTaskTriggered = createEvent<number>()
    const taskUpdated = createEvent()
    const doneTaskToggled = createEvent<number>()
    const $activeTaskId = createStore<number | null>(null)

    sample({
        clock: closeTaskTriggered,
        filter: and($activeTaskId),
        target: taskUpdated
    })
    sample({
        clock: updateTaskTriggered,
        target: $activeTaskId
    })

    sample({
        clock: updateTaskTriggered,
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
        clock: taskUpdated,
        source: {kv: $tasksKv, meta: $fileds, id: $activeTaskId},
        filter: (params: ParamsOptions): params is Params => Boolean(params.id),
        fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
        target: $tasksKv
    })
    sample({
        clock: taskUpdated,
        target: [$activeTaskId.reinit, $title.reinit, $note.reinit, $done.reinit]
    }) 
    sample({
        clock: doneTaskToggled,
        source: $tasksKv,
        filter: (kv, id) => id in kv,
        fn: (kv, id) => ({...kv, [id]: {...kv[id], done: !kv[id].done}}),
        target: $tasksKv
    })
    return {
        updateTaskTriggered,
        taskUpdated,
        $activeTaskId,
        doneTaskToggled
    }
}