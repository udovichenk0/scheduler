import { createEvent, createStore, sample } from "effector"

export const taskModelFactory = () => {
    const closeTaskTriggered = createEvent()
    const createTaskClosed = createEvent()
    const updateTaskClosed = createEvent<number>()

    const reset = createEvent()
    const updateTaskOpened = createEvent<number>()
    const createTaskOpened = createEvent()

    const $newTask = createStore(false)
    const $taskId = createStore<number | null>(null)
    sample({
        clock: [createTaskOpened, closeTaskTriggered],
        source: $newTask,
        filter: Boolean, 
        target: createTaskClosed
    })
    sample({
        clock: [updateTaskOpened,createTaskOpened, closeTaskTriggered],
        source: $taskId,
        filter: Boolean, 
        target: updateTaskClosed
    })

    sample({
        clock: updateTaskOpened,
        filter: Boolean,
        target: [$taskId, $newTask.reinit!]
    })

    sample({
        clock: createTaskOpened,
        source: $newTask,
        fn: (task) => !task,
        target: [$newTask, $taskId.reinit!]
    })
    sample({
        clock: [reset, closeTaskTriggered],
        target: $newTask.reinit!
    })
    sample({
        clock: [reset, closeTaskTriggered],
        target: $taskId.reinit!
    })

    return {
        updateTaskClosed,
        createTaskClosed,
        $newTask,
        $taskId,
        createTaskOpened,
        updateTaskOpened,
        closeTaskTriggered,
        reset
    }
}
export type ExpandedTaskModelType = ReturnType<typeof taskModelFactory>