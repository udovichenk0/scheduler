import { useUnit } from "effector-react";
import { ReactNode } from "react";
import { IconButton } from "@/shared/ui/buttons/icon-button";
import { Icon } from "@/shared/ui/icon";
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
  $selectedTime
 } from "./pomodoro.model";
import { ProgressCircle } from "./ui/circle-progress";
import { StartButton } from "./ui/start-button";

const timers = [
  {time: 5},
  {time: 10},
  {time: 15},
  {time: 20},
  {time: 25},
  {time: 30},
  {time: 45},
  {time: 60},
]

const calculateCircleDiameter = (time: number) => {
  return Math.ceil(2 * Math.sqrt(time)) + 5;
};
export const Pomodoro = ({
  leftSlot
}: {
  leftSlot: ReactNode
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
    selectedTime
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
    $selectedTime
  ])
  return (
    <div className="px-4">
      <div className="flex justify-around items-center">
        {timers.map(({time}) => {
          const timeInSecond = time * 60
          const activeTimer = selectedTime === timeInSecond 
          return (
          <button key={time} 
          className="h-[60px] flex flex-col justify-between items-center"
          onClick={() => changeTimer(timeInSecond)}
          >
            <div className="h-10 flex items-center">
              <div style={{width: calculateCircleDiameter(time), height: calculateCircleDiameter(time)}} 
              className={`${activeTimer && 'bg-cPomodoroRed border-cPomodoroRed'} 
              text-start flex items-center rounded-full justify-center border-2 border-cIconDefault`}>
                {activeTimer && (
                <Icon name="common/done" className="w-[7px] h-[7px]"/>
                )}
              </div>
            </div>
            <span className="text-[12px] text-cIconDefault">{time}</span>
          </button>
          )
        })}
      </div>
      <div className="relative">
        <ProgressCircle 
          textStyle={`${isWorkTime ? 'fill-cPomodoroRed' : 'fill-cPomodoroGreen'}`}
          circleStyle={`${isWorkTime ? 'stroke-cPomodoroRed' : 'stroke-cPomodoroGreen'}`}
          progressStyle={`${isWorkTime ? 'stroke-cPomodoroRed' : 'stroke-cPomodoroGreen'}`}
          time={defaultTimer} 
          timeLeft={leftTime}/>
          <div className="flex gap-2 absolute bottom-20 left-28">
            {stages.map(({fulfilled}, id) => {
              return (
                <div
                  key={id} 
                  className={`border-2 border-cPomodoroRed rounded-full w-[10px] h-[10px] ${fulfilled && 'bg-cPomodoroRed' }`}/>
              )
            })}
          </div>
      </div>
        <div className="flex justify-between mt-4">
          {leftSlot}
          <StartButton 
            isWorkTime={isWorkTime}
            stop={stopTimer} 
            start={startTimer} 
            isTicking={isTicking}/>
          <IconButton
            onClick={() => resetTimer()}
            className="text-[24px] text-cIconDefault"
            iconName="common/reset" 
            intent={'primary'} 
            size={'xs'}/>
        </div>
    </div>
  )
}
