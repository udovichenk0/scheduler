import { createEvent, sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const createTaskFactory = () => {
  const createTaskTriggered = createEvent()
  const taskCreated = createEvent()
  const abstract = abstractTaskFactory()
  const { $fields, resetFieldsTriggered } = abstract

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
  return {
    createTaskTriggered,
    taskCreated,
    ...abstract
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
