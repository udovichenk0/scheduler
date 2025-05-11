import { createEvent, createStore, sample, Event } from "effector"
import * as z from "@zod/mini"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { singleton } from "@/shared/lib/effector/singleton"
import { bridge } from "@/shared/lib/effector/bridge.ts"

import {
  DEFAULT_WORK_DURATION,
  DEFAULT_SHORT_BREAK,
  DEFAULT_LONG_BREAK,
  MIN_WORK_DURATION,
  MAX_WORK_DURATION,
  MIN_SHORT_BREAK,
  MAX_SHORT_BREAK,
  MIN_LONG_BREAK,
  MAX_LONG_BREAK,
} from "./config"

export const $$pomodoroSettings = singleton(() => {
  const init = createEvent()

  const workDurationChanged = createEvent<string>()
  const shortBreakDurationChanged = createEvent<string>()
  const longBreakDurationChanged = createEvent<string>()
  const longBreakFrequencyChanged = createEvent<number>()
  const settingsApplied = createEvent()
  const customDurationChanged = createEvent<number>()
  const automaticTimerStartEnabled = createEvent()
  const notificationSoundEnabled = createEvent()

  const $customDuration = createStore(DEFAULT_WORK_DURATION).on(
    customDurationChanged,
    (_, value) => value,
  )

  const $workDuration = createStore(DEFAULT_WORK_DURATION)
  const $shortBreakDuration = createStore(DEFAULT_SHORT_BREAK)
  const $longBreakDuration = createStore(DEFAULT_LONG_BREAK)

  const $isEnabledAutomaticStart = createStore(0).on(
    automaticTimerStartEnabled,
    (value) => Number(!value),
  )
  const $isEnabledNotificationSound = createStore(0).on(
    notificationSoundEnabled,
    (value) => Number(!value),
  )

  function convertToNum(event: Event<string>) {
    return sample({
      clock: event,
      filter: (value) => !!Number(value) || value === "",
      fn: Number,
    })
  }
  // change input value on onChange
  bridge(() => {
    sample({
      clock: convertToNum(workDurationChanged),
      target: $workDuration,
    })
    sample({
      clock: convertToNum(shortBreakDurationChanged),
      target: $shortBreakDuration,
    })

    sample({
      clock: convertToNum(longBreakDurationChanged),
      target: $longBreakDuration,
    })
  })

  // change input value on onBlur
  bridge(() => {
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
  })
  bridge(() => {
    const strToNumSchema = z.coerce.number()
    const initWorkDuration = cookiePersist({
      source: $workDuration,
      name: "workDuration",
      schema: strToNumSchema,
    })
    const initShortBreakDuration = cookiePersist({
      source: $shortBreakDuration,
      name: "shortBreak",
      schema: strToNumSchema,
    })
    const initLongBreakDuration = cookiePersist({
      source: $longBreakDuration,
      name: "longBreak",
      schema: strToNumSchema,
    })
    const initCustomDuration = cookiePersist({
      source: $customDuration,
      name: "customDuration",
      schema: strToNumSchema,
    })
    const initStartTimerAutomatically = cookiePersist({
      source: $isEnabledAutomaticStart,
      name: "startTimerAutomatically",
      schema: strToNumSchema,
    })
    const initNotificationSound = cookiePersist({
      source: $isEnabledNotificationSound,
      name: "notificationSound",
      schema: strToNumSchema,
    })
    sample({
      clock: init,
      target: [
        initWorkDuration,
        initShortBreakDuration,
        initLongBreakDuration,
        initCustomDuration,
        initStartTimerAutomatically,
        initNotificationSound,
      ],
    })
  })
  return {
    init,
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
    $isEnabledAutomaticStart: $isEnabledAutomaticStart.map(Boolean),
    $isEnabledNotificationSound: $isEnabledNotificationSound.map(Boolean),
  }
})
