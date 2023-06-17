import { createEvent, createStore, sample } from "effector"
import { not } from "patronum"

export const taskExpansionFactory = () => {
  const closeTaskTriggered = createEvent()
  const createTaskClosed = createEvent()
  const updateTaskClosed = createEvent<number>()

  const reset = createEvent()
  const updateTaskOpened = createEvent<number>()
  const createTaskOpened = createEvent()

  const $newTask = createStore(false)
  const $taskId = createStore<number | null>(null)
  sample({
    clock: reset,
    target: [$newTask.reinit, $taskId.reinit]
  })
  sample({
    clock: [createTaskOpened, closeTaskTriggered],
    source: $newTask,
    filter: Boolean, 
    target: createTaskClosed
  })
  sample({
    clock: [createTaskOpened, closeTaskTriggered],
    source: $taskId,
    filter: Boolean, 
    target: updateTaskClosed
  })
  
  sample({
    clock: updateTaskOpened,
    filter: Boolean,
    target: $taskId
  })

  sample({
    clock: createTaskOpened,
    source: $newTask,
    filter: not($newTask),
    fn: () => true,
    target: [$newTask]
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
export type ExpensionTaskType = ReturnType<typeof taskExpansionFactory>