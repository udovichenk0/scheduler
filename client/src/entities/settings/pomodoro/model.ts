import { createEvent, createStore, sample } from "effector"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { singleton } from "@/shared/lib/singleton"
export const $$pomodoroSettings = singleton(() => {
  const DEFAULT_WORK_DURATION = 10
  const MAX_WORK_DURATION = 120
  const MIN_WORK_DURATION = 1

  const DEFAULT_SHORT_BREAK = 5
  const MAX_SHORT_BREAK = 120
  const MIN_SHORT_BREAK = 1

  const DEFAULT_LONG_BREAK = 15
  const MAX_LONG_BREAK = 120
  const MIN_LONG_BREAK = 1

  const workDurationChanged = createEvent<number>()
  const shortBreakDurationChanged = createEvent<number>()
  const longBreakDurationChanged = createEvent<number>()
  const longBreakFrequencyChanged = createEvent<number>()
  const settingsApplied = createEvent()
  const customDurationChanged = createEvent<number>()
  const automaticTimerStartEnabled = createEvent()
  const notificationSoundEnabled = createEvent()
  const $customDuration = createStore(DEFAULT_WORK_DURATION).on(
    customDurationChanged,
    (_, value) => value,
  )

  const $workDuration = createStore(DEFAULT_WORK_DURATION).on(
    workDurationChanged,
    (_, value) => value,
  )
  const $shortBreakDuration = createStore(DEFAULT_SHORT_BREAK).on(
    shortBreakDurationChanged,
    (_, value) => value,
  )
  const $longBreakDuration = createStore(DEFAULT_LONG_BREAK).on(
    longBreakDurationChanged,
    (_, value) => value,
  )
  const $isEnabledAutomaticStart = createStore(false).on(
    automaticTimerStartEnabled,
    (value) => !value,
  )
  const $isEnabledNotificationSound = createStore(false).on(
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

  cookiePersist({
    source: $workDuration,
    name: "workDuration",
  })
  cookiePersist({
    source: $shortBreakDuration,
    name: "shortBreak",
  })
  cookiePersist({
    source: $longBreakDuration,
    name: "longBreak",
  })
  cookiePersist({
    source: $customDuration,
    name: "customDuration",
  })
  cookiePersist({
    source: $isEnabledAutomaticStart,
    name: "startTimerAutomatically",
  })
  cookiePersist({
    source: $isEnabledNotificationSound,
    name: "notificationSound",
  })
  return {
    workDurationChanged,
    shortBreakDurationChanged,
    longBreakDurationChanged,
    longBreakFrequencyChanged,
    settingsApplied,
    customDurationChanged,
    automaticTimerStartEnabled,
    notificationSoundEnabled,
    $customDuration,
    $workDuration,
    $shortBreakDuration,
    $longBreakDuration,
    $isEnabledAutomaticStart,
    $isEnabledNotificationSound,
  }
})
