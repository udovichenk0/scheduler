import { sample } from "effector";
import { spread } from "patronum";
import { $taskKv } from "@/entities/task";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const createTaskFactory = ({ 
  taskModel, 
  defaultType,
  defaultDate,
}: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced',
  defaultDate: Date | null
}) => {
  const abstract = abstractTaskFactory()
  const { 
    $title,
    $status,
    $startDate,
    $description,
    $type,
    titleChanged,
    statusChanged,
    dateChanged,
    descriptionChanged,
    typeChanged,
    $fields,
    $isAllowToSubmit, 
    resetFieldsTriggered } = abstract

  sample({
    clock: taskModel.createTaskOpened,
    fn: () => ({
      start_date: defaultDate,
      type: defaultType
    }),
    target: spread({
      targets: {
        start_date: $startDate,
        type: $type
      }
    })
  })

  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenUpdate
  })
  
  sample({
    clock: taskModel.createTaskClosed,
    source: $fields,
    filter: $isAllowToSubmit,
    fn: (fields) => ({body: fields}),
    target: createTaskQuery.start
  })

  sample({
    clock: createTaskQuery.finished.success,
    source: $taskKv,
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: $taskKv
  })
  sample({
    clock: taskModel.createTaskClosed,
    target: resetFieldsTriggered
  })
  return {
    $title,
    $status,
    $startDate,
    $description,
    $type,
    $isAllowToSubmit,
    titleChanged,
    statusChanged,
    dateChanged,
    descriptionChanged,
    typeChanged,
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
