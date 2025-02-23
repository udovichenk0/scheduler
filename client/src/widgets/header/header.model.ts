import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { createPomodoro } from "@/shared/lib/pomodoro"

import sound from "./assets/timer.mp3"

const notificationSound = new Audio(sound)
const {
  $workDuration,
  $shortBreakDuration,
  $longBreakDuration,
  $isEnabledAutomaticStart,
  $isEnabledNotificationSound,
} = $$pomodoroSettings

export const $$pomodoro = createPomodoro({
  $workDuration,
  $shortBreakDuration,
  $longBreakDuration,
  $isEnabledAutomaticStart,
  $isEnabledNotificationSound,
  notificationSound,
})
