import {
  createEffect,
  scopeBind,
  createStore,
  sample,
  createEvent,
} from "effector"
import { Timer } from "./config"
import { prepend } from "../effector"

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
  const $worker = createStore(new Worker("src/shared/lib/pomodoro/worker-interval.ts", {type: 'module'}))

  const listenWorkerEventsFx = createEffect((worker: Worker) => {
    const scopedWorkerTick = scopeBind(workerEvent)
    worker.onmessage = scopedWorkerTick
  })
  const startTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({ command: Timer.START })
  })
  const stopTimerFx = createEffect((worker: Worker) => {
    worker.postMessage({ command: Timer.STOP })
  })

  sample({
    clock: workerEvent,
    source: $isRunning,
    filter: (isRunning, { data }) => isRunning && !!data.isRunning,
    target: tick,
  })
  sample({
    clock: tick,
    source: $timer,
    fn: (timer) => timer - 1,
    target: $timer,
  })
  sample({
    clock: startTimer,
    source: $worker,
    filter: (worker) => !worker.onmessage,
    target: listenWorkerEventsFx,
  })

  sample({
    clock: startTimer,
    source: $worker,
    target: [startTimerFx, prepend($isRunning, true)],
  })
  sample({
    clock: stopTimer,
    source: $worker,
    target: [stopTimerFx, prepend($isRunning, false)],
  })
  sample({
    clock: setTimer,
    target: $timer,
  })

  return {
    tick,
    $worker,
    $isRunning,
    $timer,
    setTimer,
    startTimer,
    stopTimer,
  }
}
