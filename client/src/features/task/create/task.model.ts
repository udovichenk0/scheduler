import { sample } from "effector";
import { spread, not, and } from "patronum";
import { modifyFormFactory } from "@/entities/task/modify";
import { $taskKv } from "@/entities/task/tasks";
import { createTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";

export const createTaskFactory = ({ 
  taskModel, 
  defaultType,
  defaultDate,
}: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced',
  defaultDate: Date | null
}) => {
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
    resetFieldsTriggered } = modifyFormFactory({
      defaultType,
      defaultDate,
    })
    
  sample({
    clock: taskModel.createTaskOpened,
    filter: not($isAllowToSubmit),
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
    clock: taskModel.createTaskOpened,
    filter: and($isAllowToSubmit, taskModel.$newTask),
    fn: () => true,
    target: taskModel.$createdTriggered
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
    filter: not(taskModel.$createdTriggered),
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: $taskKv
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $taskKv,
    filter: not(taskModel.$createdTriggered),
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [taskModel.$newTask.reinit, resetFieldsTriggered]
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $taskKv,
    filter: taskModel.$createdTriggered,
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [$taskKv, resetFieldsTriggered, taskModel.$createdTriggered.reinit]
  })
  sample({
    clock: taskModel.createTaskClosed,
    filter: not($isAllowToSubmit),
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
