import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"

import { createModal } from "@/shared/lib/modal"
import { TaskId, TaskStatus, TaskType } from "@/shared/api/task"
import { bridge } from "@/shared/lib/bridge"

export const $$dateModal = createModal({})
export const $$typeModal = createModal({})

export const modifyTaskFactory = ({
  defaultType = "inbox",
  defaultDate = null,
}: {
  defaultType?: "inbox" | "unplaced"
  defaultDate?: Nullable<Date>
}) => {
  const statusChanged = createEvent<TaskStatus>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<TaskType>()
  const dateChanged = createEvent<Date>()
  const descriptionChanged = createEvent<string>()
  const statusChangedAndUpdated = createEvent<{
    id: TaskId
    status: TaskStatus
  }>()
  const dateChangedAndUpdated = createEvent<{ id: TaskId; date: Date }>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<string>("")
  const $status = createStore<"FINISHED" | "INPROGRESS">("INPROGRESS")
  const $startDate = createStore<Nullable<Date>>(defaultDate)
  const $type = createStore<"inbox" | "unplaced">(defaultType)
  const $isDirty = createStore(false)
  const $isAllowToSubmit = combine(
    $isDirty,
    $title,
    (isDirty, title) => isDirty && Boolean(title),
  )
  const $fields = combine(
    $title,
    $description,
    $status,
    $type,
    $startDate,
    (title, description, status, type, start_date) => ({
      title,
      description,
      status,
      type,
      start_date,
    }),
  )
  sample({
    clock: titleChanged,
    target: $title,
  })
  //!Change implementation
  sample({
    clock: statusChanged,
    fn: (value) => {
      if (value == "FINISHED") {
        return "INPROGRESS"
      }
      return "FINISHED"
    },
    target: $status,
  })
  sample({
    clock: descriptionChanged,
    target: $description,
  })

  bridge(() => {
    sample({
      clock: dateChanged,
      target: [$startDate, $$dateModal.close],
    })
    sample({
      clock: dateChanged,
      source: $type,
      filter: (type, date) => type == "inbox" && Boolean(date),
      fn: () => "unplaced" as const,
      target: $type,
    })

    sample({
      clock: dateChanged,
      source: $type,
      filter: (type, date) => type == "unplaced" && !date,
      fn: () => "inbox" as const,
      target: $type,
    })
  })

  bridge(() => {
    sample({
      clock: typeChanged,
      target: $$typeModal.close,
    })
    sample({
      clock: typeChanged,
      source: $type,
      filter: (currentType, type) => currentType != type,
      fn: (_, type) => type,
      target: $type,
    })
    sample({
      clock: typeChanged,
      filter: (type) => type == "inbox",
      fn: () => null,
      target: $startDate,
    })
    sample({
      clock: typeChanged,
      filter: (type) => type == "unplaced",
      fn: () => dayjs().startOf("day").toDate(),
      target: $startDate,
    })
  })

  sample({
    clock: [
      titleChanged,
      descriptionChanged,
      statusChanged,
      typeChanged,
      dateChanged,
    ],
    fn: () => true,
    target: $isDirty,
  })
  sample({
    clock: resetFieldsTriggered,
    target: [
      $title.reinit,
      $description.reinit,
      $status.reinit,
      $isDirty.reinit,
      $type.reinit,
      $startDate.reinit,
    ],
  })
  return {
    statusChanged,
    titleChanged,
    typeChanged,
    dateChanged,
    descriptionChanged,
    dateChangedAndUpdated,
    resetFieldsTriggered,
    statusChangedAndUpdated,
    $title,
    $description,
    $status,
    $type,
    $startDate,
    $isAllowToSubmit,
    $fields,
    $isDirty,
  }
}

export type ModifyTask = ReturnType<typeof modifyTaskFactory>
