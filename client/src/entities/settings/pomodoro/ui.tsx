import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import {
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
} from "./model"
import style from "./style.module.css"

export const PomodoroSettings = () => {
  const [
    changeWorkDuration,
    changeShortBreak,
    changeLongBreak,
    workDuration,
    shortBreak,
    longBreak,
    applySettings,
    enableAutomaticTimerStart,
    startAutomatically,
    isEnabledNotificationSound,
    setSoundInTheEndTriggered,
  ] = useUnit([
    workDurationChanged,
    shortBreakDurationChanged,
    longBreakDurationChanged,
    $workDuration,
    $shortBreakDuration,
    $longBreakDuration,
    settingsApplied,
    automaticTimerStartEnabled,
    $isEnabledAutomaticStart,
    $isEnabledNotificationSound,
    notificationSoundEnabled,
  ])

  const pomodoroData = [
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
  ]
  return (
    <div className="px-16">
      <div className="mb-6 space-y-3">
        {pomodoroData.map((item, index) => (
          <div className="flex" key={index}>
            <div className="w-1/2 text-end">
              <span>{item.label}</span>
            </div>
            <div>
              <PomodoroInput
                onSubmit={applySettings}
                onChange={item.onChange}
                className="ml-1 mr-2"
                value={item.value}
              />
              <span>{item.rightText}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex gap-3">
          <Checkbox
            checked={startAutomatically}
            onChange={enableAutomaticTimerStart}
          />
          <span>Show over all windows when changing the period</span>
        </div>
        <div className="flex gap-3">
          <Checkbox
            checked={isEnabledNotificationSound}
            onChange={setSoundInTheEndTriggered}
          />
          <span>Notification sound in the end of each period</span>
        </div>
      </div>
    </div>
  )
}

function PomodoroInput({
  value,
  onChange,
  className,
  onSubmit,
}: {
  value: number
  onChange: (value: number) => void
  className?: string
  onSubmit: (val: string) => void
}) {
  return (
    <input
      onBlur={(e) => onSubmit(e.target.value)}
      className={clsx(
        style.removeArrow,
        "w-16 appearance-none rounded-[5px] border-2 border-cSecondBorder bg-transparent text-center",
        className,
      )}
      type="number"
      onChange={(e) => onChange(+e.target.value)}
      value={value}
    />
  )
}