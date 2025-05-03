import {
  createStore,
  createEvent,
  sample,
  createEffect,
  scopeBind,
  attach,
  Event,
} from "effector"
export type Setupable = {
  setup: Event<void>
  teardown?: Event<void>
}
export const setupListener = <T>({
  event,
  start,
  stop,
}: {
  event: keyof DocumentEventMap
  start: Event<void>
  stop: Event<void>
}) => {
  const $listener = createStore<(() => void) | null>(null)
  const onTriggerEvent = createEvent<T>()

  const startListenerFx = createEffect(() => {
    const boundEvent = scopeBind(onTriggerEvent, { safe: true })
    //@ts-ignore
    document.addEventListener(event, boundEvent)
    return boundEvent
  })
  const stopListenerFx = attach({
    source: $listener,
    effect: (listener) => {
      if (listener) {
        document.removeEventListener(event, listener)
      }
    },
  })

  sample({
    clock: start,
    source: $listener,
    filter: (listener) => !listener,
    target: startListenerFx,
  })
  sample({
    clock: startListenerFx.doneData,
    target: $listener,
  })
  sample({
    clock: stop,
    source: $listener,
    filter: Boolean,
    target: stopListenerFx,
  })
  sample({
    clock: stopListenerFx.doneData,
    target: $listener.reinit,
  })

  return onTriggerEvent
}
