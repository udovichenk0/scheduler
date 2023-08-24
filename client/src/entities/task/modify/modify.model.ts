import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"

import { TaskStatus } from "../tasks"

export const modifyTask = ({
  defaultType = "inbox",
  defaultDate = null,
}: {
  defaultType?: "inbox" | "unplaced"
  defaultDate?: Nullable<Date>
}) => {
  const statusChanged = createEvent<"FINISHED" | "INPROGRESS">()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<"inbox" | "unplaced">()
  const dateChanged = createEvent<Date>()
  const dateChangedById = createEvent<{ date: Date; id: string }>()
  const descriptionChanged = createEvent<string>()
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
  sample({
    clock: statusChanged,
    fn: (value) => (value == "FINISHED" ? "INPROGRESS" : "FINISHED"),
    target: $status,
  })
  sample({
    clock: descriptionChanged,
    target: $description,
  })
  sample({
    clock: dateChanged,
    target: $startDate,
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
    dateChangedById,
    descriptionChanged,
    resetFieldsTriggered,
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

export const modifyTaskFactory = ({
  defaultType = "inbox",
  defaultDate = null,
}: {
  defaultType?: "inbox" | "unplaced"
  defaultDate?: Nullable<Date>
}) => {
  const statusChanged = createEvent<"FINISHED" | "INPROGRESS">()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<"inbox" | "unplaced">()
  const dateChanged = createEvent<Date>()
  const descriptionChanged = createEvent<string>()
  const statusChangedAndUpdated = createEvent<{
    id: string
    status: TaskStatus
  }>()
  const dateChangedAndUpdated = createEvent<{ id: string; date: Date }>()
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
  sample({
    clock: dateChanged,
    target: $startDate,
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

export type ModifyTask = ReturnType<typeof modifyTask>
