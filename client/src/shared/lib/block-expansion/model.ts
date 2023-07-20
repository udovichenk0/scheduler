import { createEvent, createStore, sample } from "effector"
import { not, and, or } from "patronum";
import { RefObject } from 'react';
import { TaskDto } from "@/shared/api/task";
export const taskExpansionFactory = () => {

  const closeTaskTriggered = createEvent()

  const createTaskClosed = createEvent()
  const updateTaskClosed = createEvent<number>()
  const updateTaskOpened = createEvent<{task: TaskDto, ref: RefObject<HTMLDivElement>}>()
  const createTaskToggled = createEvent<{date: Date | null}>()

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
    clock: closeTaskTriggered,
    source: $taskId,
    filter: Boolean, 
    target: updateTaskClosed
  })

  sample({
    clock: createTaskToggled,
    filter: or($taskId, $newTask),
    target: closeTaskTriggered
  })

  sample({
    clock: createTaskToggled,
    filter: and($isAllowToOpenCreate, not($createdTriggered)),
    fn: () => true,
    target: $newTask
  })
  sample({
    clock: createTaskToggled,
    filter: not($isAllowToOpenCreate),
    fn: () => true,
    target: $createdTriggered,
  })
  sample({
    clock: createTaskClosed,
    filter: $isAllowToOpenUpdate,
    target: [$newTask.reinit, $isAllowToOpenUpdate.reinit]
  })

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
    createTaskToggled,
    updateTaskOpened,
    closeTaskTriggered,
  }
}
export type ExpensionTaskType = ReturnType<typeof taskExpansionFactory>