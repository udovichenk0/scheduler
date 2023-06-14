import { createEvent, createStore, sample } from "effector"

export const taskModelFactory = () => {
    const closeTaskTriggered = createEvent()
    const taskCreated = createEvent()
    const taskUpdated = createEvent<number>()

    const reset = createEvent()
    const updateTaskOpened = createEvent<number>()
    const createTaskOpened = createEvent()

    const $newTask = createStore(false)
    const $taskId = createStore<number | null>(null)
    sample({
        clock: [createTaskOpened, closeTaskTriggered],
        source: $newTask,
        filter: Boolean, 
        target: taskCreated
    })
    sample({
        clock: [updateTaskOpened,createTaskOpened, closeTaskTriggered],
        source: $taskId,
        filter: Boolean, 
        target: taskUpdated
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
        taskUpdated,
        taskCreated,
        $newTask,
        $taskId,
        createTaskOpened,
        updateTaskOpened,
        closeTaskTriggered,
        reset
    }
}
export type ExpandedTaskModelType = ReturnType<typeof taskModelFactory>