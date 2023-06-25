import { createEvent, createStore, sample } from "effector";
import { and, not, spread } from "patronum";
import { $tasksKv } from "@/entities/task";
import { updateStatusQuery, updateTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = ({
  taskModel,
  defaultType
}: {
  taskModel: ExpensionTaskType,
  defaultType: 'inbox' | 'unplaced'
}) => {
  const $type = createStore<'inbox' | 'unplaced'>(defaultType)
  const changeStatusTriggered = createEvent<number>()
  const abstract = abstractTaskFactory()
  const { $fields, $isDirty, $title, $description, $status, resetFieldsTriggered, $isNotAllowToSubmit } = abstract

  sample({
    clock: taskModel.updateTaskClosed,
    source: {fields: $fields, type: $type},
    filter: and($title, $isDirty),
    fn: ({fields, type}, id) => ({body: {...fields, type, id}}),
    target: updateTaskQuery.start
  })
  sample({
    clock: [updateTaskQuery.finished.success, updateStatusQuery.finished.success],
    source: $tasksKv,
    fn: (kv, {result:{result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, taskModel.$taskId.reinit!, resetFieldsTriggered]
  })
  sample({
    clock: taskModel.updateTaskOpened,
    source: $tasksKv,
    fn: (kv, id) => ({...kv[id]}),
    target: spread({
      targets: {
        title: $title,
        status: $status,
        description: $description
      }
    })
  })

  sample({
    clock: changeStatusTriggered,
    source: $tasksKv,
    // fix it
    fn: (kv, id) => ({body: {status: kv[id].status == 'FINISHED' ? 'INPROGRESS' as const : 'FINISHED' as const, id}}),
    target: updateStatusQuery.start
  })

  sample({
    clock: taskModel.createTaskOpened,
    filter: not($isNotAllowToSubmit),
    fn: () => true,
    target: taskModel.$createdToggled
  })
  sample({
    clock: taskModel.createTaskOpened,
    filter: not(taskModel.$createdToggled),
    fn: () => true,
    target: taskModel.$newTask
  })
  sample({
    clock: updateTaskQuery.finished.success,
    filter: taskModel.$createdToggled,
    fn: () => true,
    target: [taskModel.$newTask, taskModel.$createdToggled.reinit]
  })
  sample({
    clock: [taskModel.closeTaskTriggered, taskModel.createTaskOpened],
    filter: $isNotAllowToSubmit,
    target: [taskModel.$taskId.reinit, resetFieldsTriggered]
  })
  return {
    ...abstract,
    changeStatusTriggered
  }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>