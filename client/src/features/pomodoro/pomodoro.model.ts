import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector"
import { condition, interval, not } from "patronum"

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
export const DEFAULT_PROGRESS_BAR = 848 // if 785 then progress is 0% otherwise its 100%
const LAST_STAGE = 4
const MAX_STAGES_LENGTH = 12
export const audio = new Audio(sound)

const defaultStages = {
  0: {
    fulfilled: false,
  },
  1: {
    fulfilled: false,
  },
  2: {
    fulfilled: false,
  },
  3: {
    fulfilled: false,
  },
}
export const timeSelected = createEvent<number>()
export const startTimerTriggered = createEvent()
export const stopTimerTriggered = createEvent()
export const resetTimerTriggered = createEvent()
const toggleTimerState = createEvent()
const timePassed = createEvent()
const activeIdChanged = createEvent()

const $kvStages = createStore(defaultStages)

export const $stages = $kvStages.map((stages) => {
  return Object.values(stages)
})

const $activeStageId = createStore(0)

export const $currentStaticTime = createStore(DEFAULT_WORK_TIME)
export const $passingTime = createStore(DEFAULT_WORK_TIME)

export const $isWorkTime = createStore(true).on(
  toggleTimerState,
  (isWorkTime) => !isWorkTime,
)

export const $audio = createStore(audio)

export const { tick, isRunning: $isPomodoroRunning } = interval({
  start: startTimerTriggered,
  stop: stopTimerTriggered,
  timeout: 1000,
})

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

const finishTimerFx = attach({
  source: $audio,
  effect: createEffect((timer: HTMLAudioElement) => {
    timer.play()
  }),
})

sample({
  clock: appStarted,
  source: $workDuration,
  fn: (duration) => duration * 60,
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

const workDone = createEvent()
const breakDone = createEvent()
const longBreakTriggered = createEvent()
const shortBreakTriggered = createEvent()
sample({
  clock: timePassed,
  filter: $isWorkTime,
  target: [toggleTimerState, activeIdChanged, workDone],
  greedy: true,
})

condition({
  source: sample({
    clock: workDone,
    source: $activeStageId,
  }),
  if: (activeStageId) => Boolean(activeStageId % LAST_STAGE),
  then: shortBreakTriggered,
  else: longBreakTriggered,
})

sample({
  clock: shortBreakTriggered,
  source: $shortBreakDuration,
  fn: (shortBreakDuration) => shortBreakDuration * 60,
  target: [$currentStaticTime, $passingTime],
})
sample({
  clock: longBreakTriggered,
  source: $longBreakDuration,
  fn: (longBreakDuration) => longBreakDuration * 60,
  target: [$currentStaticTime, $passingTime],
})

sample({
  clock: timePassed,
  filter: not($isWorkTime),
  greedy: true,
  target: [breakDone, toggleTimerState],
})

const shortBreakPassed = createEvent()
const longBreakPassed = createEvent()

condition({
  source: sample({
    clock: breakDone,
    source: $activeStageId,
  }),
  if: (activeStageId) => Boolean(activeStageId % LAST_STAGE),
  then: shortBreakPassed,
  else: longBreakPassed,
})

sample({
  clock: shortBreakPassed,
  source: $isEnabledAutomaticStart,
  filter: (startAutomatically) => !startAutomatically,
  target: stopTimerTriggered,
})
sample({
  clock: shortBreakPassed,
  source: $workDuration,
  fn: (workDuration) => workDuration * 60,
  target: [$passingTime, $currentStaticTime],
})
sample({
  clock: longBreakPassed,
  source: $shortBreakDuration,
  fn: (shortBreakDuration) => shortBreakDuration * 60,
  target: [$isWorkTime.reinit, $currentStaticTime, $passingTime],
})
sample({
  clock: longBreakPassed,
  source: $stages,
  filter: (stages) => stages.length === MAX_STAGES_LENGTH,
  target: resetTimerTriggered,
})
sample({
  clock: longBreakPassed,
  source: { kv: $kvStages, activeStageId: $activeStageId },
  fn: ({ kv, activeStageId }) => {
    let lastActiveStageId = activeStageId
    const newStages: { fulfilled: boolean }[] = new Array(4).fill({
      fulfilled: false,
    })
    const newStagesIntoKv = newStages.reduce(
      (acc, stage) => {
        acc[lastActiveStageId] = stage
        lastActiveStageId += 1
        return acc
      },
      {} as Record<number, { fulfilled: boolean }>,
    )
    return { ...kv, ...newStagesIntoKv }
  },
  target: $kvStages,
})
