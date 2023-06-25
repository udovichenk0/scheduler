import { createStore, sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";
export const createTaskFactory = ({ 
  taskModel, 
  defaultType,
  defaultDate
}: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced',
  defaultDate: Date | null
}) => {
  const $type =  createStore<'inbox' | 'unplaced'>(defaultType) 
  const $date = createStore<Date | null>(defaultDate)
  const abstract = abstractTaskFactory()
  const { $fields,$isNotAllowToSubmit, resetFieldsTriggered } = abstract

  sample({
    clock: taskModel.createTaskClosed,
    source: {fields: $fields, type: $type, date: $date},
    filter: ({fields}) => Boolean(fields.title.length),
    fn: ({fields, type, date}) => ({body: {...fields,start_date: date, type}}),
    target: createTaskQuery.start
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $tasksKv,
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, resetFieldsTriggered]
  })

  sample({
    clock: taskModel.closeTaskTriggered,
    filter: $isNotAllowToSubmit,
    target: [taskModel.$newTask.reinit!, resetFieldsTriggered]
  })
  return {
    $type,
    ...abstract
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
