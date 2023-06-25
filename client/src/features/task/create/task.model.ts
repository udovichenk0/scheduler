import { createStore, sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";
export const createTaskFactory = ({ taskModel, defaultType }: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced'
}) => {
  const $type =  createStore<'inbox' | 'unplaced'>(defaultType) 

  const abstract = abstractTaskFactory()
  const { $fields,$isNotAllowToSubmit, resetFieldsTriggered } = abstract


  // fetch on createTaskClosed
  sample({
    clock: taskModel.createTaskClosed,
    source: {fields: $fields, type: $type},
    filter: ({fields}) => Boolean(fields.title.length),
    fn: ({fields, type}) => ({body: {...fields, type}}),
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
