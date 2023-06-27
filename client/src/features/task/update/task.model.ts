import { createEvent, sample } from "effector";
import { $tasksKv } from "@/entities/task";
import { updateStatusQuery, updateTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = ({
  taskModel,
  defaultType,
  defaultDate
}: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced',
  defaultDate: Date | null
}) => {
  const { 
    statusChanged, 
    titleChanged, 
    dateChanged, 
    typeChanged, 
    descriptionChanged, 
    resetFieldsTriggered,
    $isAllowToSubmit,
    $fields,
    $title,
    $description,
    $startDate,
    $status,
    $type
  } = abstractTaskFactory()

  const changeStatusTriggered = createEvent<number>()

  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenCreate
  })
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: $isAllowToSubmit,
    fn: (fields, id) => ({body: {...fields, id}}),
    target: updateTaskQuery.start
  })
  sample({
    clock: [updateTaskQuery.finished.success, updateStatusQuery.finished.success],
    source: $tasksKv,
    fn: (kv, {result:{result}}) => ({...kv, [result.id]: result}),
    target: [resetFieldsTriggered, $tasksKv, taskModel.$taskId.reinit]
  })

  sample({
    clock: updateTaskQuery.finished.success,
    filter: taskModel.$createdTriggered,
    fn: () => true,
    target: [taskModel.$newTask, taskModel.$createdTriggered.reinit]
  })

  return {
    statusChanged, 
    titleChanged, 
    dateChanged, 
    typeChanged, 
    descriptionChanged,
    $title,
    $description,
    $startDate,
    $status,
    $type,
    changeStatusTriggered
  }
}



export type UpdateTaskType = ReturnType<typeof updateTaskFactory>