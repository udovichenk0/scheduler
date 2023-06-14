import { createEvent, sample, Event } from "effector";
import { spread } from "patronum";
import { $tasksKv } from "@/entities/task";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = (updateTaskOpened: Event<number>) => {
    const updateTaskTriggered = createEvent()
    const doneTaskToggled = createEvent<number>()

    const abstract = abstractTaskFactory()
    const { $fileds, $isDirty, $title, $description, $status, resetFieldsTriggered } = abstract
    sample({
        clock: updateTaskTriggered,
        filter: $isDirty,
        fn: () => console.log('taskupdated triggered')
    })

    sample({
        clock: updateTaskOpened,
        source: $tasksKv,
        fn: (kv, id) => ({...kv[id]}),
        target: spread({
            targets: {
                title: $title,
                status: $status,
                description: $description
            }
        })
    })

    // sample({
    //     clock: taskUpdated,
    //     source: {kv: $tasksKv, meta: $fileds, id: $activeTaskId},
    //     filter: (params: ParamsOptions): params is Params => Boolean(params.id),
    //     fn: ({kv, meta, id}) => ({...kv, [id]: {...kv[id], ...meta}}),
    //     target: $tasksKv
    // })
    // sample({
    //     clock: updateTaskTriggered,
    //     target: resetFieldsTriggered
    // }) 
    sample({
        clock: doneTaskToggled,
        source: $tasksKv,
        filter: (kv, id) => id in kv,
        fn: (kv, id) => ({...kv, [id]: {...kv[id], done: !kv[id].status}}),
        target: $tasksKv
    })
    return {
        updateTaskTriggered,
        doneTaskToggled,
        ...abstract
    }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>