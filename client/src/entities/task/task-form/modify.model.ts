import dayjs from "dayjs"
import { combine, createEvent, createStore, sample, split } from "effector"

import { createModal } from "@/shared/lib/modal"
import { TaskId, TaskStatus, TaskType } from "@/shared/api/task"
import { bridge } from "@/shared/lib/effector/bridge"

import { TaskStatuses, TaskTypes } from "../task-item"

export const $$dateModal = createModal({})
export const $$typeModal = createModal({})

export const modifyTaskFactory = ({
  defaultType = "inbox",
  defaultDate = null,
}: {
  defaultType?: TaskType
  defaultDate?: Nullable<Date>
}) => {
  const statusChanged = createEvent<TaskStatus>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<TaskType>()
  const dateChanged = createEvent<Date>()
  const descriptionChanged = createEvent<Nullable<string>>()
  const statusChangedAndUpdated = createEvent<{
    id: TaskId
    status: TaskStatus
  }>()

  const setStatus = createEvent<TaskStatus>()

  const dateChangedAndUpdated = createEvent<{ id: TaskId; date: Date }>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<Nullable<string>>(null)
  const $status = createStore<TaskStatus>("INPROGRESS")
  const $startDate = createStore<Nullable<Date>>(defaultDate)
  const $type = createStore<TaskType>(defaultType)
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
      FINISHED: (value) => value == TaskStatuses.FINISHED,
      //@ts-ignore
      INPROGRESS: (value) => value == TaskStatuses.INPROGRESS,
    },
    cases: {
      INPROGRESS: setStatus.prepend(() => TaskStatuses.FINISHED),
      FINISHED: setStatus.prepend(() => TaskStatuses.INPROGRESS),
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
      filter: (type, date) => type == TaskTypes.INBOX && !!date,
      fn: () => TaskTypes.UNPLACED,
      target: $type,
    })

    sample({
      clock: dateChanged,
      source: $type,
      filter: (type, date) => type == TaskTypes.UNPLACED && !date,
      fn: () => TaskTypes.INBOX,
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
      filter: (type) => type == TaskTypes.INBOX,
      fn: () => null,
      target: $startDate,
    })
    sample({
      clock: typeChanged,
      filter: (type) => type == TaskTypes.UNPLACED,
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

export type ModifyTaskFactory = ReturnType<typeof modifyTaskFactory>
