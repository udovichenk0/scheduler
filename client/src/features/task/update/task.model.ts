import { createEvent, sample } from "effector";
import { debug, spread, not } from "patronum";
import { $taskKv } from "@/entities/task";
import { updateStatusQuery, updateTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = ({
  taskModel,
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
    clock: taskModel.updateTaskOpened,
    fn: ({task}) => task,
    target: spread({
      targets: {
        title: $title,
        description: $description,
        status: $status,
        start_date: $startDate,
        type: $type
      }
    })
  })
  debug($title)
  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenCreate
  })

  sample({
    clock: taskModel.updateTaskClosed,
    filter: $isAllowToSubmit,
    fn: () => true,
    target: taskModel.$updatedTriggered
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
    source: $taskKv,
    fn: (kv, {result:{result}}) => ({...kv, [result.id]: result}),
    target: [$taskKv, taskModel.$taskId.reinit, resetFieldsTriggered, taskModel.$updatedTriggered.reinit]
  })

  sample({
    clock: taskModel.updateTaskClosed,
    filter: not(taskModel.$updatedTriggered),
    target: resetFieldsTriggered
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
    $isAllowToSubmit,
    $description,
    $startDate,
    $status,
    $type,
    changeStatusTriggered
  }
}



export type UpdateTaskType = ReturnType<typeof updateTaskFactory>