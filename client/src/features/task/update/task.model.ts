import { Store, createEvent, createStore, sample } from "effector";
import { spread } from "patronum";
import { $fileds, $note, $title, $done } from "../abstract";
import { Params, ParamsOptions } from "../abstract/type";

export const updateTaskFactory = ({tasks}:{tasks: Store<Record<number, any>>}) => {
    const updateTaskTriggered = createEvent<number>()
    const taskUpdated = createEvent()
    const doneTaskToggled = createEvent<number>()

    const $activeTaskId = createStore<number | null>(null)

    sample({
        clock: updateTaskTriggered,
        target: $activeTaskId
    })
    sample({
        clock: updateTaskTriggered,
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
        clock: taskUpdated,
        source: {kv: tasks, meta: $fileds, id: $activeTaskId},
        filter: (params: ParamsOptions): params is Params => Boolean(params.id),
        fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
        target: tasks
    })
    sample({
        clock: taskUpdated,
        target: [$activeTaskId.reinit, $title.reinit, $note.reinit, $done.reinit]
    }) 
    sample({
        clock: doneTaskToggled,
        source: tasks,
        filter: (kv, id) => id in kv,
        fn: (kv, id) => ({...kv, [id]: {...kv[id], done: !kv[id].done}}),
        target: tasks
    })
    return {
        updateTaskTriggered,
        taskUpdated,
        $activeTaskId,
        doneTaskToggled
    }
}