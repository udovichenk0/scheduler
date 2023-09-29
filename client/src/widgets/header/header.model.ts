import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { createModal } from "@/shared/lib/modal"
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
export const $$pomodoroModal = createModal({ closeOnClickOutside: true })
export const $$settingsModal = createModal({ closeOnClickOutside: true })
export const $$pomodoro = createPomodoro({
  $workDuration,
  $shortBreakDuration,
  $longBreakDuration,
  $isEnabledAutomaticStart,
  $isEnabledNotificationSound,
  notificationSound,
})
