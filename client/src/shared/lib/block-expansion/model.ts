import { createEvent, createStore, sample } from "effector"

export const taskExpansionFactory = () => {
  const closeTaskTriggered = createEvent()
  const createTaskClosed = createEvent()
  const updateTaskClosed = createEvent<number>()
  const updateTaskOpened = createEvent<number>()
  const createTaskOpened = createEvent()
  
  const $createdToggled = createStore(false)
  const $newTask = createStore(false)
  const $taskId = createStore<number | null>(null)
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
  return {
    updateTaskClosed,
    createTaskClosed,
    $newTask,
    $taskId,
    $createdToggled,
    createTaskOpened,
    updateTaskOpened,
    closeTaskTriggered,
  }
}
export type ExpensionTaskType = ReturnType<typeof taskExpansionFactory>