import { createEvent, createStore, sample } from "effector"
import { persist } from "effector-storage/local"

const DEFAULT_WORK_DURATION = 10
const MAX_WORK_DURATION = 120
const MIN_WORK_DURATION = 1

const DEFAULT_SHORT_BREAK = 5
const MAX_SHORT_BREAK = 120
const MIN_SHORT_BREAK = 1

const DEFAULT_LONG_BREAK = 15
const MAX_LONG_BREAK = 120
const MIN_LONG_BREAK = 1

export const workDurationChanged = createEvent<number>()
export const shortBreakDurationChanged = createEvent<number>()
export const longBreakDurationChanged = createEvent<number>()
export const longBreakFrequencyChanged = createEvent<number>()
export const settingsApplied = createEvent()
export const customDurationChanged = createEvent<number>()
export const automaticTimerStartEnabled = createEvent()
export const notificationSoundEnabled = createEvent()
export const $customDuration = createStore(DEFAULT_WORK_DURATION).on(
  customDurationChanged,
  (_, value) => value,
)

export const $workDuration = createStore(DEFAULT_WORK_DURATION).on(
  workDurationChanged,
  (_, value) => value,
)
export const $shortBreakDuration = createStore(DEFAULT_SHORT_BREAK).on(
  shortBreakDurationChanged,
  (_, value) => value,
)
export const $longBreakDuration = createStore(DEFAULT_LONG_BREAK).on(
  longBreakDurationChanged,
  (_, value) => value,
)
export const $isEnabledAutomaticStart = createStore(false).on(
  automaticTimerStartEnabled,
  (value) => !value,
)
export const $isEnabledNotificationSound = createStore(false).on(
  notificationSoundEnabled,
  (value) => !value,
)

sample({
  clock: settingsApplied,
  source: $workDuration,
  filter: (workDuration) =>
    workDuration >= MIN_WORK_DURATION && workDuration <= MAX_WORK_DURATION,
  target: $customDuration,
})
sample({
  clock: settingsApplied,
  source: $workDuration,
  filter: (workDuration) => workDuration > MAX_WORK_DURATION,
  fn: () => MAX_WORK_DURATION,
  target: [$workDuration, $customDuration],
})

sample({
  clock: settingsApplied,
  source: $workDuration,
  filter: (workDuration) => workDuration < MIN_WORK_DURATION,
  fn: () => MIN_WORK_DURATION,
  target: [$workDuration, $customDuration],
})

sample({
  clock: settingsApplied,
  source: $shortBreakDuration,
  filter: (shortBreak) => shortBreak < MIN_SHORT_BREAK,
  fn: () => MIN_SHORT_BREAK,
  target: $shortBreakDuration,
})
sample({
  clock: settingsApplied,
  source: $shortBreakDuration,
  filter: (shortBreak) => shortBreak > MAX_SHORT_BREAK,
  fn: () => MAX_SHORT_BREAK,
  target: $shortBreakDuration,
})

sample({
  clock: settingsApplied,
  source: $longBreakDuration,
  filter: (longBreak) => longBreak < MIN_LONG_BREAK,
  fn: () => MIN_LONG_BREAK,
  target: $longBreakDuration,
})
sample({
  clock: settingsApplied,
  source: $longBreakDuration,
  filter: (longBreak) => longBreak > MAX_LONG_BREAK,
  fn: () => MAX_LONG_BREAK,
  target: $longBreakDuration,
})

persist({
  store: $workDuration,
  key: "workDuration",
})
persist({
  store: $shortBreakDuration,
  key: "shortBreak",
})
persist({
  store: $longBreakDuration,
  key: "longBreak",
})
persist({
  store: $customDuration,
  key: "customDuration",
})
persist({
  store: $isEnabledAutomaticStart,
  key: "startTimerAutomatically",
})
persist({
  store: $isEnabledNotificationSound,
  key: "notificationSound",
})
