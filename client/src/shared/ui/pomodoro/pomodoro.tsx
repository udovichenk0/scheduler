import { ReactNode } from "react"
import { Store } from "effector"
import { useUnit } from "effector-react"

import { CreatePomodoro } from "@/shared/lib/pomodoro"

import { Button } from "../buttons/main-button"
import { Icon } from "../icon"

import { StartButton } from "./ui/start-button"
import { PomodoroDurations } from "./ui/work-durations"
import { ProgressCircle } from "./ui/circle-progress"

export const Pomodoro = ({
  leftSlot,
  $customDuration,
  pomodoroModel,
}: {
  leftSlot: ReactNode
  $customDuration: Store<number>
  pomodoroModel: CreatePomodoro
}) => {
  const {
    timeSelected,
    $workDuration,
    $currentStaticTime,
    $isWorkTime,
    $tickingTime,
    $stages,
    $isPomodoroRunning,
    startTimerTriggered,
    stopTimerTriggered,
    resetTimerTriggered,
  } = pomodoroModel
  const {
    start,
    stop,
    reset
  } = useUnit({
    start: startTimerTriggered,
    stop: stopTimerTriggered,
    reset: resetTimerTriggered
  })
  return (
    <div className="px-4">
      <PomodoroDurations
        timeSelected={timeSelected}
        $customDuration={$customDuration}
        $workDuration={$workDuration}
        setDuration={setCustomDuration}
      />
      <ProgressCircle
        $staticTime={$currentStaticTime}
        $isWorkTime={$isWorkTime}
        $time={$tickingTime}
        $stages={$stages}
      />
      <div className="mt-4 flex justify-between">
        {leftSlot}

        <StartButton
          $isWorkTime={$isWorkTime}
          stop={stop}
          start={start}
          $isTicking={$isPomodoroRunning}
        />

        <Button intent={"primary"} size={"xs"} onClick={reset}>
          <Icon name="common/reset" className="text-[24px] text-cIconDefault" />
        </Button>
      </div>
    </div>
  )
}
function setCustomDuration({
  defaultDurations,
  customDuration,
}: {
  defaultDurations: { time: number }[]
  customDuration: number
}) {
  const customDurationMatchDefault = defaultDurations.find(
    (item) => item.time === customDuration,
  )
  if (customDurationMatchDefault) {
    return defaultDurations
  }
  return [...defaultDurations, { time: customDuration, custom: true }].sort(
    (a, b) => a.time - b.time,
  )
}
