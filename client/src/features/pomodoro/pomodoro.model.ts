import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector"
import { interval } from "patronum"
import {
  $longBreakDuration,
  $isEnabledNotificationSound,
  $shortBreakDuration,
  $isEnabledAutomaticStart,
  $workDuration,
  workDurationChanged,
} from "@/entities/settings/pomodoro"
import { appStarted } from "@/shared/config/init"
import sound from "./assets/timer.mp3"

const DEFAULT_WORK_TIME = 1500 // 25mins
export const DEFAULT_PROGRESS_BAR = 785 // if 785 then progress is 0% otherwise its 100%
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

export const $currentStaticTime = createStore(DEFAULT_WORK_TIME)
export const $passingTime = createStore(DEFAULT_WORK_TIME)

export const $isWorkTime = createStore(true).on(
  toggleTimerState,
  (isWorkTime) => !isWorkTime,
)

export const $audio = createStore(audio)

export const { tick, isRunning: $isTicking } = interval({
  start: startTimerTriggered,
  stop: stopTimerTriggered,
  timeout: 100,
})

const finishTimerFx = attach({
  source: $audio,
  effect: createEffect((timer: HTMLAudioElement) => {
    timer.play()
  }),
})

sample({
  clock: appStarted,
  source: $workDuration,
  fn: (duration) => duration * 10,
  target: [$currentStaticTime, $passingTime],
})
sample({
  clock: tick,
  source: $passingTime,
  fn: (timer) => timer - 1,
  target: $passingTime,
})

sample({
  clock: timeSelected,
  target: [
    $passingTime,
    $currentStaticTime,
    stopTimerTriggered,
    $isWorkTime.reinit,
    $activeStageId.reinit,
    $kvStages.reinit,
  ],
})
sample({
  clock: timeSelected,
  fn: (time) => time / 60,
  target: workDurationChanged,
})

sample({
  clock: workDurationChanged,
  fn: (duration) => duration * 60,
  target: [$currentStaticTime, $passingTime],
})

sample({
  clock: resetTimerTriggered,
  target: [
    $isWorkTime.reinit,
    $kvStages.reinit,
    $activeStageId.reinit,
    stopTimerTriggered,
  ],
})
sample({
  clock: resetTimerTriggered,
  source: $workDuration,
  fn: (duration) => duration * 60,
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
  filter: $isEnabledNotificationSound,
  target: finishTimerFx,
})

const activeIdChanged = createEvent()
sample({
  clock: activeIdChanged,
  source: { activeStageId: $activeStageId, kv: $kvStages },
  fn: ({ activeStageId, kv }) => ({
    ...kv,
    [activeStageId]: { fulfilled: true },
  }),
  target: $kvStages,
})
sample({
  clock: activeIdChanged,
  source: $activeStageId,
  fn: (activeStageId) => activeStageId + 1,
  target: $activeStageId,
})

sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId > LONG_BREAK_STAGE && !isWorkTime,
  greedy: true,
  target: resetTimerTriggered,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    shortBreakDuration: $shortBreakDuration,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId < LONG_BREAK_STAGE && isWorkTime,
  fn: ({ shortBreakDuration }) => shortBreakDuration * 60,
  target: [toggleTimerState, $currentStaticTime, $passingTime, activeIdChanged],
  greedy: true,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    longBreakDuration: $longBreakDuration,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId == LONG_BREAK_STAGE && isWorkTime,
  fn: ({ longBreakDuration }) => longBreakDuration * 60,
  target: [toggleTimerState, $currentStaticTime, $passingTime, activeIdChanged],
  greedy: true,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    workDuration: $workDuration,
    startAutomatically: $isEnabledAutomaticStart,
  },
  filter: ({ activeStageId, isWorkTime, startAutomatically }) =>
    activeStageId <= LONG_BREAK_STAGE && !isWorkTime && !startAutomatically,
  target: stopTimerTriggered,
  greedy: true,
})
sample({
  clock: timePassed,
  source: {
    activeStageId: $activeStageId,
    isWorkTime: $isWorkTime,
    workDuration: $workDuration,
  },
  filter: ({ activeStageId, isWorkTime }) =>
    activeStageId <= LONG_BREAK_STAGE && !isWorkTime,
  fn: ({ workDuration }) => workDuration * 60,
  target: [$passingTime, $currentStaticTime, toggleTimerState],
  greedy: true,
})
