import {
  createEffect,
  scopeBind,
  createStore,
  sample,
  createEvent,
} from "effector"

export const createTimer = ({
  defaultTimerDuration = 1500,
}: {
  defaultTimerDuration: number
}) => {
  const workerEvent = createEvent<MessageEvent>()
  const stopTimer = createEvent()
  const startTimer = createEvent()
  const tick = createEvent()
  const setTimer = createEvent<number>()

  const $timer = createStore(defaultTimerDuration)
  const $isRunning = createStore(false)
  const $worker = createStore(new Worker("src/shared/lib/pomodoro/worker.ts"))

  const startListeningFx = createEffect((worker: Worker) => {
    const scopedWorkerTick = scopeBind(workerEvent)
    worker.onmessage = scopedWorkerTick
  })
  const $isWorkerListening = createStore(false).on(
    startListeningFx.done,
    () => true,
  )

  sample({
    clock: workerEvent,
    filter: ({ data }) => !!data.isRunning,
    fn: () => ({}),
    target: tick,
  })
  sample({
    clock: tick,
    source: $timer,
    fn: (timer) => timer - 1,
    target: $timer,
  })

  const startTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({ command: "start" })
  })
  const stopTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({ command: "stop" })
  })
  sample({
    clock: startTimer,
    fn: () => true,
    target: $isRunning,
  })
  sample({
    clock: stopTimer,
    fn: () => false,
    target: $isRunning,
  })

  sample({
    clock: startTimer,
    source: $worker,
    filter: (worker) => !worker.onmessage,
    target: startListeningFx,
  })
  sample({
    clock: startTimer,
    source: $worker,
    target: startTimerFx,
  })
  sample({
    clock: stopTimer,
    source: $worker,
    target: stopTimerFx,
  })
  sample({
    clock: setTimer,
    target: $timer,
  })

  return {
    tick,
    $worker,
    $isWorkerListening,
    $isRunning,
    $timer,
    setTimer,
    startTimer,
    stopTimer,
  }
}
