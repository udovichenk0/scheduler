import { createEvent, createStore, sample } from "effector"
import { spread, not, and, debug, or } from "patronum";
import { RefObject } from 'react';
import { TaskDto } from "@/shared/api/task";
export const taskExpansionFactory = () => {

  const closeTaskTriggered = createEvent()

  const createTaskClosed = createEvent()
  const updateTaskClosed = createEvent<number>()
  const updateTaskOpened = createEvent<{task: TaskDto, ref: RefObject<HTMLDivElement>}>()
  const createTaskOpened = createEvent<{ref: RefObject<HTMLDivElement>}>()

  const $createdTriggered = createStore(false)
  const $updatedTriggered = createStore(false)

  const $isAllowToOpenUpdate = createStore(true)
  const $isAllowToOpenCreate = createStore(true)

  const $newTask = createStore(false)
  const $taskId = createStore<number | null>(null)

  sample({
    clock: closeTaskTriggered,
    source: $newTask,
    filter: Boolean, 
    target: createTaskClosed
  })

  sample({
    clock: closeTaskTriggered, // try this
    source: $taskId,
    filter: Boolean, 
    target: updateTaskClosed
  })

  sample({
    clock: createTaskOpened,
    filter: or($taskId, $newTask),
    target: closeTaskTriggered
  })

  sample({
    clock: createTaskOpened,
    filter: $isAllowToOpenCreate,
    fn: () => true,
    target: $newTask
  })
  sample({
    clock: createTaskOpened,
    filter: not($isAllowToOpenCreate),
    fn: () => true,
    target: $createdTriggered,
  })
  sample({
    clock: createTaskClosed,
    filter: $isAllowToOpenUpdate,
    target: [$newTask.reinit, $isAllowToOpenUpdate.reinit]
  })

  // update methods
  sample({
    clock: updateTaskOpened,
    filter: and($isAllowToOpenUpdate, $isAllowToOpenCreate),
    fn: ({task}) => task.id,
    target: $taskId
  })

  sample({
    clock: updateTaskClosed,
    filter: $isAllowToOpenCreate,
    target: [$taskId.reinit, $isAllowToOpenCreate.reinit]
  })

  return {
    updateTaskClosed,
    createTaskClosed,
    $newTask,
    $taskId,
    $createdTriggered,
    $updatedTriggered,
    $isAllowToOpenUpdate,
    $isAllowToOpenCreate,
    createTaskOpened,
    updateTaskOpened,
    closeTaskTriggered,
  }
}
export type ExpensionTaskType = ReturnType<typeof taskExpansionFactory>