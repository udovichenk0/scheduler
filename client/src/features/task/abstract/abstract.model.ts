import { combine, createEvent, createStore, sample } from "effector"

export const abstractTaskFactory = () => {

  const statusChanged = createEvent<number | void>()
  const titleChanged = createEvent<string>()
  const descriptionChanged = createEvent<string>()
  const resetFieldsTriggered = createEvent()
  const dateChanged = createEvent()

  const $title = createStore('')
  const $description = createStore<string | null>('')
  const $status = createStore<'FINISHED' | 'CANCELED' | 'INPROGRESS'>('INPROGRESS')
  const $startDate = createStore<Date>(new Date())
  const $isDirty = createStore(false)
  const $isNotAllowToSubmit = combine($isDirty, $title, (isDirty, title) => !isDirty || !title.length)
  const $fields = combine($title, $description, $status, $startDate,
    (title, description, status, date) => ({title, description, status, start_date: date}))
  sample({
    clock: resetFieldsTriggered,
    target: [$title.reinit, $description.reinit, $status.reinit, $isDirty.reinit]
  })

  sample({
    clock: titleChanged,
    target: $title
  })
  sample({
    clock: statusChanged,
    source: $status,
    fn: (value) => value == 'FINISHED' ? 'INPROGRESS' : 'FINISHED',
    target: $status
  })
  sample({
    clock: descriptionChanged,
    target: $description
  })
  sample({
    clock: [titleChanged, descriptionChanged, statusChanged],
    fn: () => true,
    target: $isDirty
  })
  return {
    statusChanged,
    titleChanged,
    descriptionChanged,
    resetFieldsTriggered,
    $title,
    $description,
    $isNotAllowToSubmit,
    $status,
    $fields,
    $startDate,
    $isDirty,
  }
}