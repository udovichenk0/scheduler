import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Checkbox } from "@/shared/ui/data-entry/checkbox"

import { $$pomodoroSettings } from "./model"
import { PomodoroInput } from "./ui/input"

const {
  $longBreakDuration,
  $isEnabledNotificationSound,
  $shortBreakDuration,
  $isEnabledAutomaticStart,
  $workDuration,
  longBreakDurationChanged,
  shortBreakDurationChanged,
  notificationSoundEnabled,
  settingsApplied,
  workDurationChanged,
  automaticTimerStartEnabled,
} = $$pomodoroSettings

export const PomodoroSettings = () => {
  return (
    <div className="px-16">
      <SettingsWithInputs />
      <SettingsWithCheckboxes />
    </div>
  )
}

const SettingsWithInputs = () => {
  const { t } = useTranslation()
  const [
    changeWorkDuration,
    changeShortBreak,
    changeLongBreak,
    workDuration,
    shortBreak,
    longBreak,
    applySettings,
  ] = useUnit([
    workDurationChanged,
    shortBreakDurationChanged,
    longBreakDurationChanged,
    $workDuration,
    $shortBreakDuration,
    $longBreakDuration,
    settingsApplied,
  ])

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-end">
        <span>{t("setting.pomodoro.workDuration")}:</span>
        <PomodoroInput
          onSubmit={applySettings}
          onChange={changeWorkDuration}
          className="ml-1 mr-2"
          value={workDuration}
        />
        <span>{t("setting.pomodoro.minutes")}</span>
      </div>
      <div className="flex items-center justify-end">
        <span>{t("setting.pomodoro.shortBreakDuration")}:</span>
        <PomodoroInput
          onSubmit={applySettings}
          onChange={changeShortBreak}
          className="ml-1 mr-2"
          value={shortBreak}
        />
        <span>{t("setting.pomodoro.minutes")}</span>
      </div>
      <div className="flex items-center justify-end">
        <span>{t("setting.pomodoro.longBreakDuration")}:</span>
        <PomodoroInput
          onSubmit={applySettings}
          onChange={changeLongBreak}
          className="ml-1 mr-2"
          value={longBreak}
        />
        <span>{t("setting.pomodoro.minutes")}</span>
      </div>
    </div>
  )
}

const SettingsWithCheckboxes = () => {
  const { t } = useTranslation()
  const [
    enableAutomaticTimerStart,
    startAutomatically,
    isEnabledNotificationSound,
    setSoundInTheEndTriggered,
  ] = useUnit([
    automaticTimerStartEnabled,
    $isEnabledAutomaticStart,
    $isEnabledNotificationSound,
    notificationSoundEnabled,
  ])
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Checkbox
          iconClassName="fill-cTaskEditDefault"
          checked={startAutomatically}
          onChange={enableAutomaticTimerStart}
        />
        <span>{t("setting.pomodoro.startAutomatically")}</span>
      </div>

      <div className="flex gap-3">
        <Checkbox
          checked={isEnabledNotificationSound}
          onChange={setSoundInTheEndTriggered}
        />
        <span>{t("setting.pomodoro.notifySound")}</span>
      </div>
    </div>
  )
}
