import { createEvent, sample } from "effector";
import { and, not, spread } from "patronum";
import { $tasksKv } from "@/entities/task";
import { updateTaskQuery } from "@/shared/api/task";
import { ExpensionTaskType } from "@/shared/lib/block-expansion";
import { abstractTaskFactory } from "../abstract/abstract.model";

export const updateTaskFactory = (taskModel: ExpensionTaskType) => {
  const doneTaskToggled = createEvent<number>()

  const abstract = abstractTaskFactory()
  const { $fields, $isDirty, $title, $description, $status, resetFieldsTriggered, $isNotAllowToSubmit } = abstract

  // start fetching if $title is not empty and $isDirty is true
  sample({
    clock: taskModel.updateTaskClosed,
    source: $fields,
    filter: and($title, $isDirty),
    fn: (fields, id) => ({body: {...fields, id}}),
    target: updateTaskQuery.start
  })
  // after request succeed set the data to the store and reset stores
  sample({
    clock: updateTaskQuery.finished.success,
    source: $tasksKv,
    fn: (kv, {result:{result}}) => ({...kv, [result.id]: result}),
    target: [$tasksKv, taskModel.$taskId.reinit!, resetFieldsTriggered]
  })
  // fill the input fields when updateTask opened 
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
  
  // if we pressed createTaskOpened and its not allow to submit so that we set $createdToggled to true 
  sample({
    clock: taskModel.createTaskOpened,
    filter: not($isNotAllowToSubmit),
    fn: () => true,
    target: taskModel.$createdToggled
  })
  // if we trigger createTaskOpened and we didn't updated task so then just close the newTask
  sample({
    clock: taskModel.createTaskOpened,
    filter: not(taskModel.$createdToggled),
    fn: () => true,
    target: taskModel.$newTask
  })
  // otherwise if we updated task and createdToggled is true, then close task after task updated successfully
  sample({
    clock: updateTaskQuery.finished.success,
    filter: taskModel.$createdToggled,
    fn: () => true,
    target: [taskModel.$newTask, taskModel.$createdToggled.reinit]
  })
  // if we close the task and its not allowded to submit so then resetFields and close updated task
  sample({
    clock: [taskModel.closeTaskTriggered, taskModel.createTaskOpened],
    filter: $isNotAllowToSubmit,
    target: [taskModel.$taskId.reinit, resetFieldsTriggered]
  })
  return {
    doneTaskToggled,
    ...abstract
  }
}

export type UpdateTaskType = ReturnType<typeof updateTaskFactory>