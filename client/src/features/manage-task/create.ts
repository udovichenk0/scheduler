import { attachOperation } from "@farfetched/core"
import { merge, sample, createEvent } from "effector"
import { and } from "patronum"
import { v4 } from "uuid"

import { $$session } from "@/entities/session/session.model.ts"
import { ModifyTaskFactory } from "@/entities/task/model/modify.model"
import { TaskModel } from "@/entities/task/model/task.model"
import { Task } from "@/entities/task/type"

import { taskApi } from "@/shared/api/task/task.api.ts"
import { bridge } from "@/shared/lib/effector/bridge"
import { toApiTaskFields } from "@/shared/api/task/task.dto"

export const createTaskFactory = ({
  $$modifyTask,
  taskModel,
}: {
  $$modifyTask: ModifyTaskFactory
  taskModel: TaskModel
}) => {
  const { $fields, $isAllowToSubmit, resetFieldsTriggered } = $$modifyTask
  const createTaskTriggered = createEvent()
  const optimisticTaskCreated = createEvent<Task>()
  // const createTaskLsAttach = attachOperation(taskApi.createTaskLs)
  const createTaskMutationAttach = attachOperation(taskApi.createTaskMutation)

  const taskSuccessfullyCreated = merge([
    // createTaskLsAttach.finished.success,
    createTaskMutationAttach.finished.success,
  ])

  bridge(() => {
    sample({
      clock: createTaskTriggered,
      source: $fields,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      fn: (fields) => {
        const optimisticTask: Task = {
          id: v4(),
          title: fields.title,
          description: fields.description,
          status: fields.status,
          type: fields.type,
          start_date: fields.start_date,
          due_date: fields.due_date,
          user_id: "",
          date_created: new Date(),
          is_trashed: false,
        }
        return optimisticTask
      },
      target: optimisticTaskCreated,
    })
    sample({
      clock: optimisticTaskCreated,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      fn: (fields) => {
        const tempId = fields.id
        return {
          tempId,
          ...toApiTaskFields(fields),
        }
      },
      target: createTaskMutationAttach.start,
    })
    sample({
      clock: optimisticTaskCreated,
      filter: and($isAllowToSubmit, $$session.$isAuthenticated),
      target: taskModel.addTaskTriggered,
    })
    sample({
      clock: createTaskMutationAttach.finished.failure,
      fn: ({ params }) => {
        //@ts-ignore
        const tempId = params?.["tempId"]
        return tempId
      },
      target: taskModel.taskDeleted,
    })

    sample({
      clock: createTaskTriggered,
      target: resetFieldsTriggered,
    })

    // sample({
    //   clock: createTaskTriggered,
    //   source: $fields,
    //   filter: and($isAllowToSubmit, not($$session.$isAuthenticated)),
    //   target: createTaskLsAttach.start,
    // })
  })

  // sample({
  //   clock: createTaskMutationAttach.finished.failure,
  //   source: taskModel.$tasks,
  //   fn: (tasks, { params }) => {
  //     console.log(params?.["tempId"])
  //     console.log(tasks?.find((task) => task.title === "gg"))
  //     console.log(tasks?.find((task) => task.id === params?.["tempId"]))
  //     //@ts-ignore
  //   },
  //   // target: taskModel.taskDeleted
  // })
  // sample({
  //   clock: taskSuccessfullyCreated,
  //   fn: ({ result }) => taskToDomain(result),
  //   target: [resetFieldsTriggered, taskModel.addTaskTriggered],
  // })

  return {
    ...$$modifyTask,
    taskSuccessfullyCreated,
    createTaskTriggered,
    $isCreating: taskApi.createTaskMutation.$pending,
  }
}
