import { combine, createEvent, createStore, sample } from "effector"
import { spread } from "patronum"

export const modifyFormFactory = ({
  defaultType,
  defaultDate
}:{
  defaultType: 'inbox' | 'unplaced',
  defaultDate: Date | null
}) => {

  const statusChanged = createEvent<'FINISHED' | 'INPROGRESS'>()
  const titleChanged = createEvent<string>()
  const typeChanged = createEvent<{type: 'inbox' | 'unplaced', date: null | Date}>()
  const dateChanged = createEvent<Date>()
  const descriptionChanged = createEvent<string>()
  const resetFieldsTriggered = createEvent()

  const $title = createStore('')
  const $description = createStore<string>('')
  const $status = createStore<'FINISHED' | 'INPROGRESS'>('INPROGRESS')
  const $startDate = createStore<Date | null>(defaultDate)

  const $type = createStore<'inbox' | 'unplaced'>(defaultType)

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
    clock: dateChanged,
    target: $startDate
  })
  sample({
    clock: typeChanged,
    source: $type,
    filter: (currentType, {type}) => currentType != type,
    fn: (_, payload) => payload,
    target: spread({
      targets: {
        date: $startDate,
        type: $type
      }
    })
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