import { sample } from "effector"
import { not, and, condition } from "patronum"
import { modifyFormFactory } from "@/entities/task/modify"
import { $taskKv } from "@/entities/task/tasks"
import { createTaskQuery } from "@/shared/api/task"
import { ExpensionTaskType } from "@/shared/lib/task-accordion-factory"

export const createTaskFactory = ({
  taskModel,
  defaultType,
  defaultDate,
}: {
  taskModel: ExpensionTaskType
  defaultType: "inbox" | "unplaced"
  defaultDate: Nullable<Date>
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
    resetFieldsTriggered,
  } = modifyFormFactory({
    defaultType,
    defaultDate,
  })

  sample({
    clock: taskModel.createTaskToggled,
    filter: taskModel.$createdTriggered,
    fn: ({ date }) => date,
    target: $startDate,
  })

  sample({
    clock: $isAllowToSubmit,
    fn: (val) => !val,
    target: taskModel.$isAllowToOpenUpdate,
  })
  sample({
    clock: taskModel.createTaskToggled,
    filter: and($isAllowToSubmit, taskModel.$newTask),
    fn: () => true,
    target: taskModel.$createdTriggered,
  })
  sample({
    clock: taskModel.createTaskClosed,
    source: $fields,
    filter: $isAllowToSubmit,
    fn: (fields) => ({ body: fields }),
    target: createTaskQuery.start,
  })
  sample({
    clock: createTaskQuery.finished.success,
    source: $taskKv,
    fn: (kv, { result: { result } }) => ({ ...kv, [result.id]: result }),
    target: [$taskKv, resetFieldsTriggered],
  })
  condition({
    source: createTaskQuery.finished.success,
    if: taskModel.$createdTriggered,
    then: taskModel.$createdTriggered.reinit!,
    else: taskModel.$newTask.reinit!,
  })

  sample({
    clock: taskModel.createTaskClosed,
    filter: not($isAllowToSubmit),
    target: resetFieldsTriggered,
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
    query: createTaskQuery,
  }
}

export type CreateTaskType = ReturnType<typeof createTaskFactory>
