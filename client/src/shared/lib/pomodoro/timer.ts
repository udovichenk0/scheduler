import { createEffect, scopeBind, createStore, sample, createEvent, Event } from "effector"

export const createTimer = <S, T>({
  stop,
  start,
  defaultTimerDuration = 1500,
}: {
  stop: Event<S>,
  start: Event<T>,
  defaultTimerDuration: number
}) => {
  const workerEvent = createEvent<MessageEvent>()
  const tick = createEvent()
  const setTimer = createEvent<number>()

  const $timer = createStore(defaultTimerDuration)

  const $worker = createStore(new Worker('src/shared/lib/pomodoro/worker.ts'))
  const startListeningFx = createEffect((worker: Worker) => {
    const scopedWorkerTick = scopeBind(workerEvent)
    worker.onmessage = scopedWorkerTick
  })
  sample({
    clock: workerEvent,
    fn: () => ({}),
    target: tick
  })
  sample({
    clock: tick,
    source: $timer,
    fn: (timer) => timer - 1,
    target: $timer,
  })
  const startTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({command: 'start'})
  })
  const stopTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({command: 'stop'})
  })
  const $isWorkerListening = createStore(false)
    .on(startListeningFx.done, () => true);
  sample({
    clock: start,
    source: $worker,
    filter: worker => !worker.onmessage,
    target: startListeningFx
  })
  sample({
    clock: start,
    source: $worker,
    target: startTimerFx
  })
  sample({
    clock: stop,
    source: $worker,
    target: stopTimerFx
  })
  sample({
    clock: setTimer,
    target: $timer
  })

  return {
    tick,
    $worker,
    $isWorkerListening,
    $timer,
    setTimer
  }
}