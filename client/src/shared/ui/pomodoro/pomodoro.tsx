import { ReactNode } from "react"
import { Store } from "effector"
import { useUnit } from "effector-react"

import { PomodoroFactory } from "@/shared/lib/pomodoro"
import { onMount } from "@/shared/lib/react"

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
  pomodoroModel: PomodoroFactory
}) => {
  const {
    timeSelected,
    $workDuration,
    $currentStaticTime,
    $tickingTime,
    $stages,
    $state,
    $isPomodoroRunning,
    startTimerTriggered,
    stopTimerTriggered,
    resetTimerTriggered,
    init,
  } = pomodoroModel
  const { start, stop, reset, onInit } = useUnit({
    start: startTimerTriggered,
    stop: stopTimerTriggered,
    reset: resetTimerTriggered,
    onInit: init,
  })
  onMount(onInit)
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
        $state={$state}
        $time={$tickingTime}
        $stages={$stages}
      />
      <div className="mt-4 flex justify-between">
        {leftSlot}

        <StartButton
          $state={$state}
          stop={stop}
          start={start}
          $isTicking={$isPomodoroRunning}
        />

        <Button intent={"primary"} size={"xs"} onClick={reset}>
          <Icon name="common/reset" className="text-[24px] text-cIconDefault" />
          <span className="sr-only">Reset the timer</span>
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
