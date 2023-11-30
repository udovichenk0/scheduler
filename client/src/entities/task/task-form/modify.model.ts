import dayjs from "dayjs"
import { combine, createEvent, createStore, sample, split } from "effector"

import { createModal } from "@/shared/lib/modal"
import { TaskId, TaskStatus, TaskType } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

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

  const setStatus = createEvent<TaskStatus>()

  const dateChangedAndUpdated = createEvent<{ id: TaskId; date: Date }>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<string>("")
  const $status = createStore<"FINISHED" | "INPROGRESS">("INPROGRESS")
  const $startDate = createStore<Nullable<Date>>(defaultDate)
  const $type = createStore<"inbox" | "unplaced">(defaultType)
  const $isDirty = createStore(false)
  const $isAllowToSubmit = createStore(false)

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
    source: {
      d: $isDirty,
      t: $title,
    },
    fn: ({ d, t }) => d && Boolean(t),
    target: $isAllowToSubmit,
  })

  sample({
    clock: titleChanged,
    target: $title,
  })
  sample({
    clock: setStatus,
    target: $status,
  })

  //* That works well but with prepend it get typescript error
  split({
    //@ts-ignore
    source: statusChanged,
    match: {
      //@ts-ignore
      FINISHED: (value) => value == "FINISHED",
      //@ts-ignore
      INPROGRESS: (value) => value == "INPROGRESS",
    },
    cases: {
      INPROGRESS: setStatus.prepend(() => "FINISHED"),
      FINISHED: setStatus.prepend(() => "INPROGRESS"),
    },
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

export type ModifyTask = ReturnType<typeof modifyTaskFactory> // write ts-morph for unused exports
