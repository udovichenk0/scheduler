import { sample } from "effector";
import { not, and } from "patronum";
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
  defaultDate: Date | null,
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
    fn: (fields) => console.log({body: fields}),
    // target: createTaskQuery.start
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $taskKv,
    filter: not(taskModel.$createdTriggered),
    fn: (kv, {result: {result}}) => ({...kv, [result.id]: result}),
    target: [$taskKv, taskModel.$newTask.reinit, resetFieldsTriggered]
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
