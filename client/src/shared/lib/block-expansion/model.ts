import { createEvent, createStore, sample } from "effector"
import { spread } from "patronum";
import { RefObject } from 'react';
import { TaskDto } from "@/shared/api/task";

export const taskExpansionFactory = () => {
  const closeTaskTriggered = createEvent()
  const createTaskClosed = createEvent()
  const updateTaskClosed = createEvent<number>()
  const updateTaskOpened = createEvent<{task: TaskDto, ref: RefObject<HTMLDivElement>}>()
  const createTaskOpened = createEvent<{ref: RefObject<HTMLDivElement>}>()

  const $ref = createStore<RefObject<HTMLDivElement> | null>(null)
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
    fn: ({task, ref}) => ({id: task.id, ref}), 
    target: spread({
      targets: {
        id: $taskId,
        ref: $ref
      }
    })
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