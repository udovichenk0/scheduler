import { createEvent, sample, Event } from "effector";
import { spread } from "patronum";
import { $tasksKv } from "@/entities/task";
import { updateTaskQuery } from "@/shared/api/task";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = (updateTaskOpened: Event<number>) => {
  const updateTaskTriggered = createEvent<number>()
  const doneTaskToggled = createEvent<number>()
  const taskUpdated = createEvent()
  const abstract = abstractTaskFactory()
  const { $fields, $isDirty, $title, $description, $status, resetFieldsTriggered } = abstract
  sample({
    clock: updateTaskTriggered,
    filter: $isDirty,
    fn: () => console.log('taskupdated triggered')
  })

  sample({
    clock: updateTaskTriggered,
    source: $fields,
    filter: ({title}) => Boolean(title.length),
    fn: (fields, id) => ({body: {...fields, id}}),
    target: updateTaskQuery.start
  })
  sample({
    clock: updateTaskQuery.finished.success,
    source: $tasksKv,
    fn: (kv, {result:{result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, taskUpdated, resetFieldsTriggered]
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
    taskUpdated,
    ...abstract
  }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>