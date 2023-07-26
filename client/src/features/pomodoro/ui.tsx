import { useUnit } from "effector-react"
import { ReactNode } from "react"
import { ModalType } from "@/shared/lib/modal"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal"
import {
  $passingTime,
  $isTicking,
  $progress,
  startTimerTriggered,
  stopTimerTriggered,
  timeSelected,
  resetTimerTriggered,
  $isWorkTime,
  $stages,
  $selectedTime,
} from "./pomodoro.model"
import { ProgressCircle } from "./ui/circle-progress"
import { StartButton } from "./ui/start-button"

const timers = [
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
    leftTime,
    defaultTimer,
    isTicking,
    stopTimer,
    resetTimer,
    isWorkTime,
    stages,
    selectedTime,
  ] = useUnit([
    timeSelected,
    startTimerTriggered,
    $progress,
    $passingTime,
    $isTicking,
    stopTimerTriggered,
    resetTimerTriggered,
    $isWorkTime,
    $stages,
    $selectedTime,
  ])
  return (
    <BaseModal modal={modal} className="w-[320px]" title="Pomodoro">
      <div className="px-4">
        <div className="mb-7 flex items-center justify-around">
          {timers.map(({ time }) => {
            const timeInSecond = time * 60
            const activeTimer = selectedTime === timeInSecond
            return (
              <button
                key={time}
                className="flex h-[60px] flex-col items-center justify-between"
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
                    } 
                flex items-center justify-center rounded-full border-2 border-cIconDefault text-start`}
                  >
                    {activeTimer && (
                      <Icon name="common/done" className="h-[7px] w-[7px]" />
                    )}
                  </div>
                </div>
                <span className="text-[12px] text-cIconDefault">{time}</span>
              </button>
            )
          })}
        </div>
        {taskTitle && (
          <div className="w-full rounded-[5px] bg-cHover p-[7px] text-center">
            {taskTitle}
          </div>
        )}
        <div className="relative">
          <ProgressCircle
            textStyle={`${
              isWorkTime ? "fill-cPomodoroRed" : "fill-cPomodoroGreen"
            }`}
            circleStyle={`${
              isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
            }`}
            progressStyle={`${
              isWorkTime ? "stroke-cPomodoroRed" : "stroke-cPomodoroGreen"
            }`}
            time={defaultTimer}
            timeLeft={leftTime}
          />
          <div className="absolute bottom-20 left-28 flex gap-2">
            {stages.map(({ fulfilled }, id) => {
              return (
                <div
                  key={id}
                  className={`h-[10px] w-[10px] rounded-full border-2 border-cPomodoroRed ${
                    fulfilled && "bg-cPomodoroRed"
                  }`}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {leftSlot}
          <StartButton
            isWorkTime={isWorkTime}
            stop={stopTimer}
            start={startTimer}
            isTicking={isTicking}
          />
          <IconButton
            onClick={() => resetTimer()}
            className="text-[24px] text-cIconDefault"
            iconName="common/reset"
            intent={"primary"}
            size={"xs"}
          />
        </div>
      </div>
    </BaseModal>
  )
}
