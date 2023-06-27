import { combine, createEvent, createStore, sample } from "effector"

export const abstractTaskFactory = () => {

  const statusChanged = createEvent<'FINISHED' | 'INPROGRESS'>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent()
  const dateChanged = createEvent()
  const descriptionChanged = createEvent<string>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore('')
  const $description = createStore<string | null>('')
  const $status = createStore<'FINISHED' | 'INPROGRESS'>('INPROGRESS')
  const $startDate = createStore<Date | null>(new Date())
  const $type = createStore<'inbox' | 'unplaced'>('inbox')

  const $isDirty = createStore(false)
  const $isAllowToSubmit = combine($isDirty, $title , (isDirty, title) => isDirty && Boolean(title))
  const $fields = combine($title, $description, $status,$type, $startDate,
    (title, description, status, type, start_date) => ({title, description, status, type, start_date}))
  sample({
    clock: resetFieldsTriggered,
    target: [$title.reinit, $description.reinit, $status.reinit, $isDirty.reinit, $type.reinit, $startDate.reinit]
  })

  sample({
    clock: titleChanged,
    target: $title
  })
  sample({
    clock: statusChanged,
    fn: (value) => value == 'FINISHED' ? 'INPROGRESS' : 'FINISHED',
    target: $status
  })
  sample({
    clock: descriptionChanged,
    target: $description
  })
  sample({
    clock: [titleChanged, descriptionChanged, statusChanged, typeChanged, dateChanged],
    fn: () => true,
    target: $isDirty
  })
  return {
    statusChanged,
    titleChanged,
    typeChanged,
    dateChanged,
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