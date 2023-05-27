import { Store, createEvent, createStore, sample } from "effector";
import { spread } from "patronum";
import { $fileds, $note, $title, $done } from "../abstract";
import { Params, ParamsOptions } from "../abstract/type";

export const updateTaskFactory = ({tasks}:{tasks: Store<Record<number, any>>}) => {
    const expandTaskTriggered = createEvent<number>()
    const closeExpandedTask = createEvent()
    const doneTaskToggled = createEvent<{id: number, done: boolean}>()

    const $activeTaskId = createStore<number | null>(null)

    sample({
        clock: expandTaskTriggered,
        target: $activeTaskId
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
        source: {kv: tasks, meta: $fileds, id: $activeTaskId},
        filter: (params: ParamsOptions): params is Params => Boolean(params.id),
        fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
        target: tasks
    })
    sample({
        clock: closeExpandedTask,
        target: [$activeTaskId.reinit, $title.reinit, $note.reinit, $done.reinit]
    }) 
    sample({
        clock: doneTaskToggled,
        source: tasks,
        filter: (kv, {id}) => id in kv,
        fn: (kv, {id, done}) => ({...kv, [id]: {...kv[id], done}}),
        target: tasks
    })
    return {
        expandTaskTriggered,
        closeExpandedTask,
        $activeTaskId,
        doneTaskToggled
    }
}