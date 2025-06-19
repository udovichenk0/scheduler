import { combine, createEvent, createStore, sample, split } from "effector"
import { spread } from "patronum"

import { bridge } from "@/shared/lib/effector/bridge"
import { SDate, getToday } from "@/shared/lib/date/lib.ts"

import type {
  Status as Status,
  Type as Type,
  EditableTaskFields,
} from "../type.ts"

import { TaskStatus, TaskType } from "./task.model.ts"

export const modifyTaskFactory = ({
  defaultType = "inbox",
  defaultDate = null,
}: {
  defaultType?: Type
  defaultDate?: Nullable<SDate>
}) => {
  const statusChanged = createEvent<Status>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<Type>()
  const dateChanged = createEvent<{
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }>()
  const setDate = createEvent<Nullable<SDate>>()
  const descriptionChanged = createEvent<Nullable<string>>()
  const setStatus = createEvent<Status>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<Nullable<string>>(null)
  const $status = createStore<Status>(TaskStatus.INPROGRESS)
  const $startDate = createStore<Nullable<SDate>>(defaultDate)
  const $dueDate = createStore<Nullable<SDate>>(null)
  const $type = createStore<Type>(defaultType)
  const $isDirty = createStore(false)
  const $isAllowToSubmit = createStore(false)
  const setFieldsTriggered = createEvent<EditableTaskFields>()
  const $fields = combine(
    $title,
    $description,
    $status,
    $type,
    $startDate,
    $dueDate,
    (title, description, status, type, start_date, due_date) => ({
      title,
      description,
      status,
      type,
      start_date,
      due_date,
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

  sample({
    clock: setFieldsTriggered,
    target: spread({
      title: $title,
      description: $description,
      status: $status,
      start_date: $startDate,
      type: $type,
      due_date: $dueDate,
    }),
  })

  split({
    source: statusChanged,
    match: {
      FINISHED: (value) => value == TaskStatus.FINISHED,
      INPROGRESS: (value) => value == TaskStatus.INPROGRESS,
    },
    cases: {
      INPROGRESS: setStatus.prepend<void>(() => TaskStatus.FINISHED),
      FINISHED: setStatus.prepend<void>(() => TaskStatus.INPROGRESS),
    },
  })
  sample({
    clock: descriptionChanged,
    target: $description,
  })

  bridge(() => {
    spread({
      source: dateChanged,
      targets: {
        startDate: $startDate,
        dueDate: $dueDate,
      },
    })
    sample({
      clock: [setDate],
      target: $startDate,
    })

    sample({
      clock: dateChanged,
      source: $type,
      filter: (type, date) => type == TaskType.INBOX && !!date,
      fn: () => TaskType.UNPLACED,
      target: $type,
    })

    sample({
      clock: dateChanged,
      source: $type,
      filter: (type, date) => type == TaskType.UNPLACED && !date,
      fn: () => TaskType.INBOX,
      target: $type,
    })
  })

  bridge(() => {
    sample({
      clock: typeChanged,
      source: $type,
      filter: (currentType, type) => currentType != type,
      fn: (_, type) => type,
      target: $type,
    })
    sample({
      clock: typeChanged,
      filter: (type) => type == TaskType.INBOX,
      fn: () => null,
      target: $startDate,
    })
    sample({
      clock: typeChanged,
      filter: (type) => type == TaskType.UNPLACED,
      fn: () => getToday(),
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
      $dueDate.reinit,
    ],
  })

  return {
    statusChanged,
    titleChanged,
    typeChanged,
    dateChanged,
    setDate,
    descriptionChanged,
    resetFieldsTriggered,
    setFieldsTriggered,
    $title,
    $description,
    $status,
    $type,
    $startDate,
    $dueDate,
    $isAllowToSubmit,
    $fields,
    $isDirty,
  }
}

export type ModifyTaskFactory = ReturnType<typeof modifyTaskFactory>
