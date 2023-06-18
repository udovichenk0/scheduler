import { sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const createTaskFactory = (taskModel: ExpensionTaskType) => {
  const abstract = abstractTaskFactory()
  const { $fields,$isNotAllowToSubmit, resetFieldsTriggered } = abstract


  // fetch on createTaskClosed
  sample({
    clock: taskModel.createTaskClosed,
    source: $fields,
    filter: ({title}) => Boolean(title.length),
    fn: (fields) => ({body: fields}),
    target: createTaskQuery.start
  })
  // reset fields and push result to the store on fetch success 
  sample({
    clock: createTaskQuery.finished.success,
    source: $tasksKv,
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, resetFieldsTriggered]
  })

  // close the task and reset fields on task closed
  sample({
    clock: taskModel.closeTaskTriggered,
    filter: $isNotAllowToSubmit,
    target: [taskModel.$newTask.reinit!, resetFieldsTriggered]
  })
  return {
    ...abstract
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
