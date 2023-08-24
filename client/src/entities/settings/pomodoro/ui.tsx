import { useUnit } from "effector-react"
import { useState } from "react"

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

  const [pomodoroData] = useState([
    {
      label: "Work duration:",
      value: workDuration,
      rightText: "minutes",
      onChange: changeWorkDuration,
    },
    {
      label: "Short break:",
      value: shortBreak,
      rightText: "minutes",
      onChange: changeShortBreak,
    },
    {
      label: "Long break:",
      value: longBreak,
      rightText: "minutes",
      onChange: changeLongBreak,
    },
  ])
  return (
    <div className="mb-6 space-y-3">
      {pomodoroData.map((item, index) => (
        <div className="flex items-center justify-end" key={index}>
          <span>{item.label}</span>
          <PomodoroInput
            onSubmit={applySettings}
            onChange={item.onChange}
            className="ml-1 mr-2"
            value={item.value}
          />
          <span>{item.rightText}</span>
        </div>
      ))}
    </div>
  )
}

const SettingsWithCheckboxes = () => {
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
        <span>Start the next period automatically</span>
      </div>

      <div className="flex gap-3">
        <Checkbox
          checked={isEnabledNotificationSound}
          onChange={setSoundInTheEndTriggered}
        />
        <span>Notification sound in the end of each period</span>
      </div>
    </div>
  )
}
