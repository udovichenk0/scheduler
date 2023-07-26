import {
  attach,
  createEvent,
  createStore,
  sample,
  createEffect,
} from "effector"
import { interval } from "patronum"
import sound from "./assets/timer.mp3"

const DEFAULT_WORK_TIME = 1500 // 25mins
const DEFAULT_SHORT_BREAK_TIME = 300 // 5min
const DEFAULT_LONG_BREAK_TIME = 900 // 15min
const DEFAULT_PROGRESS_BAR = 785 // if 785 then progress is 0% otherwise its 100%
const LONG_BREAK_STAGE = 4
export const audio = new Audio(sound)

const defaultStages = {
  1: {
    fulfilled: false,
  },
  2: {
    fulfilled: false,
  },
  3: {
    fulfilled: false,
  },
  4: {
    fulfilled: false,
  },
}
export const timeSelected = createEvent<number>()
export const startTimerTriggered = createEvent()
export const stopTimerTriggered = createEvent()
export const resetTimerTriggered = createEvent()
const toggleTimerState = createEvent()
const timePassed = createEvent()

const $kvStages = createStore(defaultStages)

export const $stages = $kvStages.map((stages) => {
  return Object.values(stages)
})

const $activeStageId = createStore(1)
export const $selectedTime = createStore(DEFAULT_WORK_TIME)

export const $workTime = createStore(DEFAULT_WORK_TIME)
export const $shortBreakTime = createStore(DEFAULT_SHORT_BREAK_TIME)
export const $longBreakTime = createStore(DEFAULT_LONG_BREAK_TIME)

export const $currentStaticTime = createStore(DEFAULT_WORK_TIME)

export const $isWorkTime = createStore(true).on(
  toggleTimerState,
  (isWorkTime) => !isWorkTime,
)

export const $audio = createStore(audio)
export const $passingTime = createStore(DEFAULT_WORK_TIME)
export const $progress = createStore(DEFAULT_PROGRESS_BAR)

export const { tick, isRunning: $isTicking } = interval({
  start: startTimerTriggered,
  stop: stopTimerTriggered,
  timeout: 1000,
})

const finishTimerFx = attach({
  source: $audio,
  effect: createEffect((timer: HTMLAudioElement) => {
    timer.play()
  }),
})

sample({
  clock: tick,
  source: $passingTime,
  fn: (timer) => timer - 1,
  target: $passingTime,
})

sample({
  clock: tick,
  source: { currentStaticTime: $currentStaticTime, progress: $progress },
  fn: ({ currentStaticTime, progress }) =>
    progress - DEFAULT_PROGRESS_BAR / currentStaticTime,
  target: $progress,
})

sample({
  clock: timeSelected,
  target: [
    $passingTime,
    $currentStaticTime,
    $selectedTime,
    $progress.reinit,
    stopTimerTriggered,
  ],
})

sample({
  clock: resetTimerTriggered,
  target: [
    $passingTime,
    $progress.reinit,
    $isWorkTime.reinit,
    $kvStages.reinit,
    $activeStageId.reinit,
    stopTimerTriggered,
  ],
})
sample({
  clock: resetTimerTriggered,
  source: $selectedTime,
  target: [$currentStaticTime, $passingTime],
})

sample({
  clock: tick,
  source: $passingTime,
  filter: (timer) => timer <= 0,
  target: timePassed,
})
sample({
  clock: timePassed,
  target: [finishTimerFx, $progress.reinit],
})

sample({
  clock: timePassed,
  source: {
    selectedTime: $selectedTime,
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId < LONG_BREAK_STAGE && !isWorkTime,
  greedy: true,
  fn: ({ selectedTime }) => selectedTime,
  target: [$passingTime, $currentStaticTime, toggleTimerState],
})

sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    shortBreakTime: $shortBreakTime,
  },
  greedy: true,
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId < LONG_BREAK_STAGE && isWorkTime,
  fn: ({ shortBreakTime }) => shortBreakTime,
  target: [$passingTime, $currentStaticTime, toggleTimerState],
})

sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    longBreakTime: $longBreakTime,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId == LONG_BREAK_STAGE && isWorkTime,
  fn: ({ longBreakTime }) => longBreakTime,
  target: [$passingTime, $currentStaticTime, toggleTimerState],
})

sample({
  clock: timePassed,
  source: { activeStageId: $activeStageId, kv: $kvStages },
  fn: ({ activeStageId, kv }) => ({
    ...kv,
    [activeStageId]: { fulfilled: true },
  }),
  target: $kvStages,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
  },
  filter: ({ isWorkTime }) => isWorkTime,
  fn: ({ activeStageId }) => activeStageId + 1,
  target: $activeStageId,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId == LONG_BREAK_STAGE && !isWorkTime,
  target: [resetTimerTriggered],
})
