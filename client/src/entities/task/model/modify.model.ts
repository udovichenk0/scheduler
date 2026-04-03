import { combine, createEvent, createStore, sample } from "effector"
import { spread } from "patronum"

import { SDate, getToday } from "@/shared/lib/date/lib.ts"

import type {
  Status as Status,
  Type as Type,
  EditableTaskFields,
  Priority,
} from "../type.ts"
import { hasDate } from "../lib.ts"

import { TaskPriority, TaskStatus, TaskType } from "./task.model.ts"

export const createTaskEditor = () => {
  const statusChanged = createEvent<Status>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<Type>()
  const priorityChanged = createEvent<Priority>()
  const dateChanged = createEvent<{
    startDate: Nullable<SDate>
    dueDate: Nullable<SDate>
  }>()
  const descriptionChanged = createEvent<Nullable<string>>()
  const setStatus = createEvent<Status>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore("")
  const $description = createStore<Nullable<string>>(null)
  const $status = createStore<Status>(TaskStatus.TODO)
  const $startDate = createStore<Nullable<SDate>>(null)
  const $dueDate = createStore<Nullable<SDate>>(null)
  const $type = createStore<Type>(TaskType.INBOX)
  const $priority = createStore<Priority>(TaskPriority.NONE)
  const $isDirty = createStore(false)
  const $isAllowToSubmit = createStore(false)
  const setFieldsTriggered = createEvent<Partial<EditableTaskFields>>()
  const initTaskFields = createEvent<EditableTaskFields>()

  const $fields = combine(
    $title,
    $description,
    $status,
    $type,
    $startDate,
    $dueDate,
    $priority,
    (
      title,
      description,
      status,
      type,
      start_date,
      due_date,
      priority,
    ): EditableTaskFields => ({
      title,
      description,
      status,
      type,
      start_date,
      due_date,
      priority,
    }),
  )

  const $initialTaskFields = createStore<EditableTaskFields>(
    {} as EditableTaskFields,
  )
  sample({
    clock: initTaskFields,
    target: $initialTaskFields,
  })

  const $changedFields = combine(
    $fields,
    $initialTaskFields,
    (currentFields, initialFields): Partial<EditableTaskFields> => {
      return Object.fromEntries(
        Object.entries(initialFields).filter(([key, value]) => {
          return value !== currentFields[key as keyof EditableTaskFields]
        }),
      )
    },
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
    source: $fields,
    fn: (fields, newFields) => {
      return {
        ...fields,
        ...newFields,
      }
    },
    target: spread({
      title: $title,
      description: $description,
      status: $status,
      start_date: $startDate,
      type: $type,
      due_date: $dueDate,
      priority: $priority,
    }),
  })

  sample({
    clock: setFieldsTriggered,
    source: $fields,
  })

  sample({
    clock: statusChanged,
    target: setStatus,
  })
  sample({
    clock: descriptionChanged,
    target: $description,
  })
  sample({
    clock: priorityChanged,
    target: $priority,
  })

  spread({
    source: dateChanged,
    targets: {
      startDate: $startDate,
      dueDate: $dueDate,
    },
  })
  sample({
    clock: dateChanged,
    source: $type,
    fn: (type, date) => {
      if (type == TaskType.INBOX) {
        if (hasDate(date)) return TaskType.UNPLACED
      } else {
        if (!hasDate(date)) return TaskType.INBOX
      }
      return type
    },
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

  sample({
    clock: [
      titleChanged,
      descriptionChanged,
      statusChanged,
      typeChanged,
      dateChanged,
      priorityChanged,
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
      $priority.reinit,
      $initialTaskFields.reinit,
    ],
  })

  return {
    statusChanged,
    titleChanged,
    typeChanged,
    dateChanged,
    priorityChanged,
    descriptionChanged,
    resetFieldsTriggered,
    setFieldsTriggered,
    initTaskFields,
    $title,
    $description,
    $status,
    $type,
    $startDate,
    $dueDate,
    $priority,
    $isAllowToSubmit,
    $fields,
    $isDirty,
    $changedFields,
  }
}

export type TaskEditor = ReturnType<typeof createTaskEditor>
