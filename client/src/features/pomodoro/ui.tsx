import { useUnit } from "effector-react"
import { ReactNode } from "react"

import { $workDuration, $customDuration } from "@/entities/settings/pomodoro"

import { ModalType } from "@/shared/lib/modal"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal"
import { Container } from "@/shared/ui/general/container"

import {
  $passingTime,
  $isPomodoroRunning,
  startTimerTriggered,
  stopTimerTriggered,
  timeSelected,
  resetTimerTriggered,
  $isWorkTime,
  $stages,
  DEFAULT_PROGRESS_BAR,
  $currentStaticTime,
} from "./pomodoro.model"
import { ProgressCircle } from "./ui/circle-progress"
import { StartButton } from "./ui/start-button"

const defaultDurations = [
  { time: 5 },
  { time: 10 },
  { time: 15 },
  { time: 20 },
  { time: 25 },
  { time: 30 },
  { time: 45 },
  { time: 60 },
]
const calculateCircleDiameter = (time: number) => {
  return Math.ceil(2 * Math.sqrt(time)) + 5
}
export const Pomodoro = ({
  leftSlot,
  taskTitle,
  modal,
}: {
  leftSlot: ReactNode
  taskTitle?: string
  modal: ModalType
}) => {
  const [
    changeTimer,
    startTimer,
    passingTime,
    isTicking,
    stopTimer,
    resetTimer,
    isWorkTime,
    stages,
    workDuration,
    currentStaticTime,
    customDuration,
  ] = useUnit([
    timeSelected,
    startTimerTriggered,
    $passingTime,
    $isPomodoroRunning,
    stopTimerTriggered,
    resetTimerTriggered,
    $isWorkTime,
    $stages,
    $workDuration,
    $currentStaticTime,
    $customDuration,
  ])
  const durations = setCustomDuration({
    defaultDurations,
    customDuration: customDuration,
  })
  const circleProgress =
    DEFAULT_PROGRESS_BAR -
    ((currentStaticTime - passingTime) / currentStaticTime) *
      DEFAULT_PROGRESS_BAR
  return (
    <BaseModal modal={modal} className="w-[320px]" title="Pomodoro">
      <div className="px-4">
        <div className="mb-7 flex items-center justify-around">
          {durations.map(({ time }) => {
            const timeInSecond = time * 60
            const activeTimer = workDuration === time
            return (
              <div
                key={time}
                className="flex h-[60px] cursor-pointer flex-col items-center justify-between"
                onClick={() => changeTimer(timeInSecond)}
              >
                <div className="flex h-10 items-center">
                  <div
                    style={{
                      width: calculateCircleDiameter(time),
                      height: calculateCircleDiameter(time),
                    }}
                    className={`${
                      activeTimer && "border-cPomodoroRed bg-cPomodoroRed"
                    } flex items-center justify-center rounded-full border-2 border-cIconDefault`}
                  >
                    {activeTimer && (
                      <Icon name="common/done" className="w-[7px]" />
                    )}
                  </div>
                </div>
                <span className="text-[12px] text-cIconDefault">{time}</span>
              </div>
            )
          })}
        </div>
        {taskTitle && (
          <Container
            rounded="base"
            padding="sm"
            className="mb-3 bg-cHover text-center"
          >
            {taskTitle}
          </Container>
        )}
        <ProgressCircle
          isWorkTime={isWorkTime}
          time={passingTime}
          progress={circleProgress}
          stages={stages}
        />
        <div className="mt-4 flex justify-between">
          {leftSlot}
          <StartButton
            isWorkTime={isWorkTime}
            stop={stopTimer}
            start={startTimer}
            isTicking={isTicking}
          />
          <Button intent={"primary"} size={"xs"} onClick={resetTimer}>
            <Icon
              name="common/reset"
              className="text-[24px] text-cIconDefault"
            />
          </Button>
        </div>
      </div>
    </BaseModal>
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
