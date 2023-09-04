import { useUnit } from "effector-react"
import { ReactNode } from "react"

import { $$pomodoroSettings } from "@/entities/settings/pomodoro"

import { ModalType } from "@/shared/lib/modal"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { MainModal } from "@/shared/ui/modals/main"
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
  $currentStaticTime,
} from "./pomodoro.model"
import { ProgressCircle } from "./ui/circle-progress"
import { StartButton } from "./ui/start-button"
import { setCustomDuration } from "./config"

const { $workDuration, $customDuration } = $$pomodoroSettings
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
    startTimer,
    passingTime,
    isTicking,
    stopTimer,
    resetTimer,
    isWorkTime,
    stages,
    currentStaticTime,
  ] = useUnit([
    startTimerTriggered,
    $passingTime,
    $isPomodoroRunning,
    stopTimerTriggered,
    resetTimerTriggered,
    $isWorkTime,
    $stages,
    $currentStaticTime,
  ])
  return (
    <MainModal modal={modal} className="w-[320px]" title="Pomodoro">
      <div className="px-4">
        <PomodoroDurations />
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
          staticTime={currentStaticTime}
          isWorkTime={isWorkTime}
          time={passingTime}
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
    </MainModal>
  )
}
const PomodoroDurations = () => {
  const [selectTime, customDuration, workDuration] = useUnit([
    timeSelected,
    $customDuration,
    $workDuration,
  ])
  const durations = setCustomDuration({
    defaultDurations,
    customDuration: customDuration,
  })
  return (
    <div className="mb-7 flex items-center justify-around">
      {durations.map(({ time }) => {
        const timeInSecond = time * 60
        const activeTimer = workDuration === time
        return (
          <div
            key={time}
            className="flex h-[60px] cursor-pointer flex-col items-center justify-between"
            onClick={() => selectTime(timeInSecond)}
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
                {activeTimer && <Icon name="common/done" className="w-[7px]" />}
              </div>
            </div>
            <span className="text-[12px] text-cIconDefault">{time}</span>
          </div>
        )
      })}
    </div>
  )
}
