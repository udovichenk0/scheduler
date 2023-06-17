import { createEvent, sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const createTaskFactory = (taskModel: ExpensionTaskType) => {
  const createTaskTriggered = createEvent()
  const taskCreated = createEvent()
  const abstract = abstractTaskFactory()
  const { $fields,$isAllowToSubmit, resetFieldsTriggered } = abstract

  sample({
    clock: createTaskTriggered,
    fn: () => console.log('taskcreated triggered')
  })

  sample({
    clock: createTaskTriggered,
    source: $fields,
    filter: ({title}) => Boolean(title.length),
    fn: (fields) => ({body: fields}),
    target: createTaskQuery.start
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $tasksKv,
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, resetFieldsTriggered, taskCreated]
  })
  sample({
    clock: taskModel.createTaskClosed,
    target: createTaskTriggered
  })
  sample({
    clock: taskCreated,
    target: taskModel.$newTask.reinit!
  })
  
  sample({
    clock: taskModel.createTaskOpened,
    target: taskModel.$taskId.reinit!
  })
  return {
    createTaskTriggered,
    ...abstract
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
