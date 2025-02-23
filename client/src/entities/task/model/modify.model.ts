import dayjs from "dayjs"
import { combine, createEvent, createStore, sample, split } from "effector"

import { bridge } from "@/shared/lib/effector/bridge"

import { TaskStatus, TaskType } from "./task.model.ts"
import type { TaskStatus as Status, TaskType as Type, EditableTaskFields } from '../type.ts'
import { spread } from "patronum"

export const modifyTaskFactory = ({
  defaultType = "inbox",
  defaultDate = null
}: {
  defaultType?: Type
  defaultDate?: Nullable<Date>
}) => {
  const statusChanged = createEvent<Status>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<Type>()
  const dateChanged = createEvent<Date>()
  const setDate = createEvent<Nullable<Date>>()
  const descriptionChanged = createEvent<Nullable<string>>()
  const setStatus = createEvent<Status>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<Nullable<string>>(null)
  const $status = createStore<Status>(TaskStatus.INPROGRESS)
  const $startDate = createStore<Nullable<Date>>(defaultDate)
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
    (title, description, status, type, start_date) => ({
      title,
      description,
      status,
      type,
      start_date,
    }),
  )

  sample({
    clock: setDate,
    fn: (d) => console.log(d)
  })
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
    sample({
      clock: [dateChanged,setDate],
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
    setDate,
    descriptionChanged,
    resetFieldsTriggered,
    setFieldsTriggered,
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
